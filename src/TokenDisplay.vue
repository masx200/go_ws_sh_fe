<template>
    <a-table :columns="columns" :data-source="tokens" :loading="loading" style="width: 100%">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-popconfirm title="确定删除该令牌？" @confirm="handleDeleteToken(record.identifier, record.username)">
                    <a href="#">删除</a>
                </a-popconfirm>
            </template>
        </template>
    </a-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Table, Popconfirm } from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table/interface";

interface Token {
    identifier: string;
    username: string;
    description: string;
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
                { title: "令牌标识", dataIndex: "identifier" },
                { title: "用户名称", dataIndex: "username" },
                { title: "描述", dataIndex: "description" },

                { title: "操作", key: "action" },
            ] as ColumnsType,
        };
    },
    mounted() {
        this.fetchTokens();
    },
    methods: {
        mockRequestGet(method: string, url: string,): Promise<any> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (
                        method === "GET" &&
                        url === "/oauth/personal-access-tokens"
                    ) {
                        resolve({ data: this.tokens });
                    }
                }, 0);
            });
        },
        mockRequestDelete(method: string, url: string, data:Pick< Token,"identifier"|"username">): Promise<any> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(method, url, data)
                    resolve({ success: true });

                }, 0);
            });
        },
        async fetchTokens() {
            this.loading = true;
            try {
                const res = await this.mockRequestGet(
                    "GET",
                    "/oauth/personal-access-tokens",
                );
                this.tokens = res.data;
            } finally {
                this.loading = false;
            }
        },
        async handleDeleteToken(tokenId: string, username: string) {
            try {
                await this.mockRequestDelete(
                    "DELETE",
                    `/oauth/personal-access-tokens/${tokenId}`,
                    {
                        identifier: tokenId,

                        username: username
                    },
                );
                this.tokens = this.tokens.filter((t) => t.identifier !== tokenId);
            } catch (error) {
                console.error("删除令牌失败:", error);
            }
        },
    },
});
</script>
