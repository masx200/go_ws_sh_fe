import { defineNuxtConfig } from "nuxt/config";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            link: [
                { rel: "icon", href: "/favicon.ico" },
                {
                    rel: "stylesheet",
                    href: "https:/unpkg.com/element-plus@2.9.2/dist/index.css",
                },
            ],
        },
    },
    css: [
        "~/styles/styles.css",
        "~/styles/xterm.css",
    ],
    elementPlus: {},
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: ["@element-plus/nuxt"],
});
