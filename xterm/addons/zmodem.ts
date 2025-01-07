import { type IDisposable, type ITerminalAddon, Terminal } from "@xterm/xterm";
import { bind } from "decko";
import { saveAs } from "file-saver";
import { TrzszFilter } from "trzsz";
import * as Zmodem from "../../zmodem.js/src/zmodem_browser";

export interface ZmodeOptions {
    zmodem: boolean;
    trzsz: boolean;
    windows: boolean;
    trzszDragInitTimeout: number;
    onSend: () => void;
    sender: (data: string | Uint8Array) => void;
    writer: (data: string | Uint8Array) => void;
}

export class ZmodemAddon implements ITerminalAddon {
    private disposables: IDisposable[] = [];
    private terminal: Terminal | undefined;
    private sentry: Zmodem.Sentry | undefined;
    private session: Zmodem.Session | undefined | null;
    private denier: (() => void) | undefined;
    private trzszFilter: TrzszFilter | undefined;

    constructor(private options: ZmodeOptions) {}

    activate(terminal: Terminal) {
        this.terminal = terminal;
        if (this.options.zmodem) this.zmodemInit();
        if (this.options.trzsz) this.trzszInit();
    }

    dispose() {
        for (const d of this.disposables) {
            d.dispose();
        }
        this.disposables.length = 0;
    }

    consume(data: ArrayBuffer) {
        try {
            if (this.options.trzsz) {
                const { trzszFilter } = this;
                if (typeof trzszFilter == "undefined") {
                    throw new Error("trzszFilter is undefined");
                }
                trzszFilter.processServerOutput(data);
            } else {
                const { sentry } = this;
                if (typeof sentry == "undefined") {
                    throw new Error("sentry is undefined");
                }
                sentry.consume(data);
            }
        } catch (e) {
            console.error("[ttyd] zmodem consume: ", e);
            this.reset();
        }
    }

    @bind
    private reset() {
        const terminal = this.terminal;
        if (typeof terminal == "undefined") {
            throw new Error("terminal is undefined");
        }
        terminal.options.disableStdin = false;
        terminal.focus();
    }

    private addDisposableListener(
        target: EventTarget,
        type: string,
        listener: EventListener,
    ) {
        target.addEventListener(type, listener);
        this.disposables.push({
            dispose: () => target.removeEventListener(type, listener),
        });
    }

    @bind
    private trzszInit() {
        const { terminal } = this;
        const { sender, writer, zmodem } = this.options;
        if (typeof terminal == "undefined") {
            throw new Error("terminal is undefined");
        }
        this.trzszFilter = new TrzszFilter({
            writeToTerminal: (data) => {
                const { trzszFilter } = this;
                if (typeof trzszFilter == "undefined") {
                    throw new Error("trzszFilter is undefined");
                }
                if (!trzszFilter.isTransferringFiles() && zmodem) {
                    const { sentry } = this;
                    if (typeof sentry == "undefined") {
                        throw new Error("sentry is undefined");
                    }
                    //@ts-ignore
                    sentry.consume(data);
                } else {
                    writer(
                        typeof data === "string"
                            ? data
                            : new Uint8Array(data as ArrayBuffer),
                    );
                }
            },
            sendToServer: (data) => sender(data),
            terminalColumns: terminal.cols,
            isWindowsShell: this.options.windows,
            dragInitTimeout: this.options.trzszDragInitTimeout,
        });
        const element = terminal.element as EventTarget;
        this.addDisposableListener(
            element,
            "dragover",
            (event) => event.preventDefault(),
        );
        this.addDisposableListener(element, "drop", (event) => {
            event.preventDefault();
            const { trzszFilter } = this;
            if (typeof trzszFilter == "undefined") {
                throw new Error("trzszFilter is undefined");
            }
            trzszFilter
                .uploadFiles(
                    (event as DragEvent).dataTransfer
                        ?.items as DataTransferItemList,
                )
                .then(() => console.log("[ttyd] upload success"))
                .catch((err) => console.log("[ttyd] upload failed: " + err));
        });
        this.disposables.push(
            terminal.onResize((size) => {
                const { trzszFilter } = this;
                if (typeof trzszFilter == "undefined") {
                    throw new Error("trzszFilter is undefined");
                }
                return trzszFilter.setTerminalColumns(size.cols);
            }),
        );
    }

    @bind
    private zmodemInit() {
        const { sender, writer } = this.options;
        const { terminal, reset, zmodemDetect } = this;
        this.session = null;
        this.sentry = new Zmodem.Sentry({
            //@ts-ignore
            to_terminal: (octets) => writer(new Uint8Array(octets)),
            //@ts-ignore
            sender: (octets) => sender(new Uint8Array(octets)),
            on_retract: () => reset(),
            //@ts-ignore
            on_detect: (detection) => zmodemDetect(detection),
        });
        if (typeof terminal == "undefined") {
            throw new Error("terminal is undefined");
        }
        this.disposables.push(
            terminal.onKey((e) => {
                const event = e.domEvent;
                if (event.ctrlKey && event.key === "c") {
                    if (this.denier) this.denier();
                }
            }),
        );
    }

    @bind
    private zmodemDetect(detection: Zmodem.Detection): void {
        const { terminal, receiveFile } = this;
        if (typeof terminal == "undefined") {
            throw new Error("terminal is undefined");
        }
        terminal.options.disableStdin = true;

        this.denier = () => detection.deny();
        const session = detection.confirm();
        this.session = session;
        session.on("session_end", () => this.reset());

        if (session.type === "send") {
            this.options.onSend();
        } else {
            receiveFile();
        }
    }

    @bind
    public sendFile(files: FileList) {
        const { session, writeProgress } = this;
        Zmodem.Browser.send_files(session, files, {
            //@ts-ignore
            on_progress: (_, offer) => writeProgress(offer),
        })
            .then(() => {
                const { session } = this;
                if (typeof session == "undefined" || !session) {
                    throw new Error("session is undefined");
                }
                return session.close();
            })
            .catch(() => this.reset());
    }

    @bind
    private receiveFile() {
        const { session, writeProgress } = this;
        if (typeof session == "undefined" || !session) {
            throw new Error("session is undefined");
        }
        //@ts-ignore
        session.on("offer", (offer) => {
            offer.on("input", () => writeProgress(offer));
            offer
                .accept()
                //@ts-ignore
                .then((payloads) => {
                    const blob = new Blob(payloads, {
                        type: "application/octet-stream",
                    });
                    saveAs(blob, offer.get_details().name);
                })
                .catch(() => this.reset());
        });

        session.start();
    }

    @bind
    private writeProgress(offer: Zmodem.Offer) {
        const { bytesHuman } = this;
        const file = offer.get_details();
        const name = file.name;
        const size = file.size;
        const offset = offer.get_offset();
        //@ts-ignore
        const percent = ((100 * offset) / size).toFixed(2);

        this.options.writer(
            `${name} ${percent}% ${bytesHuman(offset, 2)}/${
                bytesHuman(
                    size,
                    2,
                )
            }\r`,
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private bytesHuman(bytes: any, precision: number): string {
        if (!/^([-+])?|(\.\d+)(\d+(\.\d+)?|(\d+\.)|Infinity)$/.test(bytes)) {
            return "-";
        }
        if (bytes === 0) return "0";
        if (typeof precision === "undefined") precision = 1;
        const units = ["bytes", "KB", "MB", "GB", "TB", "PB"];
        const num = Math.floor(Math.log(bytes) / Math.log(1024));
        const value = (bytes / Math.pow(1024, Math.floor(num))).toFixed(
            precision,
        );
        return `${value} ${units[num]}`;
    }
}
