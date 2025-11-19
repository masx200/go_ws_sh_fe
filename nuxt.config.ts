import remoteToLocal from "./remoteToLocal.ts";

import fetch from "node-fetch";
// import RemoteAssets from "vite-plugin-remote-assets";
// import Components from "unplugin-vue-components/vite";
//@ts-ignore
// import { fileCache, httpResolve } from "@masx200/rollup-plugin-http-resolve";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";
import { join } from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { generateDayjsPluginMapping } from "./generate-dayjs-mapping.ts";
import { fileCache } from "./remoteToLocal.ts";
// const cache = new fileCache();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
    sourcemap:
        process.env.NODE_ENV == "development" ||
        process.env.SOURCEMAP == "true",
    alias: Object.assign(alias, {
        avsc: "virtual:https://cdn.jsdelivr.net/npm/avsc/+esm",
    }),
    build: {
        transpile: ["element-plus", "avsc"],
    },
    typescript: {
        typeCheck: true,
        strict: true,
    },
    ssr: true,
    plugins: [
        "~~/plugins/element-plus-icons.ts",
        "~~/plugins/element-plus.ts",

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
        "~~/styles/styles.css",
        "~~/styles/xterm.css",
        "element-plus/dist/index.css",
        "@xterm/xterm/css/xterm.css",
    ],
    elementPlus: {},
    nitro: {
        sourceMap:
            process.env.NODE_ENV == "development" ||
            process.env.SOURCEMAP == "true",
        preset: "static",
        debug: true,
    },
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: ["@element-plus/nuxt", "@vite-pwa/nuxt", "dayjs-nuxt"],
    vite: {
        ssr: {
            noExternal: [
                "avsc",
                "virtual:https://cdn.jsdelivr.net/npm/avsc/+esm",
            ],
        },
        optimizeDeps: {
            include: ["virtual:https://cdn.jsdelivr.net/npm/avsc/+esm"], // 强制预打包
        },
        plugins: [
            remoteToLocal({
                cache: new fileCache(),
                async fetcher(url: string) {
                    const res = await fetch(url, {
                        headers: {
                            Accept: "application/javascript",

                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
                        },
                    });

                    if (res.ok) return await res.text();

                    throw Error("failed to fetch:" + url);
                },
            }),
            // RemoteAssets(),
            // httpResolve({
            //     cache,
            // }),
            // Components({

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
            drop:
                process.env.NODE_ENV == "development" ||
                process.env.DEBUGCONSOLE == "true"
                    ? []
                    : ["console", "debugger"],
        },
        build: {
            sourcemap:
                process.env.NODE_ENV == "development" ||
                process.env.SOURCEMAP == "true",
            commonjsOptions: {
                transformMixedEsModules: true,
            },
            minify: "esbuild",
            // esbuildOptions: {
            //     drop: ["console", "debugger"],
            // },
        },
        resolve: {
            alias: {
                avsc: "virtual:https://cdn.jsdelivr.net/npm/avsc/+esm",
            },
        },
    },
});
