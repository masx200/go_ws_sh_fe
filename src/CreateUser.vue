<template>
    <div>
        <h2>创建用户</h2>
        <a-form :model="userInfo" @finish="handleCreateUser">
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

                    { min: 4, message: '密码长度至少为4位', trigger: 'blur' },
                ]"
            >
                <a-input-password v-model:value="userInfo.password" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">创建</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Form, Input, InputPassword, Button, message } from "ant-design-vue";
import { getAuth } from "./SessionDisplay.vue";
import { createUser } from "./createUser";
// import axios from "axios";

export default defineComponent({
    components: {
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-input": Input,
        "a-input-password": InputPassword,
        "a-button": Button,
    },
    setup() {
        const router = useRouter();
        const userInfo = ref({
            username: "",
            password: "",
        });

        const handleCreateUser = async () => {
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

                const result = await createUser(
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
                message.success("用户创建成功");
            } catch (error) {
                console.error("用户创建失败:", error);
                message.error("用户创建失败"+"\n"+error+"\n"+String(error));
            }
        };

        return {
            userInfo,
            router,
            handleCreateUser,
        };
    },
});
</script>
