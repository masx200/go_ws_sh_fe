import { wsmsg } from "~/src/wsmsg";
import { compressData } from "./compressData";
import { toUint8Array } from "./toUint8Array";
export class ShellWebSocketAdaptor extends WebSocket {
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
            return this.send(await toUint8Array(data));
        }
    }
    sendResize(cols: number, rows: number) {
        this.send(JSON.stringify(["resize", cols, rows]));
    }
    override addEventListener<K extends keyof WebSocketEventMap>(
        type: K,
        listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions,
    ): void;
    override addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
    override addEventListener(type: any, listener: any, options?: any): void {
        super.addEventListener(type, listener, options);
    }
}

export const enum WebSocketMessage {
    TextMessage = 1,
    BinaryMessage = 2,
    CloseMessage = 8,
    PingMessage = 9,
    PongMessage = 10,
}
