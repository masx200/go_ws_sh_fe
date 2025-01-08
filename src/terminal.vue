<template>
    <div :id="id" ref="container">
        <Modal :show="modal">
            <label class="file-label">
                <input @change="sendFile" class="file-input" type="file" multiple />
                <span class="file-cta">Choose files…</span>
            </label>
        </Modal>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    onUnmounted,
    ref,
    type PropType
} from "vue";
import { Xterm, type ClientOptions, type FlowControl, type XtermOptions } from "../xterm/index";

import Modal from "./modal.vue";
import type { ITerminalOptions } from "@xterm/xterm";

interface Props extends XtermOptions {
    id: string;
}

export default defineComponent({
    name: "Terminal",
    components: {
        Modal,
    },
    props: {
        termoptions: {
            type: Object as PropType<ITerminalOptions>,
            required: true,
        }, flowcontrol: {
            type: Object as PropType<FlowControl>,
            required: true,
        },
        // tokenurl: {
        //     type: String,
        //     required: true,
        // },
        wsurl: {
            type: String,
            required: true,
        },
        clientoptions: {
            type: Object as PropType<ClientOptions>,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        // Add other props from XtermOptions here
        rendererType: {
            type: String,
            default: "canvas",
        },
        disableLeaveAlert: {
            type: Boolean,
            default: false,
        },
        disableResizeOverlay: {
            type: Boolean,
            default: false,
        },
        enableZmodem: {
            type: Boolean,
            default: false,
        },
        enableTrzsz: {
            type: Boolean,
            default: false,
        },
        enableSixel: {
            type: Boolean,
            default: false,
        },
        isWindows: {
            type: Boolean,
            default: false,
        },
        unicodeVersion: {
            type: String,
            default: "11",
        },
        fontSize: {
            type: Number,
            default: 13,
        },
        fontFamily: {
            type: String,
            default: "Consolas,Liberation Mono,Menlo,Courier,monospace",
        },
        theme: {
            type: Object,
            default: () => ({
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
            }),
        },
        allowProposedApi: {
            type: Boolean,
            default: true,
        },
    },
    setup(props) {
        const container = ref(null);
        const modal = ref(false);
        let xterm: Xterm;

        const showModal = () => {
            modal.value = true;
        };

        const hideModal = () => {
            modal.value = false;
        };
        //@ts-ignore
        const sendFile = (event) => {
            hideModal();
            const files = event.target.files;
            if (files) xterm.sendFile(files);
        };

        onMounted(async () => {
            xterm = new Xterm({ ...props, wsUrl: props["wsurl"], termOptions: props.termoptions, /* tokenUrl: props.tokenurl, */ flowControl: props.flowcontrol, clientOptions: props.clientoptions }, showModal);
            // await xterm.refreshToken();
            xterm.open(container.value);
            xterm.connect();
        });

        onUnmounted(() => {
            xterm.dispose();
        });

        return {
            container,
            modal,
            showModal,
            hideModal,
            sendFile,
        };
    },
});
</script>
