<template>
    <a-table :columns="columns" :data-source="tokens" :loading="loading" style="width: 100%">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-popconfirm title="确定删除该令牌？" @confirm="handleDeleteToken(record.identifier)">
                    <a href="#">删除</a>
                </a-popconfirm>
                <a href="#" @click="handleChangeDescription(record.identifier)">修改描述</a>
            </template>
        </template>
    </a-table>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Table, Popconfirm } from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table/interface";

interface Token {
    identifier: string;
    username: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export default defineComponent({
    components: {
        "a-table": Table,
        "a-popconfirm": Popconfirm
    },
    data() {
        return {
            tokens: [] as Token[],
            loading: false,
            columns: [
                { title: "令牌标识", dataIndex: "identifier" },
                { title: "用户名称", dataIndex: "username" },
                { title: "描述", dataIndex: "description" },
                { title: "创建时间", dataIndex: "created_at" },
                { title: "修改时间", dataIndex: "updated_at" },
                { title: "操作", key: "action" }
            ] as ColumnsType
        };
    },
    mounted() {
        this.fetchTokens();
    },
    methods: {
        async fetchTokens() {
            this.loading = true;
            try {
                // 调用 API 获取令牌信息
                // const res = await api.getTokens();
                // this.tokens = res.data;
            } finally {
                this.loading = false;
            }
        },
        async handleDeleteToken(tokenId: string) {
            try {
                // 调用 API 删除令牌
                // await api.deleteToken(tokenId);
                this.tokens = this.tokens.filter((t) => t.identifier !== tokenId);
            } catch (error) {
                console.error("删除令牌失败:", error);
            }
        },
        async handleChangeDescription(tokenId: string) {
            // 实现修改描述逻辑
            console.log(`修改令牌 ${tokenId} 的描述`);
        }
    }
});
</script>
