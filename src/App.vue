<template>
    <!-- :tokenurl="tokenUrl" -->
    <Terminal
        :divid="divid"
        :wsurl="wsUrl"
        :clientoptions="clientOptions"
        :termoptions="termOptions"
        :flowcontrol="flowControl"
        :wsprotocol="wsprotocol"
        :reconnect="reconnect"
    />
</template>

<script lang="ts">
const divid = "terminal-container";
import { defineComponent } from "vue";
import Terminal from "./terminal.vue";

import type { ITerminalOptions, ITheme } from "@xterm/xterm";
import type { ClientOptions, FlowControl } from "../xterm/index";
//const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
// const path = window.location.pathname.replace(/[/]+$/, "");
// const wsUrl = [
//     protocol,
//     "//",
//     window.location.host,
//     path,
//     "/ws",
//     window.location.search,
// ].join("");
// const tokenUrl = [
//     window.location.protocol,
//     "//",
//     window.location.host,
//     path,
//     "/token",
// ].join("");
const clientOptions = {
    rendererType: "webgl",
    disableLeaveAlert: false,
    disableResizeOverlay: false,
    enableZmodem: false,
    enableTrzsz: false,
    enableSixel: false,
    isWindows: false,
    unicodeVersion: "11",
} as ClientOptions;
const termOptions = {
    fontSize: 13,
    fontFamily: "Consolas,Liberation Mono,Menlo,Courier,monospace",
    theme: {
        foreground: "#d2d2d2",
        background: "#2b2b2b",
        cursor: "#adadad",
        black: "#000000",
        red: "#d81e00",
        green: "#5ea702",
        yellow: "#cfae00",
        blue: "#427ab3",
        magenta: "#89658e",
        cyan: "#00a7aa",
        white: "#dbded8",
        brightBlack: "#686a66",
        brightRed: "#f54235",
        brightGreen: "#99e343",
        brightYellow: "#fdeb61",
        brightBlue: "#84b0d8",
        brightMagenta: "#bc94b7",
        brightCyan: "#37e6e8",
        brightWhite: "#f1f1f0",
    } as ITheme,
    allowProposedApi: true,
} as ITerminalOptions;
const flowControl = {
    limit: 100000,
    highWater: 10,
    lowWater: 4,
} as FlowControl;

export default defineComponent({
    props: {
        reconnect: {
            type: Boolean,
            default: false,
        },
        wsprotocol: {
            type: String,
            required: true,
        },
        wsUrl: {
            type: String,
            required: true,
        },
    },
    name: "App",
    components: {
        Terminal,
    },
    data() {
        return {
            divid,
            // wsUrl,
            // tokenUrl,
            clientOptions,
            termOptions,
            flowControl,
        };
    },
});
</script>
