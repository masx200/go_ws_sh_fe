<template>
    <div
        style="
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: center;
        "
    >
        <el-page-header
            style="border: 1px solid rgb(235, 237, 240); width: 100%"
            :breadcrumb="{ routes, itemRender }"
            title="管理"
        >
            <template #extra>
                <span
                    ><strong>{{ subtitle }}</strong></span
                >
            </template>
        </el-page-header>
        <!-- 添加导航栏 -->
        <el-menu
            mode="horizontal"
            v-model:default-openeds="state_openKeys"
            v-model:default-active="currentTab[0]"
            :items="items"
            style="
                display: flex;
                width: 100%;
                align-content: center;
                justify-content: center;
                align-items: baseline;
                flex-direction: row;
            "
            :inline-indent="0"
            :collapse="false"
            @select="onselect"
        >
            <!-- @openChange="onOpenChange" -->
        </el-menu>

        <!-- 用户管理分组 -->
        <div
            v-if="
                ['displayUsers', 'createUser', 'changepassword'].includes(
                    //@ts-ignore
                    currentTab[0],
                )
            "
            style="width: 100%"
        >
            <h2>用户管理</h2>
            <UserDisplay v-if="currentTab.includes('displayUsers')" />
            <CreateUser v-if="currentTab.includes('createUser')" />
            <UserManagement v-if="currentTab.includes('changepassword')" />
        </div>

        <!-- 令牌管理分组 -->
        <div
            v-if="
                [
                    'displayTokens',
                    'createToken',
                    'editTokenDescription',
                      //@ts-ignore
                ].includes(currentTab[0])
            "
            style="width: 100%"
        >
            <h2>令牌管理</h2>
            <TokenDisplay v-if="currentTab.includes('displayTokens')" />
            <CreateToken v-if="currentTab.includes('createToken')" />
            <TokenDescriptionEdit
                v-if="currentTab.includes('editTokenDescription')"
            />
        </div>

        <!-- 会话管理分组 -->
        <div
            v-if="
                [
                    'displaySessions',
                    'createSession',
                    'editSessionAttributes',
                      //@ts-ignore
                ].includes(currentTab[0])
            "
            style="width: 100%"
        >
            <h2>会话管理</h2>
            <SessionDisplay v-if="currentTab.includes('displaySessions')" />
            <CreateSession v-if="currentTab.includes('createSession')" />
            <SessionAttributeEdit
                v-if="currentTab.includes('editSessionAttributes')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { h } from "vue";
import { RouterLink } from "vue-router";
import { ElPageHeader } from "element-plus";
import type { MenuProps } from "element-plus";
const routes = [
    {
        path: "index",
        breadcrumbName: "首页",
    },

    {
        path: "manage",
        breadcrumbName: "管理",
    },
];

const subtitle = ref("服务器网址：");
//@ts-ignore
function itemRender({ route, params, routes, paths }) {
    console.log({ route, params, routes, paths });
    if (routes.indexOf(route) === routes.length - 1) {
        return h("span", {}, [route.breadcrumbName]);
    }
    return h(
        RouterLink,
        { to: route.path == "index" ? "/" : paths.join("/") },
        [route.breadcrumbName],
    );
}
onMounted(async () => {
    const url = new URL(window.location.href);
    const tab = url.searchParams.get("tab");
    const open = url.searchParams.get("open");
    if (tab) {
        currentTab.value = [tab];
    }
    if (open) {
        state_openKeys.value = [open];
    }
});
async function onselect(keys: any) {
    // console.log(keys);
    const firstkeypath = keys.keyPath?.[0]?.toString();
    const secondpath = keys.keyPath?.[1]?.toString();
    if (!firstkeypath) return;
    if (!secondpath) return;
    state_openKeys.value = [firstkeypath];

    const url = new URL(window.location.href);
    url.searchParams.set("tab", secondpath);
    url.searchParams.set("open", firstkeypath);
    await router.push(url.href.slice(url.origin.length));
}
// const rootSubmenuKeys = ref<string[]>(['UsersManage', 'TokenManage', 'SessionManage']);
// const onOpenChange = (openKeys: (string | number)[]) => {
//     console.log(openKeys);
//     console.log(state_openKeys.value);
//     const latestOpenKey = openKeys.find(key => state_openKeys.value.indexOf(key) === -1);
//     // debugger;
// console.log(latestOpenKey)
//     if (  rootSubmenuKeys.value.indexOf(latestOpenKey) === -1) {
//         state_openKeys.value = openKeys;
//     } else {
//         state_openKeys.value = latestOpenKey ? [latestOpenKey] : [];
//     }
// };
// import type { MenuInstance } from "element-plus";
import { ElMenu } from "element-plus";
import { ref } from "vue";
import { fetchServerInfoServer } from "../../src/ServerConnectionInfo";
import CreateSession from "../../src/CreateSession.vue";
import CreateToken from "../../src/CreateToken.vue";
import CreateUser from "../../src/CreateUser.vue";
import SessionAttributeEdit from "../../src/SessionAttributeEdit.vue";
import SessionDisplay from "../../src/SessionDisplay.vue";
import TokenDescriptionEdit from "../../src/TokenDescriptionEdit.vue";
import TokenDisplay from "../../src/TokenDisplay.vue";
import UserDisplay from "../../src/UserDisplay.vue";
import UserManagement from "../../src/UserManagement.vue";

