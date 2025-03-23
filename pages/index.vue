<template>
    <div class="fullscreen-div" v-if="showloading || loading">
        <Loading v-if="showloading || loading"></Loading>
    </div>

    <!-- v-if="shouldShow" -->
    <div class="app-container" v-if="!(showloading || loading)">
        <!-- v-if="error || !(loading || !data || data?.length == 0)" -->
        <header class="header" v-if="!(showloading || loading)">
            <el-button type="primary" @click="handleLogin">登录</el-button>
            <span :style="loginstyle">{{ loginstate }}</span>
            <el-button type="danger" @click="handleLogout">退出</el-button>
        </header>
        <!-- v-if="error || !(loading || !data || data?.length == 0)" -->
        <main class="main-content" v-if="!(showloading || loading)">
            <div style="
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    flex-wrap: wrap;
                    align-content: center;
                    justify-content: center;
                    align-items: center;
                ">
                <div class="flex flex-wrap gap-4 items-center" style="
                        display: flex;
                        align-content: center;
                        justify-content: center;
                        align-items: center;
                        flex-wrap: wrap;
                        flex-direction: column;
                    ">
                    <el-row align="middle" justify="center">
                        <span>网址</span>
                        <div style="margin-left: 10px; margin-right: 10px"></div>
                        <el-select v-loading="loading" :loading="loading" v-model="urlvalue" placeholder="Select"
                            size="large" style="width: 800px" @change="async (value: string) => {
        await handleServerChange(value);
    }
        ">
                            <el-option v-for="item in urloptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-row>

                    <hr />
                    <el-row align="middle" justify="center">
                        <span>会话</span>
                        <div style="margin-left: 10px; margin-right: 10px"></div>
                        <el-select v-loading="loading" :loading="loading" v-model="sessionvalue" placeholder="Select"
                            size="large" style="width: 800px">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-row>
                </div>
                <hr />
                <el-row align="middle" justify="center">
                    <el-button size="large" type="primary" @click="handlemanage">管理</el-button>

                    <el-button size="large" type="success" @click="handleconnect">连接</el-button>

                    <el-button size="large" type="danger" @click="handledelete">删除</el-button></el-row>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
async function handlemanage() {
    if (urlvalue.value.length == 0) {
        ElMessage.error("请选择网址");
        return;
    }
    try {
        showloading.value = true;
        await runAsync(gettoken() ?? "", localStorage.getItem("server") ?? "", {
            type: "token",
            identifier: localStorage.getItem("identifier") ?? "",
            username: localStorage.getItem("username") ?? "",
        }).then(
            (a) => console.log(a),
            (e) => console.error(e),
        );
        showloading.value = false;

        const newLocalurl = new URL(urlvalue.value);
        newLocalurl.hash = "";
        urlvalue.value = newLocalurl.href;
        openNewWindow(
            new URL(
                "/manage?server=" + encodeURIComponent(urlvalue.value),
                location.href,
            ).href,
        );
    } finally {
        showloading.value = false;
    }
}
async function handledelete() {
    const server = urlvalue.value;

    if (server.length) {
        await TableServerInfoDeleteByServer(server);

        const serverinfo = await fetchServerInfoAll();
        if (serverinfo.serverinfo.length == 0) {
            router.push("/login?redirect=/");
        } else {
            urloptions.value = serverinfo.serverinfo.map((a) => ({
                value: a.server,
                label: a.server,
            }));
            urlvalue.value = serverinfo.serverinfo[0].server;
        }
    }
}
const showloading = ref(true);
async function handleServerChange(value: string) {
    const server = value;
    if (server) {
        try {
            showloading.value = true;
            const serverinfooptions = (await fetchServerInfoServer(server))
                .serverinfo?.[0];
            await runAsync(serverinfooptions.token ?? gettoken() ?? "", value, {
                type: "token",
                identifier: serverinfooptions.identifier ?? "",
                username: serverinfooptions.username ?? "",
            }).then(
                (a) => console.log(a),
                (e) => console.error(e),
            );
        } finally {
            showloading.value = false;
        }
    }
}
// const shouldShow = computed(() => {
//     return urlvalue.value.length && toeknvalue.value.length;
// });
const urlvalue = ref("");

