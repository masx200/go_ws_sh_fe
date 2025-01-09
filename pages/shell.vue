<template>
    <div class="fullscreen-div" v-show="loading">
        <Loading v-show="loading"></Loading>
    </div>
    <App
        v-if="!loading"
        :wsprotocol="appopts.wsprotocol"
        v-bind:ws-url="appopts.wsurl"
        :reconnect="reconnect"
    ></App>
</template>
<script setup lang="ts">
import Loading from "~/src/loading.vue";
const reconnect = false;
import App from "~/src/App.vue";
import { fetchServerInfoServer } from "~/src/ServerConnectionInfo";
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
    const url = new URL(location.href).searchParams.get("server");
    const token = url
        ? (await fetchServerInfoServer(url)).serverinfo?.[0].token
        : localStorage?.getItem("token");
    if (!token || !url || !session) {
        return router.push("/");
    } else {
        appopts.wsprotocol = encodeURIComponent("token=" + token);
        const url1 = new URL(url);
        url1.protocol = url1.protocol.replace("http", "ws");
        url1.pathname = session;
        appopts.wsurl = url1.href;
        // alert("加载成功");
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
