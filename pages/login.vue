<template>
    <!-- 修改：添加导航栏容器 -->
    <div class="nav-container">
        <el-tabs
            v-model="activeTab"
            type="card"
            :stretch="true"
            @tab-change="handleTabChange"
        >
            <el-tab-pane label="密码登录" name="password">
                <!-- 密码登录表单 -->
                <el-card class="box-card" style="width: 100%">
                    <template #header>
                        <div class="card-header">
                            <span>密码登录</span>
                        </div>
                    </template>
                    <el-form
                        ref="loginFormRef"
                        :model="loginForm"
                        :rules="rules"
                        label-width="auto"
                        class="demo-ruleForm"
                    >
                        <el-form-item label="账号" prop="username">
                            <el-input
                                name="username"
                                v-model="loginForm.username"
                                autocomplete="on"
                            />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input
                                name="password"
                                v-model="loginForm.password"
                                type="password"
                                autocomplete="on"
                                show-password
                            />
                        </el-form-item>
                        <el-form-item label="网址" prop="server">
                            <el-input
                                name="server"
                                v-model="loginForm.server"
                                autocomplete="on"
                            />
                        </el-form-item>
                        <el-form-item class="center-button">
                            <el-button
                                size="large"
                                :loading="loading"
                                type="primary"
                                @click="submitForm(loginFormRef)"
                                >登录</el-button
                            >
                            <el-button
                                size="large"
                                @click="resetForm(loginFormRef)"
                                >重置</el-button
                            >
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <div class="card-header">
                            <span :style="loginstyle">{{ loginstate }}</span>
                        </div>
                    </template>
                </el-card>
            </el-tab-pane>
            <el-tab-pane label="令牌登录" name="token">
                <!-- 令牌登录表单 -->
                <el-card class="box-card" style="width: 100%">
                    <template #header>
                        <div class="card-header">
                            <span>令牌登录</span>
                        </div>
                    </template>
                    <el-form
                        ref="tokenFormRef"
                        :model="tokenForm"
                        :rules="tokenRules"
                        label-width="auto"
                        class="demo-ruleForm"
                    >
                        <!--<el-form-item label="账号" prop="username">
                            <el-input
                                v-model="tokenForm.username"
                                autocomplete="on"
                            />
                        </el-form-item>
                    -->

                        <el-form-item label="标识" prop="identifier">
                            <el-input
                                name="identifier"
                                v-model="tokenForm.identifier"
                                autocomplete="on"
                            /> </el-form-item
                        ><el-form-item label="令牌" prop="token">
                            <el-input
                                name="token"
                                v-model="tokenForm.token"
                                autocomplete="on"
                                type="password"
                                show-password
                            />
                        </el-form-item>
                        <el-form-item label="网址" prop="server">
                            <el-input
                                name="server"
                                v-model="tokenForm.server"
                                autocomplete="on"
                            />
                        </el-form-item>
                        <el-form-item class="center-button">
                            <el-button
                                size="large"
                                :loading="loading"
                                type="primary"
                                @click="submitTokenForm(tokenFormRef)"
                                >登录</el-button
                            >
                            <el-button
                                size="large"
                                @click="resetForm(tokenFormRef)"
                                >重置</el-button
                            >
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <div class="card-header">
                            <span :style="loginstyle">{{ loginstate }}</span>
                        </div>
                    </template>
                </el-card>
            </el-tab-pane>
        </el-tabs>
    </div>
    <!-- <div class="login-container">
        <!-- 这里原本的导航栏内容已移到上面 -->
    <!-- </div>  -->
</template>

<script setup lang="ts">
async function handleTabChange(tabPaneName: TabPaneName) {
    switch (tabPaneName) {
        case "password": {
            const url = new URL(window.location.href);
            url.searchParams.set("tab", "password");
            await router.push(url.href.slice(url.origin.length));
            break;
        }
        case "token": {
            const url = new URL(window.location.href);
            url.searchParams.set("tab", "token");
            await router.push(url.href.slice(url.origin.length));
            break;
        }
        default:
            break;
    }
}
import type { ValidateFieldsError } from "async-validator";
import type { FormInstance, FormRules, TabPaneName } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { listsessions } from "~/src/listsessions.ts";
import { updateOrAddIntoTableServerInfo } from "~/src/ServerConnectionInfo";
import { login, savetoken } from "../src/login.ts";

