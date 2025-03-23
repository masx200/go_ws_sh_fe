<template>
    <a-table :columns="columns" :data-source="sessions" :loading="loading" style="width: 100%">
    </a-table>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Table } from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table/interface";

// 修改会话接口字段
interface Session {
    name: string;
    cmd: string;
    args: string;
    dir: string;
}

export default defineComponent({
    components: {
        "a-table": Table,
    },
    data() {
        return {
            sessions: [] as Session[],
            loading: false,
            // 修改表格列配置
            columns: [
                { title: "会话名称", dataIndex: "name" },
                { title: "命令", dataIndex: "cmd" },
                { title: "参数", dataIndex: "args" },
                { title: "目录", dataIndex: "dir" },
            ] as ColumnsType,
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
    },
});
</script>