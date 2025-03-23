<template>
    <div>
        <h2>创建用户</h2>
        <a-form :model="userInfo" @finish="handleCreateUser">
            <a-form-item
                label="用户名"
                :rules="[{ required: true, message: '请输入用户名' }]"
            >
                <a-input v-model:value="userInfo.username" />
            </a-form-item>
            <a-form-item
                label="密码"
                :rules="[{ required: true, message: '请输入密码' }]"
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
        const userInfo = ref({
            username: "",
            password: "",
        });

        const handleCreateUser = async () => {
            try {
                // 根据 go_ws_sh.openapi.json 实现创建用户的 API 调用
                // const response = await axios.post("/api/users", userInfo.value);
                message.success("用户创建成功");
            } catch (error) {
                console.error("用户创建失败:", error);
                message.error("用户创建失败");
            }
        };

        return {
            userInfo,
            handleCreateUser,
        };
    },
});
</script>