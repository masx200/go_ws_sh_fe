import { defineNuxtConfig } from "nuxt/config";

// import AutoImport from "unplugin-auto-import/vite";
// //自动导入ui-组件 比如说ant-design-vue  element-plus等
// import Components from "unplugin-vue-components/vite";
// //ant-design-vue
// import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    plugins: [
        { src: "~/plugins/server-only.js", mode: "server" },

        { src: "~/plugins/client-only.js", mode: "client" },
    ],
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
    modules: ["@element-plus/nuxt", "@vite-pwa/nuxt"], //, "@ant-design-vue/nuxt"],
    vite: {
        // resolve: {
        //     alias: [
        //         "advancedFormat",
        //         "arraySupport",
        //         "badMutable",
        //         "bigIntSupport",
        //         "buddhistEra",
        //         "calendar",
        //         "customParseFormat",
        //         "dayOfYear",
        //         "devHelper",
        //         "duration",
        //         "isBetween",
        //         "isLeapYear",
        //         "isMoment",
        //         "isoWeek",
        //         "isoWeeksInYear",
        //         "isSameOrAfter",
        //         "isSameOrBefore",
        //         "isToday",
        //         "isTomorrow",
        //         "isYesterday",
        //         "localeData",
        //         "localizedFormat",
        //         "minMax",
        //         "negativeYear",
        //         "objectSupport",
        //         "pluralGetSet",
        //         "preParsePostFormat",
        //         "quarterOfYear",
        //         "relativeTime",
        //         "timezone",
        //         "toArray",
        //         "toObject",
        //         "updateLocale",
        //         "utc",
        //         "weekday",
        //         "weekOfYear",
        //         "weekYear",
        //     ].map((a) => ({
        //         find: `dayjs/plugin/${a}.js`,
        //         replacement: "dayjs/esm/plugin/" + a + "/index.js",
        //     })),
        // },
        plugins: [
            // AutoImport({
            //     //安装两行后你会发现在组件中不用再导入ref，reactive等
            //     imports: ["vue", "vue-router"],
            //     dts: "src/auto-import.d.ts",
            //     //ant-design-vue
            //     resolvers: [AntDesignVueResolver()],
            // }),
            // Components({
            //     //ant-design-vue   importStyle = false 样式就没了
            //     resolvers: [
            //         AntDesignVueResolver({
            //             importStyle: true,
            //             resolveIcons: true,
            //         }),
            //     ],
            // }),
        ],
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
