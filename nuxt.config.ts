import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    ssr: true,
    plugins: [
        { src: "~/plugins/server-only.js", mode: "server" },

        { src: "~/plugins/client-only.js", mode: "client" },
    ],
    pwa: {
        workbox: {
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
        "~/styles/styles.css",
        "~/styles/xterm.css",
        "~/node_modules/element-plus/dist/index.css",
        "~/node_modules/@xterm/xterm/css/xterm.css",
    ],
    elementPlus: {},
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: ["@element-plus/nuxt", "@vite-pwa/nuxt"],
    vite: {
        plugins: [],
        build: {
            minify: "terser",
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
        },
    },
});
