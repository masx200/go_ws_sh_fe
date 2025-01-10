<template>
    <div
        class="fullscreen-div"
        v-show="!error && (loading || !data || data?.length == 0)"
    >
        <Loading
            v-show="!error && (loading || !data || data?.length == 0)"
        ></Loading>
    </div>
    <div v-if="shouldShow" class="app-container">
        <header
            class="header"
            v-show="error || !(loading || !data || data?.length == 0)"
        >
            <el-button type="primary" @click="handleLogin">登录</el-button>
            <span :style="loginstyle">{{ loginstate }}</span>
            <el-button type="danger" @click="handleLogout">退出</el-button>
        </header>

        <main
            class="main-content"
            v-show="error || !(loading || !data || data?.length == 0)"
        >
            <div
                style="
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    flex-wrap: wrap;
                    align-content: center;
                    justify-content: center;
                    align-items: center;
                "
            >
                <div
                    class="flex flex-wrap gap-4 items-center"
                    style="
                        display: flex;
                        align-content: center;
                        justify-content: center;
                        align-items: center;
                        flex-wrap: wrap;
                        flex-direction: column;
                    "
                >
                    <el-row align="middle" justify="center">
                        <span>网址</span>
                        <div
                            style="margin-left: 10px; margin-right: 10px"
                        ></div>
                        <el-select
                            v-loading="loading"
                            :loading="loading"
                            v-model="urlvalue"
                            placeholder="Select"
                            size="large"
                            style="width: 800px"
                            @change="
                                async (value) => {
                                    await handleServerChange(value);
                                }
                            "
                        >
                            <el-option
                                v-for="item in urloptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-row>

                    <hr />
                    <el-row align="middle" justify="center">
                        <span>会话</span>
                        <div
                            style="margin-left: 10px; margin-right: 10px"
                        ></div>
                        <el-select
                            v-loading="loading"
                            :loading="loading"
                            v-model="sessionvalue"
                            placeholder="Select"
                            size="large"
                            style="width: 800px"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-row>
                </div>
                <hr />

                <el-button size="large" type="default" @click="handleconnect"
                    >连接</el-button
                >
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
async function handleServerChange(value: any) {
    const server = value;
    if (server) {
        await runAsync(
            (await fetchServerInfoServer(server)).serverinfo?.[0].token ??
                gettoken() ??
                "",
            value,
        ).then(
            (a) => console.log(a),
            (e) => console.error(e),
        );
    }
}
const shouldShow = computed(() => {
    return urlvalue.value.length && toeknvalue.value.length;
});
const urlvalue = ref("");
const toeknvalue = ref("");
onMounted(async () => {
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
    options.value = [
        {
            value: localStorage.getItem("session") ?? "",
            label: localStorage.getItem("session") ?? "",
        },
    ];
    sessionvalue.value = localStorage.getItem("session") ?? "";
    toeknvalue.value = localStorage.getItem("token") ?? "";
    return (urlvalue.value = localStorage.getItem("server") ?? "");
});
async function handleconnect() {
    if (urlvalue.value.length == 0 || sessionvalue.value.length == 0) {
        ElMessage.error("请选择会话和网址");
        return;
    }
    await router.push(
        "/shell?server=" +
            encodeURIComponent(urlvalue.value) +
            "&session=" +
            sessionvalue.value,
    );
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
} from "~/src/ServerConnectionInfo";
import { gettoken, list } from "../src/list.ts";
const sessionvalue = ref("");
onMounted(() => {
    const url = localStorage?.getItem("server");
    const token = localStorage?.getItem("token");
    if (!token || !url) {
        router.push("/login?redirect=/");
    }
    // 这里可以添加初始化逻辑
});
const options: Ref<{ value: string; label: string }[]> = ref<
    { value: string; label: string }[]
>([]);
const urloptions: Ref<{ value: string; label: string }[]> = ref<
    { value: string; label: string }[]
>([]);
const router = useRouter();
async function service(token: string, server: string) {
    if (!token) throw new Error("token is null");
    const urlserver = server ?? localStorage.getItem("server");
    if (!urlserver) throw new Error("url is null");
    const newLocal_1 = await list({ token }, new URL("/list", urlserver).href);
    if (newLocal_1.username.length) {
        ElMessage.success("登录成功:" + newLocal_1.username);
        loginstate.value = "登录成功:" + newLocal_1.username;
        loginstyle.value = "color:green";
        const session = newLocal_1.list[0];
        localStorage.setItem("token", token);
        localStorage.setItem("server", server);
        localStorage.setItem("session", session);
        return newLocal_1.list;
    }
    throw new Error("登录失败,服务端没有session列表");
    // console.log()
}
onMounted(async () => {
    await runAsync(gettoken() ?? "", localStorage.getItem("server") ?? "").then(
        (a) => console.log(a),
        (e) => console.error(e),
    );
});
const { data, error, loading, runAsync } = useRequest(service, {
    defaultParams: ["", ""],
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
    if (data) {
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
if (data.value) {
    options.value = data.value?.map((item) => {
        return {
            value: item,
            label: item,
        };
    });
}
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
    if (token) {
        try {
            const url = localStorage.getItem("server");
            if (!url) throw new Error("url is null");
            const newLocal = await logout(
                {
                    token: token,
                },
                new URL("/logout", url).href,
            );
            console.log(newLocal);
            cleartoken(newLocal);
            localStorage.clear();
            ElMessage.success("退出登录成功");
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
