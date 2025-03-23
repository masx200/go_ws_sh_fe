<template>
    <div style="
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: center;
        ">
        <!-- 添加导航栏 -->
        <a-menu mode="inline" v-model:openKeys="state_openKeys" v-model:selectedKeys="currentTab" :items="items" style="
                display: flex;
                width: 100%;
                align-content: center;
                justify-content: center;
                align-items: baseline;
                flex-direction: row;
            " :inlineIndent="0" :inlineCollapsed="false" @select="onselect">
            <!-- @openChange="onOpenChange" -->
        </a-menu>

        <!-- 用户管理分组 -->
        <div v-if="['displayUsers', 'createUser', 'changepassword'].includes(currentTab[0])" style="width: 100%;">
            <h2>用户管理</h2>
            <UserDisplay v-if="currentTab.includes('displayUsers')" />
            <CreateUser v-if="currentTab.includes('createUser')" />
            <UserManagement v-if="currentTab.includes('changepassword')" />
        </div>

        <!-- 令牌管理分组 -->
        <div v-if="['displayTokens', 'createToken', 'editTokenDescription'].includes(currentTab[0])"
            style="width: 100%;">
            <h2>令牌管理</h2>
            <TokenDisplay v-if="currentTab.includes('displayTokens')" />
            <TokenManagement v-if="currentTab.includes('createToken')" />
            <TokenDescriptionEdit v-if="currentTab.includes('editTokenDescription')" />
        </div>

        <!-- 会话管理分组 -->
        <div v-if="['displaySessions', 'createSession', 'editSessionAttributes'].includes(currentTab[0])"
            style="width: 100%;">
            <h2>会话管理</h2>
            <SessionDisplay v-if="currentTab.includes('displaySessions')" />
            <CreateSession v-if="currentTab.includes('createSession')" />
            <SessionAttributeEdit v-if="currentTab.includes('editSessionAttributes')" />
        </div>
    </div>
</template>

<script setup lang="ts">

import type{SelectInfo}from "ant-design-vue/es/menu/src/interface.d.ts"
function onselect(keys: SelectInfo) {
    // console.log(keys);
const firstkeypath = (keys.keyPath?.[0])?.toString();
if(!firstkeypath)return;
    state_openKeys.value = [firstkeypath];
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
import { Menu as AMenu, type MenuProps } from "ant-design-vue";
import { ref } from "vue";
import UserManagement from "../src/UserManagement.vue";
import type { ItemType } from 'ant-design-vue';
import { fetchServerInfoServer } from "~/src/ServerConnectionInfo";
import CreateSession from "../src/CreateSession.vue";
import CreateUser from "../src/CreateUser.vue";
import SessionDisplay from "../src/SessionDisplay.vue";
import TokenDisplay from "../src/TokenDisplay.vue";
import TokenManagement from "../src/TokenManagement.vue";
import UserDisplay from "../src/UserDisplay.vue";
import TokenDescriptionEdit from "../src/TokenDescriptionEdit.vue";
import SessionAttributeEdit from "../src/SessionAttributeEdit.vue";

const state_openKeys = ref<string[]>([]);
// watch(openKeys, (newValue, oldValue) => {
//     console.log(newValue, oldValue);
// })
const menuitems: ItemType[] = [
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
                }
            },
            {
                key: "createUser",
                label: "创建用户",
                title: "创建用户",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                    paddingLeft: "0px",
                }
            },
            {
                key: "changepassword",
                label: "修改密码",
                title: "修改密码",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                    paddingLeft: "0px",
                }
            },
        ]
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
                }
            },
            {
                key: "createToken",
                label: "创建令牌",
                title: "创建令牌",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                }
            },
            {
                key: "editTokenDescription",
                label: "修改令牌",
                title: "修改令牌",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                }
            }
        ]
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
                }
            },
            {
                key: "createSession",
                label: "创建会话",
                title: "创建会话",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                }
            },
            {
                key: "editSessionAttributes",
                label: "修改会话",
                title: "修改会话",
                style: {
                    width: "calc(100%)",
                    textAlign: "center",
                }
            }
        ]
    }
] satisfies ItemType[];

const items = computed<ItemType[]>(() => {
    const length = menuitems.length;
    return menuitems.map(a => ({
        ...a, style: Object.assign(a?.style || {}, {
            width: `calc(100%/${length})`
        })
    })) as ItemType[];
});

const currentTab = ref(["displayUsers"]); // 默认显示用户页面

const router = useRouter();
onMounted(async () => {
    const server = new URL(location.href).searchParams.get("server");
    const conninfo = (await fetchServerInfoServer(server || ""))
        .serverinfo?.[0];
    const token = server ? conninfo.token : localStorage?.getItem("token");
    if (!token || !server) {
        return router.push("/");
    }
});
</script>
