<template>
    <div style="width: 100%">
        <h1>用户管理</h1>
        <!-- 修改用户名和密码 -->
        <el-form
            ref="formRef"
            :model="userInfo"
            @submit.prevent="handleSubmit"
            :rules="rules"
        >
            <el-form-item
                label="用户名"
                prop="username"
                :rules="[
                    { required: true, message: '请输入用户名' },
                    { min: 4, message: '用户名长度至少为4位', trigger: 'blur' },
                ]"
            >
                <el-input v-model="userInfo.username" name="username" />
            </el-form-item>
            <el-form-item
                prop="password"
                label="密码"
                :rules="[
                    { required: true, message: '请输入密码' },
                    { min: 4, message: '用户名长度至少为4位', trigger: 'blur' },
                ]"
            >
                <el-input
                    v-model="userInfo.password"
                    type="password"
                    name="password"
                    show-password
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { type Router, useRouter } from "vue-router";
import { defineComponent, ref } from "vue";
import {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElMessage,
} from "element-plus";
import { modifyPassword } from "./modifyPassword.ts";
import { getAuth } from "./SessionDisplay.vue";
import type { FormRules } from "element-plus";

export default defineComponent({
    components: {
        "el-form": ElForm,
        "el-form-item": ElFormItem,
        "el-input": ElInput,
        "el-button": ElButton,
    },
    setup() {
        const formRef = ref();
        onMounted(async () => {
            const url = new URL(window.location.href);
            const username = url.searchParams.get("username");
            if (username) {
                userInfo.value.username = username;
            }
        });
        const router = useRouter();
        // 模拟用户信息
        const userInfo = ref({
            username: "",
            password: "",
        });

        // 处理表单提交
        const handleSubmit = async () => {
            // console.log(formRef.value
            // .validateFields)
            await formRef.value
                .validate()
                .then(async () => {
                    console.log("userInfo", userInfo.value);
                    if (!userInfo.value.username || !userInfo.value.password) {
                        ElMessage.error("请输入用户名和密码");
                        return;
                    }
                    try {
                        const authresult = await getAuth(router);
                        if (!authresult) {
                            return null;
                        }
                        const { baseurl, credentials } = authresult;
                        // 根据 go_ws_sh.openapi.json 实现创建用户的 API 调用
                        // const response = await axios.post("/api/users", userInfo.value);

                        const result = await modifyPassword(
                            {
                                ...credentials,

                                credential: {
                                    username: userInfo.value.username,
                                    password: userInfo.value.password,
                                },
                            },
                            baseurl,
                        );
                        console.log(result);
                        // 这里可以添加实际的修改逻辑
                        ElMessage.success("用户名和密码修改成功");
                        const url = new URL(window.location.href);
                        url.searchParams.set("tab", "displayUsers");

                        console.log(url);
                        // await router.push(url.href.slice(url.origin.length));//居然不管用
                        history.pushState(
                            null,
                            "",
                            url.href.slice(url.origin.length),
                        );
                        location.reload();
                    } catch (error) {
                        console.error("用户修改失败:", error);
                        ElMessage.error(
                            "用户修改失败" +
                                "\n" +
                                error +
                                "\n" +
                                String(error),
                        );
                    }
                })
                .catch((error: any) => {
                    console.log("error", error);
                    ElMessage.error(error);
                });
        };

        return {
            rules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "change",
                    },
                    {
                        min: 4,
                        message: "用户名长度至少为4位",
                        trigger: "change",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "change",
                    },
                    { min: 4, message: "密码长度至少为4位", trigger: "change" },
                ],
            } as FormRules,
            formRef,
            userInfo,
            // tokens,
            // columns,
            handleSubmit,
            // createToken,
            // deleteToken,
        };
    },
});
</script>

<style scoped>
h1,
h2,
h3 {
    margin-bottom: 16px;
}
</style>
