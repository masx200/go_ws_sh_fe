import { defineNuxtConfig } from "nuxt/config";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    pwa: {
        workbox: {
            // 缓存所有 js 和 css 文件
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
            // 其他manifest属性...
        },
    },
    app: {
        head: {
            link: [
                { rel: "icon", href: "/favicon.ico" },
                {
                    rel: "stylesheet",
                    href: "https://unpkg.com/element-plus@2.9.2/dist/index.css",
                },
                {
                    rel: "stylesheet",
                    href: "https://unpkg.com/@xterm/xterm@5.5.0/css/xterm.css",
                },
            ],
        },
    },
    css: ["~/styles/styles.css", "~/styles/xterm.css"],
    elementPlus: {},
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: ["@element-plus/nuxt", "@vite-pwa/nuxt"],
    vite: {
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
