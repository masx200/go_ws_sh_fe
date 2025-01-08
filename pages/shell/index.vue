<template>
    <App
        v-if="appopts.wsprotocol.length && appopts.wsurl.length"
        :wsprotocol="appopts.wsprotocol"
        v-bind:ws-url="appopts.wsurl"
    ></App>
</template>
<script setup lang="ts">
import App from "~/src/App.vue";
const router = useRouter();
const appopts = reactive({
    wsprotocol: "",
    wsurl: "",
});
onMounted(() => {
    const url = localStorage?.getItem("url");
    const token = localStorage?.getItem("token");
    if (!token || !url) {
        router.push("/");
    }
    // 这里可以添加初始化逻辑
});
</script>
