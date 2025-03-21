<template>
    <UserManagement></UserManagement>
</template>
<script setup lang="ts">
import UserManagement from "../src/UserManagement.vue";

const router = useRouter();
import { fetchServerInfoServer } from "~/src/ServerConnectionInfo";
onMounted(async () => {
    const server = new URL(location.href).searchParams.get("server");
    const conninfo = (await fetchServerInfoServer(server || ""))
        .serverinfo?.[0];
    const token = server ? conninfo.token : localStorage?.getItem("token");
    if (!token || !server) {
        return router.push("/");
    } else {
    }
});
</script>