const toeknvalue = ref("");
onMounted(async () => {
    try {
        showloading.value = true;
        const serverinfo = await fetchServerInfoAll();
        urloptions.value = serverinfo.serverinfo.length
            ? serverinfo.serverinfo.map((a) => ({
                value: a.server,
                label: a.server,
            }))
            : [
                {
                    value: localStorage.getItem("server") ?? "",
                    label: localStorage.getItem("server") ?? "",
                },
            ];
        options.value = serverinfo.serverinfo
            .filter((i) => i.server == serverinfo.serverinfo[0].server)
            .map((a) => a.session)
            .map((s) => {
                return s.map((c) => {
                    return {
                        value: c,
                        label: c,
                    };
                });
            })[0];
        sessionvalue.value = localStorage.getItem("session") ?? "";
        toeknvalue.value = localStorage.getItem("token") ?? "";
        urlvalue.value = localStorage.getItem("server") ?? "";
        if (urlvalue.value.length == 0) {
            urlvalue.value = serverinfo.serverinfo[0].server;
            showloading.value = false;
        }
    } finally {
        showloading.value = false;
    }
});
function openNewWindow(strUrl: string) {
    // const strUrl = "https://www.baidu.com";
    let a = document.createElement("a");
    document.body.appendChild(a);
    // a.style = "display: none";
    a.setAttribute("style", "display: none");
    a.target = "_blank";
    a.href = strUrl;
    a.click();
    document.body.removeChild(a);
}
async function handleconnect() {
    if (urlvalue.value.length == 0 || sessionvalue.value.length == 0) {
        ElMessage.error("请选择会话和网址");
        return;
    }
    try {
        showloading.value = true;
        await runAsync(gettoken() ?? "", localStorage.getItem("server") ?? "", {
            type: "token",
            identifier: localStorage.getItem("identifier") ?? "",
            username: localStorage.getItem("username") ?? "",
        }).then(
            (a) => console.log(a),
            (e) => console.error(e),
        );
        showloading.value = false;

        const newLocalurl = new URL(urlvalue.value);
        newLocalurl.hash = "";
        urlvalue.value = newLocalurl.href;
        openNewWindow(
            new URL(
                "/shell?server=" +
                encodeURIComponent(urlvalue.value) +
                "&session=" +
                sessionvalue.value,
                location.href,
            ).href,
        );
    } finally {
        showloading.value = false;
    }
}
const loginstate = ref("");
const loginstyle = ref("");
import { ElButton, ElMessage } from "element-plus";
import { useRequest } from "vue-hooks-plus/es/useRequest/useRequest";
import Loading from "~/src/loading.vue";
import { cleartoken, logout } from "~/src/logout";
import {
    fetchServerInfoAll,
    fetchServerInfoServer,
    TableServerInfoDeleteAll,
    TableServerInfoDeleteByServer,
} from "~/src/ServerConnectionInfo";
import { gettoken, listsessions } from "../src/list.ts";
const sessionvalue = ref("");
onMounted(() => {
    const url = localStorage?.getItem("server");
    const token = localStorage?.getItem("token");
    if (!token || !url) {
        router.push("/login?redirect=/");
    }
    // 这里可以添加初始化逻辑

    const session = localStorage?.getItem("session");
    if (session) {
        sessionvalue.value = session;
        options.value = [
            {
                value: localStorage.getItem("session") ?? "",
                label: localStorage.getItem("session") ?? "",
            },
        ];
    }
});
const options: Ref<{ value: string; label: string }[]> = ref<
    { value: string; label: string }[]
>([]);
const urloptions: Ref<{ value: string; label: string }[]> = ref<
    { value: string; label: string }[]
