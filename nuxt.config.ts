// import Components from "unplugin-vue-components/vite";
// import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { defineNuxtConfig } from "nuxt/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { generateDayjsPluginMapping } from "./generate-dayjs-mapping.ts";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { join } from "path";
const pluginDirectory = join(__dirname, "./node_modules/dayjs/plugin");
const mapping = await generateDayjsPluginMapping(pluginDirectory);
const dayjsPlugins = [
    "dayjs/plugin/updateLocale",
    "dayjs/plugin/relativeTime",
    "dayjs/plugin/utc",

    "dayjs/plugin/advancedFormat",
    "dayjs/plugin/customParseFormat",
    "dayjs/plugin/localeData",
];
const alias = {
    "dayjs/plugin/advancedFormat": "dayjs/esm/plugin/advancedFormat/index",
    "dayjs/plugin/customParseFormat":
        "dayjs/esm/plugin/customParseFormat/index",
    //@ts-ignore
    ...dayjsPlugins.reduce((acc, plugin) => {
        const pluginName = plugin.split("/").pop();
        //@ts-ignore
        acc[`dayjs/plugin/${pluginName}`] =
            `dayjs/esm/plugin/${pluginName}/index`;
        return acc;
    }, {}),
    ...mapping,
};
// console.log("dayjs alias:", alias);
export default defineNuxtConfig({
    alias: alias,
    build: {
        transpile: ["element-plus", "ant-design-vue"],
    },
    typescript: {
        typeCheck: true,
        strict: true,
    },
    ssr: true,
    plugins: [
        "~~/plugins/element-plus-icons.ts",
        "~~/plugins/element-plus.ts",
        // "~~/plugins/ant-design-vue.ts",
        { src: "~/plugins/server-only.js", mode: "server" },

        { src: "~/plugins/client-only.js", mode: "client" },
    ],
    pwa: {
        // buildBase: {
        //     minify: "esbuild",
        //     // ✅ 关键修复
        // },
        workbox: {
            maximumFileSizeToCacheInBytes: 2097152 * 2,
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
        "ant-design-vue/dist/reset.css",
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
    modules: ["@element-plus/nuxt", "@vite-pwa/nuxt", "dayjs-nuxt"],
    vite: {
        optimizeDeps: {
            include: [], // 强制预打包
        },
        plugins: [
            // Components({
            //     resolvers: [AntDesignVueResolver()],
            // }),
            // ,
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
            commonjsOptions: {
                transformMixedEsModules: true,
            },
            minify: "esbuild",
            // esbuildOptions: {
            //     drop: ["console", "debugger"],
            // },
        },
        resolve: {
            alias: {},
        },
    },
});
