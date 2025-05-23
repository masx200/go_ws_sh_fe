import { CanvasAddon } from "@xterm/addon-canvas";
import { ClipboardAddon } from "@xterm/addon-clipboard";
import { FitAddon } from "@xterm/addon-fit";
import { ImageAddon } from "@xterm/addon-image";
import { Unicode11Addon } from "@xterm/addon-unicode11";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { WebglAddon } from "@xterm/addon-webgl";
import { Terminal } from "@xterm/xterm";
import { OverlayAddon } from "./addons/overlay.ts";
import { ZmodemAddon } from "./addons/zmodem";
import {
    BinaryMessage,
    ShellWebSocketAdaptor,
    TextMessage,
} from "./ShellWebSocketAdaptor.ts";
import type { IDisposable, ITerminalOptions } from "@xterm/xterm";

interface TtydTerminal extends Terminal {
    fit(): void;
}

declare global {
    interface Window {
        term: TtydTerminal;
    }
}

enum Command {
    // server side
    OUTPUT = "0",
    // SET_WINDOW_TITLE = "1",
    // SET_PREFERENCES = "2",

    // client side
    INPUT = "0",
    RESIZE_TERMINAL = "1",
    // PAUSE = "2",
    // RESUME = "3",
}
type Preferences = ITerminalOptions & ClientOptions;

export type RendererType = "dom" | "canvas" | "webgl";

export interface ClientOptions {
    rendererType: RendererType;
    disableLeaveAlert: boolean;
    disableResizeOverlay: boolean;
    enableZmodem: boolean;
    enableTrzsz: boolean;
    enableSixel: boolean;
    titleFixed?: string;
    isWindows: boolean;
    trzszDragInitTimeout: number;
    unicodeVersion: string;
}

export interface FlowControl {
    limit: number;
    highWater: number;
    lowWater: number;
}

export interface XtermOptions {
    reconnect: boolean;
    wsprotocol: string;
    wsUrl: string;
    // tokenUrl: string;
    flowControl: FlowControl;
    clientOptions: ClientOptions;
    termOptions: ITerminalOptions;
}

function toDisposable(f: () => void): IDisposable {
    return { dispose: f };
}

function addEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
): IDisposable {
    target.addEventListener(type, listener);
    return toDisposable(() => target.removeEventListener(type, listener));
}

export class Xterm {
    public disposables: IDisposable[] = [];
    public textEncoder = new TextEncoder();
    public textDecoder = new TextDecoder();
    public written = 0;
    public pending = 0;

    public terminal: Terminal | undefined;
    public fitAddon = new FitAddon();
    public overlayAddon = new OverlayAddon();
    public clipboardAddon = new ClipboardAddon();
    public webLinksAddon = new WebLinksAddon();
    public webglAddon?: WebglAddon;
    public canvasAddon?: CanvasAddon;
    public zmodemAddon?: ZmodemAddon;

    public socket?: ShellWebSocketAdaptor;
    public token: string | undefined;
    public opened = false;
    public title?: string;
    public titleFixed?: string;
    public resizeOverlay = true;
    public reconnect = true;
    public doReconnect = true;

    public writeFunc = (data: ArrayBuffer | Uint8Array) =>
        this.writeData(new Uint8Array(data));

    constructor(
        public options: XtermOptions,
        public sendCb: () => void,
    ) {
        this.reconnect = options.reconnect;
        this.doReconnect = this.reconnect;
    }

    dispose() {
        for (const d of this.disposables) {
            d.dispose();
        }
        this.disposables.length = 0;
    }

    register = <T extends IDisposable>(d: T): T => {
        this.disposables.push(d);
        return d;
    };

    sendFile = (files: FileList) => {
        this.zmodemAddon?.sendFile(files);
    };