const state_openKeys = ref<string[]>([]);
// watch(openKeys, (newValue, oldValue) => {
//     console.log(newValue, oldValue);
// })
const menuitems = [
    {
        key: "UsersManage",
        label: "管理用户",
        title: "管理用户",
        style: {
            width: "calc(100%/3)",
            textAlign: "center",
            paddingLeft: "0px",
        },
        children: [
            {
                key: "displayUsers",
                label: "显示用户",
                title: "显示用户",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                    paddingLeft: "0px",
                },
            },
            {
                key: "createUser",
                label: "创建用户",
                title: "创建用户",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                    paddingLeft: "0px",
                },
            },
            {
                key: "changepassword",
                label: "修改密码",
                title: "修改密码",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                    paddingLeft: "0px",
                },
            },
        ],
    },
    {
        key: "TokenManage",
        label: "管理令牌",
        title: "管理令牌",
        style: {
            width: "calc(100%/3)",
            textAlign: "center",
            paddingLeft: "0px",
        },
        children: [
            {
                key: "displayTokens",
                label: "显示令牌",
                title: "显示令牌",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                },
            },
            {
                key: "createToken",
                label: "创建令牌",
                title: "创建令牌",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                },
            },
            {
                key: "editTokenDescription",
                label: "修改令牌",
                title: "修改令牌",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                },
            },
        ],
    },
    {
        key: "SessionManage",
        label: "管理会话",
        title: "管理会话",
        style: {
            width: "calc(100%/3)",
            textAlign: "center",
            paddingLeft: "0px",
        },
        children: [
            {
                key: "displaySessions",
                label: "显示会话",
                title: "显示会话",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                },
            },
            {
                key: "createSession",
                label: "创建会话",
                title: "创建会话",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                },
            },
            {
                key: "editSessionAttributes",
                label: "修改会话",
                title: "修改会话",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                },
            },
        ],
    },
] as const;

const items = computed(() => {
    const length = menuitems.length;
    return menuitems.map((a) => ({
        ...a,
        style: Object.assign(a?.style || {}, {
            width: `calc(100%/${length})`,
        }),
    }));
});

const currentTab = ref(["displayUsers"]); // 默认显示用户页面

const router = useRouter();
onMounted(async () => {
    if (!localStorage?.getItem("server")) {
        return router.push("/");
    }
    if (!localStorage?.getItem("token")) {
        return router.push("/");
    }
    const server = new URL(location.href).searchParams.get("server");
    if (!server || !localStorage?.getItem("token")) {
        return router.push("/");
    }

    subtitle.value = "服务器网址：" + server;
    const conninfo = (await fetchServerInfoServer(server || ""))
        .serverinfo?.[0];
          //@ts-ignore
    const token = server ? conninfo.token : localStorage?.getItem("token");
    if (!token || !server) {
        return router.push("/");
    }
});
</script>
