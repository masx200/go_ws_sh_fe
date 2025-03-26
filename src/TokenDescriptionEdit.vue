<template>
    <div>
        <h2>修改令牌描述</h2>
        <a-form
            :model="tokenInfo"
            ref="formRef"
            :rules="rules"
            @finish="handleUpdateTokenDescription"
        >
            <a-form-item
                name="identifier"
                label="令牌标识"
                :rules="[{ required: true, message: '请输入令牌标识' }]"
            >
                <a-input v-model:value="tokenInfo.identifier" />
            </a-form-item>
            <a-form-item
                name="description"
                label="新描述"
                :rules="[{ required: true, message: '请输入新的描述' }]"
            >
                <a-input v-model:value="tokenInfo.description" />
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
import type { Rule } from "ant-design-vue/es/form/interface";

export default defineComponent({
    components: {
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-input": Input,
        "a-button": Button,
    },
    setup() {
        const formRef = ref();
        const tokenInfo = ref({
            identifier: "",
            description: "",
        });

        const handleUpdateTokenDescription = async () => {
            await formRef.value.validateFields();
            try {
                // 调用 API 更新令牌描述
                // await api.updateTokenDescription(tokenInfo.value);
                console.log("令牌描述修改成功");
            } catch (error) {
                console.error("修改令牌描述失败:", error);
            }
        };

        return {
            formRef,
            tokenInfo,
            handleUpdateTokenDescription,
            rules: {
                identifier: [
                    {
                        required: true,
                        message: "请输入令牌标识",
                        trigger: "blur",
                    },
                    {
                        pattern: /^[a-zA-Z0-9\-_]+$/,
                        message: "令牌标识只能包含字母、数字、下划线或短横线",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        message: "请输入新的描述",
                        trigger: "blur",
                    },
                    {
                        min: 5,
                        max: 100,
                        message: "描述长度应在 5 到 100 个字符之间",
                        trigger: "blur",
                    },
                ],
            } as Record<string, Rule[]>,
        };
    },
});
</script>