const activeTab = ref("password");
onMounted(() => {
    const url = new URL(window.location.href);
    const tab = url.searchParams.get("tab");
    if (tab === "token") {
        activeTab.value = "token";
        return;
    }
    if (tab === "password") {
        activeTab.value = "password";
        return;
    }
});
const loading = ref(false);
const loginstate = ref("");
const loginstyle = ref("");
const loginFormRef = ref<FormInstance | null>(null);
const tokenFormRef = ref<FormInstance | null>(null);

const loginForm = reactive({
    username: "",
    password: "",
    server: "",
});

const tokenForm = reactive({
    // username: "",
    server: "",
    token: "",
    identifier: "",
});

const router = useRouter();

const rules = reactive<FormRules<typeof loginForm>>({
    server: [
        { required: true, message: "请输入网址", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                try {
                    const url = new URL(value);
                    if (url.protocol === "http:" || url.protocol === "https:") {
                        callback();
                    } else {
                        callback(new Error("不是正确的网址"));
                    }
                } catch (error) {
                    callback(new Error("不是正确的网址"));
                }
            },
            message: "不是正确的网址",
            trigger: "blur",
        },
    ],
    username: [
        { required: true, message: "请输入账号", trigger: "blur" },
        { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 4, max: 120, message: "长度在 4 到 120 个字符", trigger: "blur" },
    ],
});

