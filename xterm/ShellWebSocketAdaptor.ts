import { wsmsg } from "~/src/wsmsg";
import { compressData } from "./compressData";
export class ShellWebSocketAdaptor extends WebSocket {
    override send(
        data: string | ArrayBufferLike | Blob | ArrayBufferView,
    ): void {
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
            throw new Error("Unsupported data type");
        }
    }
    sendResize(cols: number, rows: number) {
        this.send(JSON.stringify(["resize", cols, rows]));
    }
}

export const enum WebSocketMessage {
    TextMessage = 1,
    BinaryMessage = 2,
    CloseMessage = 8,
    PingMessage = 9,
    PongMessage = 10,
}