>([]);
const router = useRouter();
async function service(
    token: string,
    server: string,
    options: { type: string; username: string; identifier: string },
): Promise<string[]> {
    try {
        showloading.value = true;
        if (!token) throw new Error("token is null");
        const urlserver = server ?? localStorage.getItem("server");
        if (!urlserver) throw new Error("url is null");
        const sessionresult = await listsessions(
            {
                authorization: {
                    username: options.username,
                    token: token,
                    identifier: options.identifier,
                    type: "token",
                },

            },
            new URL("/sessions", urlserver).href,
        );
        if (sessionresult.username.length) {
            ElMessage.success("登录成功:" + sessionresult.username);
            loginstate.value = "登录成功:" + sessionresult.username;
            loginstyle.value = "color:green";
            const session = sessionresult.sessions[0].name;
            localStorage.setItem("token", token);
            localStorage.setItem("server", server);
            localStorage.setItem("session", session);
            return sessionresult.sessions.map((a) => a.name);
        }
        throw new Error("登录失败,服务端没有session列表");
    } finally {
        showloading.value = false;
    }

    // console.log()
}
// onMounted(async () => {
//     await runAsync(gettoken() ?? "", localStorage.getItem("server") ?? "").then(
//         (a) => console.log(a),
//         (e) => console.error(e),
//     );
// });
const { data, error, loading, runAsync } = useRequest(service, {
    defaultParams: [
        "",
        "",
        {
            type: "",
            username: "",
            identifier: "",
        },
    ],
    manual: true,
});
watch(error, async (error) => {
    if (error) {
        const url = localStorage?.getItem("server");
        const token = localStorage?.getItem("token");
        if (!token || !url) {
            await router.push("/login?redirect=/");
            return;
        }
        console.log(error);
        ElMessage.error("获取列表失败:" + String(error));
        loginstate.value = "登录失败:" + String(error);
        loginstyle.value = "color:red";
    }
});
watch(data, (data) => {
    if (data?.length) {
        options.value = data.map((item) => {
            return {
                value: item,
                label: item,
            };
        });
        if (data.length) {
            sessionvalue.value = data[0];
            localStorage.setItem("session", data[0]);
        }
    }
});

onMounted(() => {
    if (data?.value?.length) {
        options.value = data.value?.map((item) => {
            return {
                value: item,
                label: item,
            };
        });
    }
});
const handleLogin = () => {
    // 这里可以添加登录逻辑
    //ElMessage.success("登录页面");
    return router.push("/login?redirect=/");
};

const handleLogout = async () => {
    await TableServerInfoDeleteAll().then(
        () => {
            ElMessage.success("退出登录成功");
        },
        (e) => ElMessage.error("退出登录失败:" + String(error)),
    );
    // 这里可以添加退出逻辑
    const token = localStorage?.getItem("token");
    const username = localStorage?.getItem("username");
    const identifier = localStorage?.getItem("identifier");
    if (token && identifier && username) {
        try {
            const url = localStorage.getItem("server");
            if (!url) throw new Error("url is null");
            const logoutresult = await logout(
                {
                    authorization: {
                        type: "token",
                        username: username,
                        identifier: identifier,

                        token: token,
                    }, token: {
                        identifier: identifier,
                        username: username,
                    }
                },
                new URL(url).href,
            );
            console.log(logoutresult);
            cleartoken(logoutresult);
            localStorage.clear();
            ElMessage.success("退出登录成功");
            return router.push("/login?redirect=/");
        } catch (error) {
            console.log(error);

            ElMessage.error("退出登录失败:" + String(error));
        } finally {
            return router.push("/login?redirect=/");
        }
    } else {
        ElMessage.error("退出登录失败:未登录");
        return router.push("/login?redirect=/");
    }
};
</script>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: white;
}

.main-content {
    flex: 1;
    padding: 20px;
    background-color: #f0f2f5;
}

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