const tokenRules = reactive<FormRules<typeof tokenForm>>({
    server: [
        { required: true, message: "请输入网址", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                try {
                    const url = new URL(value);
                    if (url.protocol === "http:" || url.protocol === "https:") {
                        callback();
                    } else {
                        callback(new Error("不是正确的网址"));
                    }
                } catch (error) {
                    callback(new Error("不是正确的网址"));
                }
            },
            message: "不是正确的网址",
            trigger: "blur",
        },
    ],
    // username: [
    //     { required: true, message: "请输入账号", trigger: "blur" },
    //     { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" },
    // ],
    token: [{ required: true, message: "请输入令牌", trigger: "blur" },
  { min: 4, max: 120, message: "长度在 4 到 120 个字符", trigger: "blur" },

],
    identifier: [{ required: true, message: "请输入标识", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | null) => {
    if (!formEl) return;
    await formEl.validate(
        async (isValid: boolean, invalidFields?: ValidateFieldsError) => {
            if (isValid) {
                console.log("submit!");
                loading.value = true;
                try {
                    const newLocalurl = new URL(loginForm.server);
                    newLocalurl.hash = "";
                    loginForm.server = newLocalurl.href;
                    const loginresult = await login(
                        {
                            authorization: {
                                username: loginForm.username,
                                password: loginForm.password,
                                type: "password",
                            },
                            token: {
                                description: navigator.userAgent,
                                username: loginForm.username,
                            },
                        },
                        loginForm.server,
                    );
                    console.log(loginresult);
                    localStorage.setItem("server", loginForm.server);
                    loginstate.value = "登录成功:" + loginForm.username;
                    loginstyle.value = "color:green";
                    savetoken(loginresult);
                    ElMessage.success("登录成功:" + loginForm.username);

                    const urlserver = loginForm.server;
                    const token = loginresult.token;
                    const sessionresult = await listsessions(
                        {
                            authorization: {
                                username: loginForm.username,
                                password: loginForm.password,
                                type: "password",
                            },
                        },
                        new URL(urlserver).href,
                    );
                    const server = loginForm.server;
                    if (
                        sessionresult.username.length // &&
                        // sessionresult.sessions.length
                    ) {
                        ElMessage.success("登录成功:" + sessionresult.username);
                        loginstate.value = "登录成功:" + sessionresult.username;
                        loginstyle.value = "color:green";

                        if (sessionresult.sessions.length !== 0) {
                            const session = sessionresult.sessions[0].name;
                            localStorage.setItem("session", session);
                        }

                        localStorage.setItem("token", token.token);
                        localStorage.setItem("identifier", token.identifier);
                        localStorage.setItem("server", server);

                        await router.push(
                            new URL(location.href).searchParams.get(
                                "redirect",
                            ) ?? "/",
                        );
                        await updateOrAddIntoTableServerInfo({
                            server: loginForm.server,
                            username: loginForm.username,
                            token: loginresult.token.token,
                            session: sessionresult.sessions.map((a) => a.name),
                            type: "token",
                            identifier: loginresult.token.identifier,
                        });
                        console.log(sessionresult.sessions);

                        requestAnimationFrame(() => {
                            location.reload();
                        });
                        return;
                    }
                    throw new Error("登录失败,服务端没有session列表");
                } catch (error) {
                    console.log(error);
                    loginstyle.value = "color:red";
                    loginstate.value = "登录失败:" + String(error);
                    ElMessage.error("登录失败:" + String(error));
                } finally {
                    loading.value = false;
                }
            } else {
                console.log("error submit!");
                loginstyle.value = "color:red";
                loginstate.value = "表单验证失败";
                ElMessage.error("表单验证失败");
                return;
            }
        },
    );
};

const submitTokenForm = async (formEl: FormInstance | null) => {
    if (!formEl) return;
    await formEl.validate(
        async (isValid: boolean, invalidFields?: ValidateFieldsError) => {
            if (isValid) {
                console.log("submit token form!");
                loading.value = true;
                try {
                    const newLocalurl = new URL(tokenForm.server);
                    newLocalurl.hash = "";
                    tokenForm.server = newLocalurl.href;

                    const urlserver = tokenForm.server;
                    localStorage.setItem("server", tokenForm.server);
                    const sessionresult = await listsessions(
                        {
                            authorization: {
                                //username: tokenForm.username,
                                token: tokenForm.token,
                                type: "token",
                                identifier: tokenForm.identifier,
                            },
                        },
                        new URL(urlserver).href,
                    );
                    const server = tokenForm.server;
                    localStorage.setItem("username", sessionresult.username);
                    if (
                        sessionresult.username.length /*  &&
                        sessionresult.sessions.length */
                    ) {
                        ElMessage.success("登录成功:" + sessionresult.username);
                        loginstate.value = "登录成功:" + sessionresult.username;
                        loginstyle.value = "color:green";
                        // const session = sessionresult.sessions[0].name;
                        localStorage.setItem("token", tokenForm.token);
                        localStorage.setItem(
                            "identifier",
                            tokenForm.identifier,
                        );
                        localStorage.setItem("server", server);
                        if (sessionresult.sessions.length !== 0) {
                            const session = sessionresult.sessions[0].name;
                            localStorage.setItem("session", session);
                        }
                        // localStorage.setItem("session", session);
                        await router.push(
                            new URL(location.href).searchParams.get(
                                "redirect",
                            ) ?? "/",
                        );
                        await updateOrAddIntoTableServerInfo({
                            server: tokenForm.server,
                            username: sessionresult.username,
                            token: tokenForm.token,
                            session: sessionresult.sessions.map((a) => a.name),
                            type: "token",
                            identifier: tokenForm.identifier,
                        });
                        console.log(sessionresult.sessions);

                        requestAnimationFrame(() => {
                            location.reload();
                        });
                        ElMessage.success("令牌登录成功");
                        await router.push(
                            new URL(location.href).searchParams.get(
                                "redirect",
                            ) ?? "/",
                        );
                        return;
                    }
                    throw new Error("登录失败,服务端没有session列表");

                    // 这里需要实现令牌登录的逻辑
                    // const loginresult = await tokenLogin(...)
                    // ...
                } catch (error) {
                    console.log(error);
                    loginstyle.value = "color:red";
                    loginstate.value = "登录失败:" + String(error);
                    ElMessage.error("登录失败:" + String(error));
                } finally {
                    loading.value = false;
                }
            } else {
                console.log("error submit token form!");
                loginstyle.value = "color:red";
                loginstate.value = "表单验证失败";
                ElMessage.error("表单验证失败");
                return;
            }
        },
    );
};

const resetForm = (formEl: FormInstance | null) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>

<style scoped>
/* .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 50px); /* 修改：减去导航栏高度 */
/* background-color: #f0f2f5; */
/* }  */

.box-card {
    width: 480px;
}

.card-header {
    text-align: center;
}

/* 修改：添加导航栏样式 */
.nav-container {
    background-color: white;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* display: flex; */
    justify-content: center;
    align-items: center;
    height: calc(100% - 50px);
    /* 修改：减去导航栏高度 */
    /* background-color: #f0f2f5; */
}
</style>
<style>
.center-button {
    .el-form-item__content {
        display: flex;
        justify-content: center;
    }
}
</style>
