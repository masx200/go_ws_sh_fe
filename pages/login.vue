<template>
    <div class="login-container">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>登录</span>
                </div>
            </template>
            <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="auto" class="demo-ruleForm">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="loginForm.username" autocomplete="on" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" autocomplete="on" show-password />
                </el-form-item>
                <el-form-item label="网址" prop="server">
                    <el-input v-model="loginForm.server" autocomplete="on" />
                </el-form-item>
                <el-form-item class="center-button">
                    <el-button size="large" :loading="loading" type="primary"
                        @click="submitForm(loginFormRef)">登录</el-button>
                    <el-button size="large" @click="resetForm(loginFormRef)">重置</el-button>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="card-header">
                    <span :style="loginstyle">{{ loginstate }}</span>
                </div>
            </template>
        </el-card>
    </div>
</template>

<script setup lang="ts">
const loading = ref(false);
import type { ValidateFieldsError } from "async-validator";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { listsessions } from "~/src/list";
import { updateOrAddIntoTableServerInfo } from "~/src/ServerConnectionInfo";
import { login, savetoken } from "../src/login.ts";
const loginstate = ref("");
const loginstyle = ref("");
const loginFormRef = ref<FormInstance | null>(null);
const loginForm = reactive({
    username: "",
    password: "",
    server: "",
});
const router = useRouter();
const rules = reactive<FormRules<typeof loginForm>>({
    server: [
        { required: true, message: "请输入网址", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                try {
                    const url = new URL(value);
                    if (url.protocol == "http:" || url.protocol == "https:") {
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
        { min: 4, max: 36, message: "长度在 4 到 36 个字符", trigger: "blur" },
    ],
});
const submitForm = (formEl: FormInstance | null) => {
    if (!formEl) return;
    formEl.validate(
        async (isValid: boolean, invalidFields?: ValidateFieldsError) => {
            if (isValid) {
                console.log("submit!");
                loading.value = true;
                // Here you would typically make an API call to log the user in.
                // For example:
                // loginApi(loginForm).then(response => {
                //   // Handle successful login
                // }).catch(error => {
                //   ElMessage.error(error.message || '登录失败')
                // })
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
                        new URL("/sessions", urlserver).href,
                    );
                    const server = loginForm.server;
                    if (sessionresult.username.length) {
                        ElMessage.success("登录成功:" + sessionresult.username);
                        loginstate.value = "登录成功:" + sessionresult.username;
                        loginstyle.value = "color:green";
                        const session = sessionresult.sessions[0].name;
                        localStorage.setItem("token", token.token);
                        localStorage.setItem("identifier", token.identifier);
                        localStorage.setItem("server", server);
                        localStorage.setItem("session", session);
                        await router.push(
                            new URL(location.href).searchParams.get(
                                "redirect",
                            ) ?? "/",
                        );
                        await updateOrAddIntoTableServerInfo({
                            server: loginForm.server,
                            username: loginForm.username,
                            token: loginresult.token.token,
                            session: sessionresult.sessions.map(a=>a.name),
                            type: "token",
                            identifier: loginresult.token.identifier,
                        });
                        console.log(sessionresult.sessions);

                        requestAnimationFrame(() => {
                            location.reload();
                        });
                        return; //newLocal_1.list;
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

const resetForm = (formEl: FormInstance | null) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #f0f2f5;
}

.box-card {
    width: 480px;
}

.card-header {
    text-align: center;
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
