export class ShellWebSocketAdaptor extends WebSocket {

    sendResize(cols: number, rows: number) {
        this.send(JSON.stringify(["resize", cols, rows,]));
    }
}