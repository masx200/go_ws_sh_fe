<template>
    <a-table
        :columns="columns"
        :data-source="tokens"
        :loading="loading"
        style="width: 100%"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-popconfirm
                    title="确定删除该令牌？"
                    @confirm="handleDeleteToken(record.id)"
                >
                    <a href="#">删除</a>
                </a-popconfirm>
            </template>
        </template>
    </a-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Table, Popconfirm } from "ant-design-vue";

interface Token {
    id: string;
    name: string;
    created_at: string;
}

export default defineComponent({
    components: {
        "a-popconfirm": Popconfirm,
        "a-table": Table,
    },
    data() {
        return {
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