    // this.
    // public async refreshToken() {
    //     try {
    //         const resp = await fetch(this.options.tokenUrl);
    //         if (resp.ok) {
    //             const json = await resp.json();
    //             this.token = json.token;
    //         }
    //     } catch (e) {
    //         console.error(`[ttyd] fetch ${this.options.tokenUrl}: `, e);
    //     }
    // }

    onWindowUnload(event: BeforeUnloadEvent) {
        event.preventDefault();
        if (this.socket?.readyState === WebSocket.OPEN) {
            const message =
                "Close terminal? this will also terminate the command.";
            event.returnValue = message;
            return message;
        }
        return undefined;
    }

    open = (parent: HTMLElement) => {
        this.terminal = new Terminal(this.options.termOptions);
        const {
            terminal,
            fitAddon,
            overlayAddon,
            clipboardAddon,
            webLinksAddon,
        } = this;
        window.term = terminal as TtydTerminal;
        window.term.fit = () => {
            this.fitAddon.fit();
        };

        terminal.loadAddon(fitAddon);
        terminal.loadAddon(overlayAddon);
        terminal.loadAddon(clipboardAddon);
        terminal.loadAddon(webLinksAddon);

        terminal.open(parent);
        fitAddon.fit();
    };

    initListeners = () => {
        const { terminal, fitAddon, overlayAddon, register, sendData } = this;

        if (typeof terminal == "undefined") {
            throw new Error("terminal is undefined");
        }
        register(
            terminal.onTitleChange((data) => {
                if (data && data !== "" && !this.titleFixed) {
                    document.title = data + " | " + this.title;
                }
            }),
        );
        register(terminal.onData((data) => sendData(data)));
        register(
            terminal.onBinary((data) =>
                sendData(Uint8Array.from(data, (v) => v.charCodeAt(0)))
            ),
        );
        register(
            terminal.onResize(({ cols, rows }) => {
                // const msg = JSON.stringify({ columns: cols, rows: rows });
                // this.socket?.send(
                //     this.textEncoder.encode(Command.RESIZE_TERMINAL + msg),
                // );
                this.socket?.sendResize(cols, rows);
                if (this.resizeOverlay) {
                    overlayAddon.showOverlay(`${cols}x${rows}`, 300);
                }
            }),
        );
        register(
            terminal.onSelectionChange(() => {
                const terminal = this.terminal;
                if (typeof terminal == "undefined") {
                    throw new Error("terminal is undefined");
                }
                if (terminal.getSelection() === "") return;
                try {
                    document.execCommand("copy");
                } catch (e) {
                    return;
                }
                this.overlayAddon?.showOverlay("\u2702", 200);
            }),
        );
        register(addEventListener(window, "resize", () => fitAddon.fit()));
        register(addEventListener(window, "beforeunload", this.onWindowUnload));
    };

    writeData = (data: string | Uint8Array) => {
        const { terminal, textEncoder } = this;
        const { limit, highWater, lowWater } = this.options.flowControl;

        this.written += data.length;
        if (this.written > limit) {
            if (typeof terminal == "undefined") {
                throw new Error("terminal is undefined");
            }
            terminal.write(data, () => {
                this.pending = Math.max(this.pending - 1, 0);
                // if (this.pending < lowWater) {
                //     this.socket?.send(textEncoder.encode(Command.RESUME));
                // }
            });
            this.pending++;
            this.written = 0;
            // if (this.pending > highWater) {
            //     this.socket?.send(textEncoder.encode(Command.PAUSE));
            // }
        } else {
            if (typeof terminal == "undefined") {
                throw new Error("terminal is undefined");
            }
            terminal.write(data);
        }
    };

    sendData = (data: string | Uint8Array) => {
        const { socket, textEncoder } = this;
        if (socket?.readyState !== WebSocket.OPEN) return;

        if (typeof data === "string") {
            // const payload = new Uint8Array(data.length * 3 + 1);
            // payload[0] = Command.INPUT.charCodeAt(0);
            // const stats = textEncoder.encodeInto(data, payload.subarray(1));
            // socket.send(payload.subarray(0, (stats.written as number) + 1));
            socket.sendStdin(textEncoder.encode(data));
        } else {
            // const payload = new Uint8Array(data.length + 1);
            // payload[0] = Command.INPUT.charCodeAt(0);
            // payload.set(data, 1);
            // socket.send(payload);
            socket.sendStdin(data);
        }
    };

