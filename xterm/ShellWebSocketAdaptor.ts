import { wsmsg } from "~/src/wsmsg";
import { compressData, decompressData } from "./compressData";
import { toUint8Array } from "./toUint8Array";
import { parse } from "avsc";
import { Buffer } from "buffer";
export class ShellWebSocketAdaptor extends WebSocket {
    sendStdin(arg0: Uint8Array<ArrayBufferLike>) {
        const msgcodec = createcodec();
        this.send(
            bufferToUint8Array(
                msgcodec.toBuffer({
                    //@ts-ignore
                    type: "stdin",
                    //@ts-ignore
                    body:
                        //@ts-ignore
                        Buffer.from(arg0),
                }),
            ),
        );
    }
    override async send(
        data: string | ArrayBufferLike | Blob | ArrayBufferView,
    ): Promise<void> {
        if (typeof data === "string") {
            const wsmsgins = {
                type: WebSocketMessage.TextMessage,
                data: new TextEncoder().encode(data),
            };
            super.send(compressData(wsmsg.encode(wsmsgins).finish()));
        } else if (data instanceof Uint8Array) {
            const wsmsgins = {
                type: WebSocketMessage.BinaryMessage,
                data: new Uint8Array(data),
            };
            super.send(compressData(wsmsg.encode(wsmsgins).finish()));
        } else {
            const data2 = await toUint8Array(data);
            const wsmsgins = {
                type: WebSocketMessage.BinaryMessage,
                data: new Uint8Array(data2),
            };
            super.send(compressData(wsmsg.encode(wsmsgins).finish()));
        }
    }
    sendResize(cols: number, rows: number) {
        const rm = new ResizeMessage("resize", cols, rows);
        this.send(JSON.stringify(EncodeMessageSizeToStringArray(rm)));
    }

    parseMessage(event: MessageEvent): TextMessage | BinaryMessage {
        const msgcodec = createcodec();
        const data = event.data;
        if (typeof data === "string") throw new Error("invalid message type");
        if (data instanceof Uint8Array) {
            const wsmsgins = wsmsg.decode(decompressData(data));
            if (wsmsgins.type === WebSocketMessage.BinaryMessage) {
                //@ts-ignore
                const bm = msgcodec.fromBuffer(Buffer.from(wsmsgins.data));
                return new BinaryMessage(bm.type, bufferToUint8Array(bm.body));
            }
            if (wsmsgins.type === WebSocketMessage.TextMessage) {
                const array = JSON.parse(
                    new TextDecoder().decode(wsmsgins.data),
                );
                if (!Array.isArray(array)) {
                    throw new Error("invalid message array");
                }
                if (array.length !== 2) {
                    throw new Error("invalid message length");
                }
                if (array.every((data) => typeof data === "string")) {
                    throw new Error("invalid message type");
                }
                return new TextMessage(...(array as [string, string]));
            }
        }
        throw new Error("unknown message type");
    }
}

export const enum WebSocketMessage {
    TextMessage = 1,
    BinaryMessage = 2,
    CloseMessage = 8,
    PingMessage = 9,
    PongMessage = 10,
}
export class BinaryMessage {
    constructor(
        public type: string,
        public body: Uint8Array,
    ) { }
}
export class TextMessage {
    constructor(
        public type: string,
        public body: string,
    ) { }
}
export class ResizeMessage {
    constructor(
        public type: string,
        public cols: number,
        public rows: number,
    ) { }
}
export const MessageSchema = {
    type: "record",
    name: "message",
    fields: [
        {
            name: "type",
            type: "string",
        },
        {
            name: "body",
            type: "bytes",
        },
    ],
};

export function createcodec(): EncodedDecodeMessageType {
    const msgcodec: EncodedDecodeMessageType = parse(
        JSON.stringify(MessageSchema),
    ) as EncodedDecodeMessageType;
    return msgcodec;
}
export interface EncodedDecodeMessageType {
    //@ts-ignore
    fromBuffer(buf: Buffer<Uint8Array>): BinaryMessageAvro;
    //@ts-ignore
    toBuffer(em: BinaryMessageAvro): Buffer<Uint8Array>;
}
export interface BinaryMessageAvro {
    type: string;
    //@ts-ignore
    body: Buffer<Uint8Array>;
}
//@ts-ignore
export function bufferToUint8Array(buffer: Buffer<Uint8Array>): Uint8Array {
    //@ts-ignore
    const uint8Array = new Uint8Array(buffer.length);
    //@ts-ignore
    for (let i = 0; i < buffer.length; i++) {
        //@ts-ignore
        uint8Array[i] = buffer[i];
    }
    return new Uint8Array(uint8Array);
}
export function EncodeMessageSizeToStringArray(rm: ResizeMessage) {
    return [rm.type, rm.cols, rm.rows];
}
