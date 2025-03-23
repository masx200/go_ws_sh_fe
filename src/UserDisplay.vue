<template>
    <a-table :columns="columns" :data-source="users" :loading="loading" style="width: 100%">
    </a-table>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Table } from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table/interface";

interface User {
    // 根据 openapi 定义的用户字段
    id: string;
    username: string;
    // 其他字段...
}

export default defineComponent({
    components: {
        "a-table": Table,
    },
    data() {
        return {
            users: [] as User[],
            loading: false,
            columns: [
                
                { title: "用户名", dataIndex: "username" },
                { title: "创建时间", dataIndex: "created_at" },
                { title: "修改时间", dataIndex: "updated_at" },
                // 其他列...
            ] as ColumnsType,
        };
    },
    mounted() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            this.loading = true;
            try {
                // 调用 API 获取用户信息
                // const res = await api.getUsers();
                // this.users = res.data;
            } finally {
                this.loading = false;
            }
        },
    },
});
</script>