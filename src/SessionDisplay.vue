<template>
    <a-table :columns="columns" :data-source="sessions" :loading="loading" style="width: 100%">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-popconfirm title="确定删除该会话？" @confirm="handleDeleteSession(record.name)">
                    <a href="#">删除</a>
                </a-popconfirm>
                <a href="#" @click="handleChangeAttributes(record.name)">修改属性</a>
            </template>
        </template>
    </a-table>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Table, Popconfirm } from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table/interface";

interface Session {
    // id: string;
    name: string;
    cmd: string;
    args: string;
    dir: string;
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
            sessions: [] as Session[],
            loading: false,
            columns: [
                { title: "会话名称", dataIndex: "name" },
                { title: "命令", dataIndex: "cmd" },
                { title: "参数", dataIndex: "args" },
                { title: "目录", dataIndex: "dir" },
                { title: "创建时间", dataIndex: "created_at" },
                { title: "修改时间", dataIndex: "updated_at" },
                { title: "操作", key: "action" }
            ] as ColumnsType
        };
    },
    mounted() {
        this.fetchSessions();
    },
    methods: {
        async fetchSessions() {
            this.loading = true;
            try {
                // 调用 API 获取会话信息
                // const res = await api.getSessions();
                // this.sessions = res.data;
            } finally {
                this.loading = false;
            }
        },
        async handleDeleteSession(sessionId: string) {
            try {
                // 调用 API 删除会话
                // await api.deleteSession(sessionId);
                this.sessions = this.sessions.filter((s) => s.name !== sessionId);
            } catch (error) {
                console.error("删除会话失败:", error);
            }
        },
        async handleChangeAttributes(sessionId: string) {
            // 实现修改属性逻辑
            console.log(`修改会话 ${sessionId} 的属性`);
        }
    }
});
</script>