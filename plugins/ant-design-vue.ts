// plugins/element-plus-icons.ts
import type { NuxtApp } from "nuxt/app";
import antd from "ant-design-vue";
//@ts-ignore
export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
    //@ts-ignore
    nuxtApp.vueApp.use(antd);
});
