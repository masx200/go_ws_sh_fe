<template>
    <div>
        <h2>修改会话属性</h2>
        <a-form
            :model="sessionInfo"
            ref="formRef"
            :rules="rules"
            @finish="handleUpdateSessionAttributes"
        >
            <!-- <a-form-item
                label="会话 ID"
                :rules="[{ required: true, message: '请输入会话 ID' }]"
            >
                <a-input v-model:value="sessionInfo.id" disabled />
            </a-form-item> -->
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
                <a-button type="primary" html-type="submit">修改</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Form, Input, Button } from "ant-design-vue";

export default defineComponent({
    components: {
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-input": Input,
        "a-button": Button,
    },
    setup() {
        const sessionInfo = ref({
            // id: "",
            name: "",
            cmd: "",
            args: "",
            dir: "",
        });

        const handleUpdateSessionAttributes = async () => {
            try {
                // 调用 API 更新会话属性
                // await api.updateSessionAttributes(sessionInfo.value);
                console.log("会话属性修改成功");
            } catch (error) {
                console.error("修改会话属性失败:", error);
            }
        };

        return {
            sessionInfo,
            handleUpdateSessionAttributes,
        };
    },
});
</script>
