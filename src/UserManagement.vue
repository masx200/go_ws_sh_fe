<template>
    <div style="width: 100%">
        <h1>用户管理</h1>
        <!-- 修改用户名和密码 -->
        <a-form
            ref="formRef"
            :model="userInfo"
            @finish="handleSubmit"
            :rules="rules"
        >
            <a-form-item
                label="用户名"
                name="username"
                :rules="[
                    { required: true, message: '请输入用户名' },
                    { min: 4, message: '用户名长度至少为4位', trigger: 'blur' },
                ]"
            >
                <a-input v-model:value="userInfo.username" />
            </a-form-item>
            <a-form-item
                name="password"
                label="密码"
                :rules="[
                    { required: true, message: '请输入密码' },
                    { min: 4, message: '用户名长度至少为4位', trigger: 'blur' },
                ]"
            >
                <a-input-password v-model:value="userInfo.password" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">修改</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
    Form,
    Input,
    InputPassword,
    Button,
    Table,
    message,
} from "ant-design-vue";
import { modifyPassword } from "./modifyPassword.ts";
import { getAuth } from "./SessionDisplay.vue";
import type { Rule } from "ant-design-vue/es/form/interface";

export default defineComponent({
    components: {
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-input": Input,
        "a-input-password": InputPassword,
        "a-button": Button,
        "a-table": Table,
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
            await formRef.value
                .validate()
                .then(async () => {
                    console.log("userInfo", userInfo.value);
                    if (!userInfo.value.username || !userInfo.value.password) {
                        message.error("请输入用户名和密码");
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
                        message.success("用户名和密码修改成功");
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
                        console.error("用户创建失败:", error);
                        message.error(
                            "用户创建失败" +
                                "\n" +
                                error +
                                "\n" +
                                String(error),
                        );
                    }
                })
                .catch((error: any) => {
                    console.log("error", error);
                    message.error(error);
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
            } as Record<string, Rule[]>,
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
