<template>
    <a-table
        :columns="columns"
        :data-source="tokens"
        :loading="loading"
        style="width: 100%"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'delete'">
                <span>
                    <a-popconfirm
                        title="确定删除该令牌？"
                        @confirm="handleDeleteToken(record.identifier)"
                    >
                        <a href="#">删除</a>
                    </a-popconfirm></span
                >
            </template>
            <template v-if="column.key === 'modify'">
                <span>
                    <a
                        href="#"
                        @click="handleChangeDescription(record.identifier)"
                        >修改描述</a
                    ></span
                >
            </template>
        </template>
    </a-table>
</template>

<script lang="ts">
import { Popconfirm, Table, message } from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table/interface";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { listtokens } from "./listtokens";
import { getAuth } from "./SessionDisplay.vue";

interface Token {
    description: string;
    username: string;
    identifier: string;
    // token: string;
    updated_at: string;
    created_at: string;
}

export default defineComponent({
    setup() {
        const router = useRouter();
        return {
            router,
            tokens: ref([] as Token[]),
            loading: ref(false),
            columns: [
                { title: "令牌标识", dataIndex: "identifier" },
                { title: "用户名称", dataIndex: "username" },
                { title: "描述", dataIndex: "description" },
                { title: "创建时间", dataIndex: "created_at" },
                { title: "修改时间", dataIndex: "updated_at" },
                { title: "修改操作", key: "modify" },
                { title: "删除操作", key: "delete" },
                // { title: "操作", key: "action" }
            ] as ColumnsType,
        };
    },
    components: {
        "a-table": Table,
        "a-popconfirm": Popconfirm,
    },

    mounted() {
        this.fetchTokens();
    },
    methods: {
        async fetchTokens() {
            this.loading = true;
            const { router } = this;
            try {
                const authresult = await getAuth(router);
                if (!authresult) {
                    return null;
                }
                const { baseurl, credentials } = authresult;
                const result = await listtokens(credentials, baseurl);
                this.tokens = result.tokens;
            } catch (error) {
                console.error("获取令牌列表失败:", error);
                message.error("获取会话列表失败"+"\n"+error+"\n"+String(error))
            } finally {
                this.loading = false;
            }
        },
        async handleDeleteToken(identifier: string) {
            // 实现删除令牌逻辑
            console.log(`删除令牌: ${identifier}`);
        },
        async handleChangeDescription(identifier: string) {
            // 实现修改描述逻辑
            console.log(`修改令牌 ${identifier} 的描述`);
        },
    },
});</script>
