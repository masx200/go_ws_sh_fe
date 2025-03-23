<template>
    <div>
        <h2>修改令牌描述</h2>
        <a-form :model="tokenInfo" @finish="handleUpdateTokenDescription">
            <a-form-item
                label="令牌标识"
                :rules="[{ required: true, message: '请输入令牌标识' }]"
            >
                <a-input v-model:value="tokenInfo.identifier"  />
            </a-form-item>
            <a-form-item
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

export default defineComponent({
    components: {
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-input": Input,
        "a-button": Button
    },
    setup() {
        const tokenInfo = ref({
            identifier: "",
            description: ""
        });

        const handleUpdateTokenDescription = async () => {
            try {
                // 调用 API 更新令牌描述
                // await api.updateTokenDescription(tokenInfo.value);
                console.log("令牌描述修改成功");
            } catch (error) {
                console.error("修改令牌描述失败:", error);
            }
        };

        return {
            tokenInfo,
            handleUpdateTokenDescription
        };
    }
});
</script>