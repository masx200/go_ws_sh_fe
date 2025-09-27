// plugins/element-plus-icons.ts
import type { NuxtApp } from "nuxt/app";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
//@ts-ignore
export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        nuxtApp.vueApp.component(key, component);
    }
});
