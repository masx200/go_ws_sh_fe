<template>
    <div class="app-container">
        <header
            class="header"
            v-show="error || !(loading || !data || data?.length == 0)"
        >
            <el-button type="primary" @click="handleLogin">登录</el-button>
            <span :style="loginstyle">{{ loginstate }}</span>
            <el-button type="danger" @click="handleLogout">退出</el-button>
        </header>
        <Loading
            v-show="!error && (loading || !data || data?.length == 0)"
        ></Loading>
        <main
            class="main-content"
            v-show="error || !(loading || !data || data?.length == 0)"
        >
            <div
                style="
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
                    "
                >
                    <el-select
                        v-loading="loading"
                        :loading="loading"
                        v-model="value"
                        placeholder="Select"
                        size="large"
                        style="width: 500px"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
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
async function handleconnect() {
    router.push("/shell/" + value.value);
}
const loginstate = ref("");
const loginstyle = ref("");
import Loading from "~/src/loading.vue";
const value = ref("");
onMounted(() => {
    const token = localStorage?.getItem("token");
    if (!token) {
        router.push("/login");
    }
    // 这里可以添加初始化逻辑
});
const options: Ref<{ value: string; label: string }[]> = ref<
    { value: string; label: string }[]
>([]);
import { gettoken, list } from "../src/list.ts";
import { ElButton, ElMessage } from "element-plus";
import { useRequest } from "vue-hooks-plus";
import { cleartoken, logout } from "~/src/logout";
const router = useRouter();
async function service(token: string) {
    if (!token) throw new Error("token is null");
    const newLocal_1 = await list({ token });
    if (newLocal_1.username.length) {
        ElMessage.success("登录成功:" + newLocal_1.username);
        loginstate.value = "登录成功:" + newLocal_1.username;
        loginstyle.value = "color:green";
    }
    return newLocal_1.list;
}
onMounted(async () => {
    await runAsync(gettoken() ?? "").then(console.log, console.error);
});
const { data, error, loading, runAsync } = useRequest(service, {
    defaultParams: [""],
    manual: true,
});
watch(error, (error) => {
    console.log(error);
    ElMessage.error("获取列表失败:" + String(error));
    loginstate.value = "登录失败:" + String(error);
    loginstyle.value = "color:red";
});
watch(data, (data) => {
    if (data) {
        options.value = data.map((item) => {
            return {
                value: item,
                label: item,
            };
        });

        value.value = data[0];
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
    router.push("/login");
};

const handleLogout = async () => {
    // 这里可以添加退出逻辑
    const token = localStorage?.getItem("token");
    if (token) {
        try {
            const newLocal = await logout({
                token: token,
            });
            console.log(newLocal);

            cleartoken(newLocal);
            ElMessage.success("退出登录成功");
        } catch (error) {
            console.log(error);

            ElMessage.error("退出登录失败:" + String(error));
        }
    } else {
        ElMessage.error("退出登录失败:未登录");
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
</style>
