<template>
    <el-table
        border
        table-layout="auto"
        :data="tokens"
        :loading="loading"
        style="width: 100%"
        :row-key="(record) => record.identifier"
    >
        <el-table-column
            v-for="col in columns"
            :key="col.prop || col.label"
            :prop="col.prop"
            :label="col.label"
        >
            <template v-if="col.key === 'delete'" #default="{ row: record }">
                <span>
                    <el-popconfirm
                        title="确定删除该令牌？"
                        @confirm="handleDeleteToken(record.identifier)"
                        ><template #reference>
                            <el-button type="text">删除</el-button></template
                        >
                    </el-popconfirm>
                </span>
            </template>
            <template v-if="col.key === 'modify'" #default="{ row: record }">
                <span>
                    <el-button
                        type="text"
                        @click="handleChangeDescription(record.identifier)"
                        >修改描述</el-button
                    >
                </span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import {
    ElButton,
    ElMessage,
    ElPopconfirm,
    ElTable,
    ElTableColumn,
} from "element-plus";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { deleteToken } from "./deleteToken";
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

interface TableColumnWithKey extends TableColumnCtx<Token> {
    key?: string;
}

export default defineComponent({
    setup() {
        const router = useRouter();
        return {
            router,
            tokens: ref([] as Token[]),
            loading: ref(false),
            columns: [
                { prop: "identifier", label: "令牌标识" },
                { prop: "username", label: "用户名称" },
                { prop: "description", label: "描述" },
                { prop: "created_at", label: "创建时间" },
                { prop: "updated_at", label: "修改时间" },
                { label: "修改操作", key: "modify" },
                { label: "删除操作", key: "delete" },
                // { label: "操作", key: "action" }
            ] as TableColumnWithKey[],
        };
    },
    components: {
        "el-table": ElTable,
        "el-table-column": ElTableColumn,
        "el-popconfirm": ElPopconfirm,
        "el-button": ElButton,
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
                ElMessage.error(
                    "获取会话列表失败" + "\n" + error + "\n" + String(error),
                );
            } finally {
                this.loading = false;
            }
        },
        async handleDeleteToken(identifier: string) {
            // 实现删除令牌逻辑
            console.log(`删除令牌: ${identifier}`);
            const { router } = this;
            try {
                const authresult = await getAuth(router);
                if (!authresult) {
                    return null;
                }
                const { baseurl, credentials } = authresult;

                console.log(
                    await deleteToken(credentials, baseurl, identifier),
                );
                ElMessage.success("令牌删除成功");
                this.fetchTokens(); // 刷新列表
            } catch (error) {
                console.error("删除令牌失败:", error);
                ElMessage.error("删除令牌失败: " + (error as Error).message);
            }
        },
        async handleChangeDescription(identifier: string) {
            // 实现修改描述逻辑
            console.log(`修改令牌 ${identifier} 的描述`);

            const url = new URL(window.location.href);
            url.searchParams.set("tab", "editTokenDescription");
            url.searchParams.set("identifier", identifier);
            console.log(url);
            // await router.push(url.href.slice(url.origin.length));//居然不管用
            history.pushState(null, "", url.href.slice(url.origin.length));
            location.reload();
        },
    },
});
</script>