    connect = () => {
        const ws = new ShellWebSocketAdaptor(this.options.wsUrl, [
            this.options.wsprotocol,
        ]);
        this.socket = ws;
        const { socket, register } = this;

        socket.binaryType = "arraybuffer";
        register(addEventListener(socket, "open", this.onSocketOpen));
        register(
            addEventListener(
                socket,
                "message",
                this.onSocketData as EventListener,
            ),
        );
        register(
            addEventListener(
                socket,
                "close",
                this.onSocketClose as EventListener,
            ),
        );
        register(
            addEventListener(
                socket,
                "error",
                ((e: ErrorEvent) => {
                    // console.error(e)
                    // ElMessage.error(e.message);
                    this.doReconnect = false;
                    return;
                }) as EventListener,
            ),
        );
        const { terminal } = this;
        if (typeof terminal == "undefined") {
            throw new Error("terminal is undefined");
        }
    };

    onSocketOpen = () => {
        console.log("[ttyd] websocket connection opened");

        const { textEncoder, terminal, overlayAddon } = this;
        if (typeof terminal == "undefined") {
            throw new Error("terminal is undefined");
        }
        // const msg = JSON.stringify({
        //     AuthToken: this.token,
        //     columns: terminal.cols,
        //     rows: terminal.rows,
        // });
        // this.socket?.send(textEncoder.encode(msg));
        const ws = this.socket;
        if (typeof ws == "undefined") {
            throw new Error("ws is undefined");
        }
        ws.sendResize(terminal.cols, terminal.rows);
        if (this.opened) {
            terminal.reset();
            terminal.options.disableStdin = false;
            overlayAddon.showOverlay("Reconnected", 300);
        } else {
            this.opened = true;
        }

        this.doReconnect = this.reconnect;
        this.initListeners();
        terminal.focus();
    };

    onSocketClose = (event: CloseEvent) => {
        // ElMessage.info("Connection Closed");
        if (event.code !== 1000) {
            ElMessage.error("Connection Closed with code: " + event.code);
        }
        console.log(
            `[ttyd] websocket connection closed with code: ${event.code}`,
        );

        const { /*  refreshToken, */ connect, doReconnect, overlayAddon } =
            this;
        overlayAddon.showOverlay("Connection Closed");
        this.dispose();

        // 1000: CLOSE_NORMAL
        if (event.code !== 1000 && doReconnect) {
            overlayAddon.showOverlay("Reconnecting...");
            // refreshToken().then(connect);
            connect();
        } else {
            const { terminal } = this;
            if (typeof terminal == "undefined") {
                throw new Error("terminal is undefined");
            }
            const keyDispose = terminal.onKey((e) => {
                const event = e.domEvent;
                if (event.key === "Enter") {
                    keyDispose.dispose();
                    overlayAddon.showOverlay("Reconnecting...");
                    // refreshToken().then(connect);
                    connect();
                }
            });
            overlayAddon.showOverlay("Press ⏎ to Reconnect");
        }
    };

    // this.
    //  public  parseOptsFromUrlQuery(query: string): Preferences {
    //     const { terminal } = this;
    //     const { clientOptions } = this.options;
    //     const prefs = {} as Preferences;
    //     const queryObj = Array.from(
    //         new URLSearchParams(query) as unknown as Iterable<[string, string]>,
    //     );

