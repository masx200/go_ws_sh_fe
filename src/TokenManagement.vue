<template>
    <div style="width: 100%">
        <h1>令牌管理</h1>
        <a-form
            style="width: 100%"
            :model="formState"
            @finish="handleCreateToken"
        >
            <a-form-item
                label="令牌名称"
                name="name"
                :rules="[{ required: true }]"
            >
                <a-input
                    v-model:value="formState.name"
                    placeholder="请输入令牌名称"
                />
            </a-form-item>
            <a-button type="primary" html-type="submit">创建新令牌</a-button>
        </a-form>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Form, Input, Button, Table, Popconfirm } from "ant-design-vue";

interface Token {
    id: string;
    name: string;
    created_at: string;
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
            formState: { name: "" },
            tokens: [] as Token[],
            loading: false,
            columns: [
                { title: "令牌ID", dataIndex: "id" },
                { title: "名称", dataIndex: "name" },
                { title: "创建时间", dataIndex: "created_at" },
                { title: "操作", key: "action" },
            ] as const,
        };
    },
    mounted() {
        this.fetchTokens();
    },
    methods: {
        mockRequest(method: string, url: string, data?: any): Promise<any> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (
                        method === "GET" &&
                        url === "/oauth/personal-access-tokens"
                    ) {
                        resolve({ data: this.tokens });
                    } else if (
                        method === "POST" &&
                        url === "/oauth/personal-access-tokens"
                    ) {
                        const newToken = {
                            id: Date.now().toString(),
                            name: data.name,
                            created_at: new Date().toLocaleString(),
                        };
                        this.tokens.push(newToken);
                        resolve({ data: newToken });
                    } else if (method === "DELETE") {
                        resolve({ success: true });
                    }
                }, 0);
            });
        },
        async fetchTokens() {
            this.loading = true;
            try {
                const res = await this.mockRequest(
                    "GET",
                    "/oauth/personal-access-tokens",
                );
                this.tokens = res.data;
            } finally {
                this.loading = false;
            }
        },
        async handleCreateToken() {
            try {
                await this.mockRequest(
                    "POST",
                    "/oauth/personal-access-tokens",
                    this.formState,
                );
                this.formState.name = "";
                await this.fetchTokens();
            } catch (error) {
                console.error("创建令牌失败:", error);
            }
        },
        async handleDeleteToken(tokenId: string) {
            try {
                await this.mockRequest(
                    "DELETE",
                    `/oauth/personal-access-tokens/${tokenId}`,
                );
                this.tokens = this.tokens.filter((t) => t.id !== tokenId);
            } catch (error) {
                console.error("删除令牌失败:", error);
            }
        },
    },
});
</script>
