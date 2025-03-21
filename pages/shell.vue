<template>
    <div class="fullscreen-div" v-if="loading">
        <Loading v-if="loading"></Loading>
    </div>
    <App
        v-if="!loading"
        :wsprotocol="appopts.wsprotocol"
        v-bind:ws-url="appopts.wsurl"
        :reconnect="reconnect"
    ></App>
</template>
<script setup lang="ts">
if (typeof window == "undefined") {
    //@ts-ignore
    globalThis.window = {};
}
if (typeof self == "undefined") {
    //@ts-ignore
    globalThis.self = {};
}
if (typeof process == "undefined") {
    //@ts-ignore
    globalThis.process = {};
}
import App from "~/src/App.vue";
import Loading from "~/src/loading.vue";
import { fetchServerInfoServer } from "~/src/ServerConnectionInfo";
const reconnect = false;
const router = useRouter();
const appopts = reactive({
    wsprotocol: "",
    wsurl: "",
});
const loading = computed(
    () => !(appopts.wsprotocol.length && appopts.wsurl.length),
);
onMounted(async () => {
    const session = new URL(location.href).searchParams.get("session");
    const server = new URL(location.href).searchParams.get("server");
    const conninfo = (await fetchServerInfoServer(server || ""))
        .serverinfo?.[0];
    const token = server ? conninfo.token : localStorage?.getItem("token");
    if (!token || !server || !session) {
        return router.push("/");
    } else {
        const searchParams = new URLSearchParams();
        searchParams.set("token", token);
        searchParams.set("type", "token");
        searchParams.set("identifier", conninfo.identifier);
        appopts.wsprotocol = encodeURIComponent(searchParams.toString());
        const url1 = new URL(server);
        url1.protocol = url1.protocol.replace("http", "ws");
        url1.pathname = session;
        appopts.wsurl = url1.href;
        // alert("加载成功");
        localStorage.setItem("type", "token");
        localStorage.setItem("token", token);
        localStorage.setItem("server", server);
        localStorage.setItem("identifier", conninfo.identifier);
        localStorage.setItem("session", session);
    }
    // 这里可以添加初始化逻辑
});
</script>
<style lang="css" scoped>
.fullscreen-div {
    position: fixed;
    /* 固定定位，使其不会因为页面滚动而移动 */
    top: 0;
    left: 0;
    width: 100vw;
    /* 使用视口单位，确保宽度为整个视口的宽度 */
    height: 100vh;
    /* 使用视口单位，确保高度为整个视口的高度 */
    background-color: #f0f0f0;
    /* 你可以更改背景颜色 */
    z-index: 1000;
    /* 确保此 div 在其他内容之上 */
}
</style>
