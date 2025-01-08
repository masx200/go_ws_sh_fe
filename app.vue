<template>
    <div style="height: 100%">
        <NuxtRouteAnnouncer />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
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
</script>
