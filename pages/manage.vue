<template>
    <div style="
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: center;
        ">
        <!-- 添加导航栏 -->
        <a-menu v-model:selectedKeys="currentTab" mode="horizontal" :items="items" style="
                display: flex;
                width: 100%;
                align-content: center;
                justify-content: center;
                align-items: baseline;
                flex-direction: row;
            ">
        </a-menu>

        <!-- 根据导航栏选择显示不同的组件 -->
        <UserManagement v-if="currentTab.includes('password')" />
        <TokenManagement v-if="currentTab.includes('createToken')" />
        <TokenDisplay v-if="currentTab.includes('displayTokens')" />
    </div>
</template>

<script setup lang="ts">
const menuitems: MenuProps["items"] = [
    {
        key: "password",
        //  icon: () => h(MailOutlined),
        label: "密码修改",
        title: "密码修改",
        style: {
            width: "calc(100%/3)",
            textAlign: "center",
        }
    },
    {
        key: "createToken",
        // icon: () => h(AppstoreOutlined),
        label: "令牌创建",
        title: "令牌创建",
        style: {
            width: "calc(100%/3)",
            textAlign: "center",
        }
    },
    {
        key: "displayTokens",
        // icon: () => h(AppstoreOutlined),
        label: "显示令牌",
        title: "显示令牌",
        style: {
            width: "calc(100%/3)",
            textAlign: "center",
        }
    },
] satisfies MenuProps["items"];
const items = ref<MenuProps["items"]>(menuitems);
onMounted(() => {
    const length = menuitems.length;
    items.value = menuitems.map(a => ({
        ...a, style: Object.assign(a?.style || {}, {

            width: `calc(100%/${length})`
        }
        )
    }))as  MenuProps["items"]
});
import { ref } from "vue";
import { Menu as AMenu, type MenuProps } from "ant-design-vue";

import UserManagement from "../src/UserManagement.vue";
import TokenManagement from "../src/TokenManagement.vue";
import TokenDisplay from "../src/TokenDisplay.vue"; // 假设存在一个 TokenDisplay.vue 组件

const currentTab = ref(["password"]); // 默认显示密码修改页面

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
