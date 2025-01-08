import { wsmsg } from "~/src/wsmsg";

export class ShellWebSocketAdaptor extends WebSocket {
    override send(
        data: string | ArrayBufferLike | Blob | ArrayBufferView,
    ): void {
        if (typeof data === "string") {
            const wsmsgins = {
                type: TextMessage.TextMessage,
                data: new TextEncoder().encode(data),
            };
            super.send(wsmsg.encode(wsmsgins).finish());
        } else if (data instanceof Uint8Array) {
            const wsmsgins = {
                type: TextMessage.TextMessage,
                data: new Uint8Array(data),
            };
            super.send(wsmsg.encode(wsmsgins).finish());
        } else {
            throw new Error("Unsupported data type");
        }
    }
    sendResize(cols: number, rows: number) {
        this.send(JSON.stringify(["resize", cols, rows]));
    }
}

export const enum TextMessage {
    TextMessage = 1,
    BinaryMessage = 2,
    CloseMessage = 8,
    PingMessage = 9,
    PongMessage = 10,
}
