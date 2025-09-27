import { defineNuxtConfig } from "nuxt/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";
export default defineNuxtConfig({
    typescript: {
        typeCheck: true,
        strict: true,
    },
    ssr: true,
    plugins: [
        { src: "~/plugins/server-only.js", mode: "server" },

        { src: "~/plugins/client-only.js", mode: "client" },
    ],
    pwa: {
        // buildBase: {
        //     minify: "esbuild",
        //     // ✅ 关键修复
        // },
        workbox: {
            cleanupOutdatedCaches: true,
            globPatterns: ["**/*.{js,css}"],
        },
        injectManifest: {
            globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
        },
        registerType: "autoUpdate",
        manifest: {
            name: "My Nuxt PWA App",
            short_name: "NuxtPWA",
            lang: "en",
            display: "standalone",
            background_color: "#ffffff",
            theme_color: "#000000",
        },
    },
    app: {
        head: {
            link: [{ rel: "icon", href: "/favicon.ico" }],
            title: "go-ws-sh-fe",
        },
    },
    css: [
        "~~/styles/styles.css",
        "~~/styles/xterm.css",
        "element-plus/dist/index.css",
        "@xterm/xterm/css/xterm.css",
    ],
    elementPlus: {},
    nitro: {
        preset: "static",
        debug: true,
    },
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: ["@element-plus/nuxt", "@vite-pwa/nuxt","@ant-design-vue/nuxt"],
    vite: {
        plugins: [
            //@ts-ignore
            nodePolyfills({
                // To exclude specific polyfills, add them to this list
                exclude: [],
                // Whether to polyfill specific globals
                globals: {
                    Buffer: true,
                    global: true,
                    process: true,
                },
                // Whether to polyfill `node:` protocol imports
                protocolImports: true,
            }),
        ],
        esbuild: {
            drop: ["console", "debugger"],
        },
        build: {
            minify: "esbuild",
            // esbuildOptions: {
            //     drop: ["console", "debugger"],
            // },
        },
        resolve: {
            alias: {
                'dayjs/esm': 'dayjs'
            }
        },
    },
});
