<template>
    <NuxtPwaManifest />
    <div style="height: 100%">
        <NuxtRouteAnnouncer />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
// onCreated(() => {
//     console.log("hello world");
// });
// onMounted(() => {
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
// });

//@ts-ignore
// import $ from "virtual:https://cdn.jsdelivr.net/npm/jquery/+esm";

// console.log("jQuery", $);
</script>