    //     for (const [k, queryVal] of queryObj) {
    //         let v = clientOptions[k];
    //         if (typeof terminal == "undefined") {
    //             throw new Error("terminal is undefined");
    //         }
    //         if (v === undefined) v = terminal.options[k];
    //         switch (typeof v) {
    //             case "boolean":
    //                 prefs[k] = queryVal === "true" || queryVal === "1";
    //                 break;
    //             case "number":
    //             case "bigint":
    //                 prefs[k] = Number.parseInt(queryVal, 10);
    //                 break;
    //             case "string":
    //                 prefs[k] = queryVal;
    //                 break;
    //             case "object":
    //                 prefs[k] = JSON.parse(queryVal);
    //                 break;
    //             default:
    //                 console.warn(
    //                     `[ttyd] maybe unknown option: ${k}=${queryVal}, treating as string`,
    //                 );
    //                 prefs[k] = queryVal;
    //                 break;
    //         }
    //     }

    //     return prefs;
    // }

    onSocketData = (event: MessageEvent) => {
        const msg = this.socket?.parseMessage(event);
        if (msg instanceof TextMessage) {
            if (msg.type == "resolved") {
                ElMessage.success(msg.body);
            } else {
                ElMessage.error(msg.body);
            }
            return;
        }
        if (msg instanceof BinaryMessage) {
            const data = msg.body;
            if (msg.type != "stdout") throw new Error("unknown message type");
            this.writeFunc(data);
            return;
        }
        throw new Error("unknown message type");
        // const { textDecoder } = this;
        // const rawData = event.data as ArrayBuffer;
        // const cmd = String.fromCharCode(new Uint8Array(rawData)[0]);
        // const data = rawData.slice(1);

        // switch (cmd) {
        //     case Command.OUTPUT:
        //         this.writeFunc(data);
        //         break;
        //     // case Command.SET_WINDOW_TITLE:
        //     //     this.title = textDecoder.decode(data);
        //     //     document.title = this.title;
        //     //     break;
        //     // case Command.SET_PREFERENCES:
        //     //     this.applyPreferences({
        //     //         ...this.options.clientOptions,
        //     //         ...JSON.parse(textDecoder.decode(data)),
        //     //         // ...this.parseOptsFromUrlQuery(window.location.search),
        //     //     } as Preferences);
        //     //     break;
        //     default:
        //         console.warn(`[ttyd] unknown command: ${cmd}`);
        //         break;
        // }
    };

