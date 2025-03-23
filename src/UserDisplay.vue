<template>
    <a-table :columns="columns" :data-source="users" :loading="loading" style="width: 100%">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-popconfirm title="确定删除该用户？" @confirm="handleDeleteUser(record.username)">
                    <a href="#">删除</a>
                </a-popconfirm>
                <a href="#" @click="handleChangePassword(record.username)">修改密码</a>
            </template>
        </template>
    </a-table>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Table, Popconfirm } from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table/interface";

interface User {
    created_at: string;
    updated_at: string;
    username: string;
    // 其他字段...
}

export default defineComponent({
    components: {
        "a-table": Table,
        "a-popconfirm": Popconfirm
    },
    data() {
        return {
            users: [] as User[],
            loading: false,
            columns: [
                { title: "用户名", dataIndex: "username" },
                { title: "创建时间", dataIndex: "created_at" },
                { title: "修改时间", dataIndex: "updated_at" },
                { title: "操作", key: "action" }
            ] as ColumnsType
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
        async handleDeleteUser(userId: string) {
            try {
                // 调用 API 删除用户
                // await api.deleteUser(userId);
                this.users = this.users.filter((u) => u.username !== userId);
            } catch (error) {
                console.error("删除用户失败:", error);
            }
        },
        async handleChangePassword(userId: string) {
            // 实现修改密码逻辑
            console.log(`修改用户 ${userId} 的密码`);
        }
    }
});
</script>