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
                    <el-input v-model="loginForm.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        autocomplete="off"
                        show-password
                    />
                </el-form-item>
                <el-form-item class="center-button">
                    <el-button type="primary" @click="submitForm(loginFormRef)"
                        >登录</el-button
                    >
                    <el-button @click="resetForm(loginFormRef)">重置</el-button>
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
import { useRouter } from "vue-router";
import type { ValidateFieldsError } from "async-validator";
import type { FormInstance } from "element-plus";
import { reactive, ref } from "vue";
import { login, savetoken } from "../src/login.ts";
const loginstate = ref("");
const loginstyle = ref("");
const loginFormRef = ref<FormInstance | null>(null);
const loginForm = reactive({
    username: "",
    password: "",
});
const router = useRouter();
const rules = reactive({
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
                // Here you would typically make an API call to log the user in.
                // For example:
                // loginApi(loginForm).then(response => {
                //   // Handle successful login
                // }).catch(error => {
                //   ElMessage.error(error.message || '登录失败')
                // })
                try {
                    const newLocal = await login({
                        username: loginForm.username,
                        password: loginForm.password,
                    });
                    console.log(newLocal);
                    loginstate.value = "登录成功";
                    loginstyle.value = "color:green";
                    savetoken(newLocal);
                    ElMessage.success("登录成功");
                    router.push(
                        new URL(location.href).searchParams.get("redirect") ??
                            "/"
                    );
                } catch (error) {
                    console.log(error);
                    loginstyle.value = "color:red";
                    loginstate.value = "登录失败:" + String(error);
                    ElMessage.error("登录失败:" + String(error));
                }
            } else {
                console.log("error submit!");
                loginstyle.value = "color:red";
                loginstate.value = "表单验证失败";
                ElMessage.error("表单验证失败");
                return;
            }
        }
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