    applyPreferences = (prefs: Preferences) => {
        const { terminal, fitAddon, register } = this;
        if (prefs.enableZmodem || prefs.enableTrzsz) {
            this.zmodemAddon = new ZmodemAddon({
                zmodem: prefs.enableZmodem,
                trzsz: prefs.enableTrzsz,
                windows: prefs.isWindows,
                trzszDragInitTimeout: prefs.trzszDragInitTimeout,
                onSend: this.sendCb,
                sender: this.sendData,
                writer: this.writeData,
            });
            this.writeFunc = (data) => this.zmodemAddon?.consume(data);
            if (typeof terminal == "undefined") {
                throw new Error("terminal is undefined");
            }
            terminal.loadAddon(register(this.zmodemAddon));
        }

        for (const [key, value] of Object.entries(prefs)) {
            switch (key) {
                case "rendererType":
                    this.setRendererType(value);
                    break;
                case "disableLeaveAlert":
                    if (value) {
                        window.removeEventListener(
                            "beforeunload",
                            this.onWindowUnload,
                        );
                        console.log("[ttyd] Leave site alert disabled");
                    }
                    break;
                case "disableResizeOverlay":
                    if (value) {
                        console.log("[ttyd] Resize overlay disabled");
                        this.resizeOverlay = false;
                    }
                    break;
                case "disableReconnect":
                    if (value) {
                        console.log("[ttyd] Reconnect disabled");
                        this.reconnect = false;
                        this.doReconnect = false;
                    }
                    break;
                case "enableZmodem":
                    if (value) console.log("[ttyd] Zmodem enabled");
                    break;
                case "enableTrzsz":
                    if (value) console.log("[ttyd] trzsz enabled");
                    break;
                case "trzszDragInitTimeout":
                    if (value) {
                        console.log(`[ttyd] trzsz drag init timeout: ${value}`);
                    }
                    break;
                case "enableSixel":
                    if (value) {
                        if (typeof terminal == "undefined") {
                            throw new Error("terminal is undefined");
                        }
                        terminal.loadAddon(register(new ImageAddon()));
                        console.log("[ttyd] Sixel enabled");
                    }
                    break;
                case "titleFixed":
                    if (!value || value === "") return;
                    console.log(`[ttyd] setting fixed title: ${value}`);
                    this.titleFixed = value;
                    document.title = value;
                    break;
                case "isWindows":
                    if (value) console.log("[ttyd] is windows");
                    break;
                case "unicodeVersion":
                    switch (value) {
                        case 6:
                        case "6":
                            console.log("[ttyd] setting Unicode version: 6");
                            break;
                        case 11:
                        case "11":
                        default:
                            console.log("[ttyd] setting Unicode version: 11");
                            if (typeof terminal == "undefined") {
                                throw new Error("terminal is undefined");
                            }
                            terminal.loadAddon(new Unicode11Addon());
                            terminal.unicode.activeVersion = "11";
                            break;
                    }
                    break;
                default:
                    console.log(
                        `[ttyd] option: ${key}=${JSON.stringify(value)}`,
                    );
                    if (typeof terminal == "undefined") {
                        throw new Error("terminal is undefined");
                    }
                    // @ts-ignore
                    if (terminal.options[key] instanceof Object) {
                        // @ts-ignore
                        terminal.options[key] = Object.assign(
                            {},
                            // @ts-ignore
                            terminal.options[key],
                            value,
                        );
                    } else {
                        // @ts-ignore
                        terminal.options[key] = value;
                    }
                    if (key.indexOf("font") === 0) fitAddon.fit();
                    break;
            }
        }
    };

    setRendererType = (value: RendererType) => {
        const { terminal } = this;
        const disposeCanvasRenderer = () => {
            try {
                this.canvasAddon?.dispose();
            } catch {
                // ignore
            }
            this.canvasAddon = undefined;
        };
        const disposeWebglRenderer = () => {
            try {
                this.webglAddon?.dispose();
            } catch {
                // ignore
            }
            this.webglAddon = undefined;
        };
        const enableCanvasRenderer = () => {
            if (this.canvasAddon) return;
            this.canvasAddon = new CanvasAddon();
            disposeWebglRenderer();
            try {
                const terminal = this.terminal;
                if (typeof terminal == "undefined") {
                    throw new Error("terminal is undefined");
                }
                terminal.loadAddon(this.canvasAddon);
                console.log("[ttyd] canvas renderer loaded");
            } catch (e) {
                console.log(
                    "[ttyd] canvas renderer could not be loaded, falling back to dom renderer",
                    e,
                );
                disposeCanvasRenderer();
            }
        };
        const enableWebglRenderer = () => {
            if (this.webglAddon) return;
            this.webglAddon = new WebglAddon();
            disposeCanvasRenderer();
            try {
                this.webglAddon.onContextLoss(() => {
                    this.webglAddon?.dispose();
                });
                if (typeof terminal == "undefined") {
                    throw new Error("terminal is undefined");
                }
                terminal.loadAddon(this.webglAddon);
                console.log("[ttyd] WebGL renderer loaded");
            } catch (e) {
                console.log(
                    "[ttyd] WebGL renderer could not be loaded, falling back to canvas renderer",
                    e,
                );
                disposeWebglRenderer();
                enableCanvasRenderer();
            }
        };

        switch (value) {
            case "canvas":
                enableCanvasRenderer();
                break;
            case "webgl":
                enableWebglRenderer();
                break;
            case "dom":
                disposeWebglRenderer();
                disposeCanvasRenderer();
                console.log("[ttyd] dom renderer loaded");
                break;
            default:
                break;
        }
    };
}
