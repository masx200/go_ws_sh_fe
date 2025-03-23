<template>
    <div>
        <h2>创建会话</h2>
        <a-form :model="sessionInfo" @finish="handleCreateSession">
            <a-form-item
                label="会话名称"
                :rules="[{ required: true, message: '请输入会话名称' }]"
            >
                <a-input v-model:value="sessionInfo.name" />
            </a-form-item>
            <a-form-item
                label="命令"
                :rules="[{ required: true, message: '请输入命令' }]"
            >
                <a-input v-model:value="sessionInfo.cmd" />
            </a-form-item>
            <a-form-item
                label="参数"
                :rules="[{ required: true, message: '请输入参数' }]"
            >
                <a-input v-model:value="sessionInfo.args" />
            </a-form-item>
            <a-form-item
                label="目录"
                :rules="[{ required: true, message: '请输入目录' }]"
            >
                <a-input v-model:value="sessionInfo.dir" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">创建</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Form, Input, Button, message } from "ant-design-vue";
// import axios from "axios";

export default defineComponent({
    components: {
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-input": Input,
        "a-button": Button,
    },
    setup() {
        const sessionInfo = ref({
            name: "",
            cmd: "",
            args: "",
            dir: "",
        });

        const handleCreateSession = async () => {
            try {
                // 根据 go_ws_sh.openapi.json 实现创建会话的 API 调用
                // const response = await axios.post("/api/sessions", sessionInfo.value);
                message.success("会话创建成功");
            } catch (error) {
                console.error("会话创建失败:", error);
                message.error("会话创建失败");
            }
        };

        return {
            sessionInfo,
            handleCreateSession,
        };
    },
});
</script>