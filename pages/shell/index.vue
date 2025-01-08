<template>
    <App
        v-if="appopts.wsprotocol.length && appopts.wsurl.length"
        :wsprotocol="appopts.wsprotocol"
        v-bind:ws-url="appopts.wsurl"
        :reconnect="reconnect"
    ></App>
</template>
<script setup lang="ts">
const reconnect = false;
import App from "~/src/App.vue";
const router = useRouter();
const appopts = reactive({
    wsprotocol: "",
    wsurl: "",
});
onMounted(() => {
    const session = new URL(location.href).searchParams.get("session");
    const url = new URL(location.href).searchParams.get("server");
    const token = localStorage?.getItem("token");
    if (!token || !url || !session) {
        router.push("/");
    } else {
        appopts.wsprotocol = encodeURIComponent("token=" + token);
        const url1 = new URL(url);
        url1.protocol = url1.protocol.replace("http", "ws");
        url1.pathname = session;
        appopts.wsurl = url1.href;
    }
    // 这里可以添加初始化逻辑
});
</script>
