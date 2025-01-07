<template>
    <div class="login-container">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>登录</span>
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
                    <el-input v-model="loginForm.username" autocomplete="on" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        autocomplete="on"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="网址" prop="url">
                    <el-input v-model="loginForm.url" autocomplete="on" />
                </el-form-item>
                <el-form-item class="center-button">
                    <el-button
                        size="large"
                        :loading="loading"
                        type="primary"
                        @click="submitForm(loginFormRef)"
                        >登录</el-button
                    >
                    <el-button size="large" @click="resetForm(loginFormRef)"
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
    </div>
</template>

<script setup lang="ts">
const loading = ref(false);
import type { ValidateFieldsError } from "async-validator";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login, savetoken } from "../src/login.ts";
const loginstate = ref("");
const loginstyle = ref("");
const loginFormRef = ref<FormInstance | null>(null);
const loginForm = reactive({
    username: "",
    password: "",
    url: "",
});
const router = useRouter();
const rules = reactive<FormRules<typeof loginForm>>({
    url: [
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
        { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 4, max: 20, message: "长度在 4 到 20 个字符", trigger: "blur" },
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
                    const newLocal = await login(
                        {
                            username: loginForm.username,
                            password: loginForm.password,
                        },
                        new URL("/login", loginForm.url).href,
                    );
                    console.log(newLocal);
                    localStorage.setItem("url", loginForm.url);
                    loginstate.value = "登录成功:" + loginForm.username;
                    loginstyle.value = "color:green";
                    savetoken(newLocal);
                    ElMessage.success("登录成功:" + loginForm.username);
                    router.push(
                        new URL(location.href).searchParams.get("redirect") ??
                            "/",
                    );
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
