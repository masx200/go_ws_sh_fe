<template>
    <div style="width: 100%">
        <h1>令牌管理</h1>
        <a-form style="width: 100%" :model="formState" @finish="handleCreateToken">
            <a-form-item label="令牌用户" name="username" :rules="[{ required: true }]">
                <a-input v-model:value="formState.username" placeholder="请输入令牌用户" />
            </a-form-item>
            <a-form-item label="令牌描述" name="description" :rules="[{ required: true }]">
                <a-input v-model:value="formState.description" placeholder="请输入令牌描述" />
            </a-form-item>
            <a-button type="primary" html-type="submit">创建新令牌</a-button>
        </a-form>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Form, Input, Button, Table, Popconfirm } from "ant-design-vue";

interface Token {
    username: string;
    description: string;

}

export default defineComponent({
    components: {
        "a-popconfirm": Popconfirm,
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-input": Input,
        "a-button": Button,
        "a-table": Table,
    },
    data() {
        return {
            formState: { description: "", username: "" },
            tokens: [] as Token[],
            loading: false,
            columns: [
                { title: "令牌标识", dataIndex: "identifier" },
                { title: "用户", dataIndex: "username" },
                { title: "描述", dataIndex: "description" },
                { title: "操作", key: "action" },
            ] as const,
        };
    },

    methods: {
        mockRequest(method: string, url: string, data: Token): Promise<any> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (
                        method === "POST" &&
                        url === "/oauth/personal-access-tokens"
                    ) {
                        const newToken = {
                            description: data.description,
                            // id: Date.now().toString(),
                            username: data.username,
                            // created_at: new Date().toLocaleString(),
                        };
                        this.tokens.push(newToken);
                        resolve({ data: newToken });
                    }
                }, 0);
            });
        },

        async handleCreateToken() {
            try {
                await this.mockRequest(
                    "POST",
                    "/oauth/personal-access-tokens",
                    this.formState,
                );
                this.formState.username = "";
                this.formState.description = "";

            } catch (error) {
                console.error("创建令牌失败:", error);
            }
        },

    },
});
</script>
