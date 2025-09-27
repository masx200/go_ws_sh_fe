// plugins/element-plus-icons.ts
import type { NuxtApp } from "nuxt/app";
import ElementPlus from "element-plus";
//@ts-ignore
export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
    //@ts-ignore
    nuxtApp.vueApp.use(ElementPlus);
});
