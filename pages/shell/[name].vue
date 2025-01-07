<template>
    <div id="terminal-container">
        <div dir="ltr" class="terminal xterm" tabindex="0">
            <div
                class="xterm-viewport"
                style="background-color: rgb(43, 43, 43)"
            >
                <div class="xterm-scroll-area" style="height: 932px"></div>
            </div>
            <div class="xterm-screen" style="width: 1560px; height: 912px">
                <div class="xterm-helpers">
                    <textarea
                        class="xterm-helper-textarea"
                        aria-label="Terminal input"
                        aria-multiline="false"
                        autocorrect="off"
                        autocapitalize="off"
                        spellcheck="false"
                        tabindex="0"
                        style="
                            left: 100px;
                            top: 0px;
                            width: 6.66667px;
                            height: 16px;
                            line-height: 16px;
                            z-index: -5;
                        "
                    ></textarea
                    ><span
                        class="xterm-char-measure-element"
                        aria-hidden="true"
                        style="
                            font-family: Consolas, &quot;Liberation Mono&quot;,
                                Menlo, Courier, monospace;
                            font-size: 13px;
                        "
                        >W</span
                    >
                    <div class="composition-view"></div>
                </div>
                <div class="xterm-decoration-container"></div>
                <canvas
                    class="xterm-link-layer"
                    width="2340"
                    height="1368"
                    style="z-index: 2; width: 1560px; height: 912px"
                ></canvas
                ><canvas
                    class="xterm-cursor-layer"
                    width="2340"
                    height="1368"
                    style="z-index: 3; width: 1560px; height: 912px"
                ></canvas
                ><canvas
                    width="2340"
                    height="1368"
                    style="width: 1560px; height: 912px"
                ></canvas>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts"></script>
