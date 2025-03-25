<template>
    <div style="width: 100%">
        <h1>用户管理</h1>
        <!-- 修改用户名和密码 -->
        <a-form :model="userInfo" @finish="handleSubmit">
            <a-form-item
                label="用户名"
                :rules="[
                    { required: true, message: '请输入用户名' },
                    { min: 4, message: '用户名长度至少为4位', trigger: 'blur' },
                ]"
            >
                <a-input v-model:value="userInfo.username" />
            </a-form-item>
            <a-form-item
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

        // // 模拟令牌列表
        // const tokens = ref([
        //     { id: 1, token: "token123" },
        //     { id: 2, token: "token456" },
        // ]);

        // 表格列配置
        // const columns = [
        //     {
        //         title: "ID",
        //         dataIndex: "id",
        //         key: "id",
        //     },
        //     {
        //         title: "令牌",
        //         dataIndex: "token",
        //         key: "token",
        //     },
        //     {
        //         title: "操作",
        //         dataIndex: "actions",
        //         key: "actions",
        //     },
        // ];

        // 处理表单提交
        const handleSubmit = async () => {
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
                history.pushState(null, "", url.href.slice(url.origin.length));
                location.reload();
            } catch (error) {
                console.error("用户创建失败:", error);
                message.error(
                    "用户创建失败" + "\n" + error + "\n" + String(error),
                );
            }
        };

        // 创建令牌
        // const createToken = () => {
        //     // 这里可以添加实际的创建逻辑
        //     const newToken = {
        //         id: tokens.value.length + 1,
        //         token: `token${tokens.value.length + 1}`,
        //     };
        //     tokens.value.push(newToken);
        //     message.success("令牌创建成功");
        // };

        // 删除令牌
        // const deleteToken = (id: number) => {
        //     // 这里可以添加实际的删除逻辑
        //     tokens.value = tokens.value.filter((token) => token.id !== id);
        //     message.success("令牌删除成功");
        // };

        return {
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
