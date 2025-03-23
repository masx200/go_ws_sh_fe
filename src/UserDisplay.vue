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
import type{ listCredentialsInterface,  } from "./listtokens.ts";
import { listcredentials } from "./listcredentials.ts";
import { defineComponent, ref } from "vue";
import { Table, Popconfirm } from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table/interface";


interface User {
    username: string;
    // password: string;
    updated_at: string;
    created_at: string;
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
                { title: "修改操作", key: "modify" },
                { title: "删除操作", key: "delete" },
                // { title: "操作", key: "action" }
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
                const credentials: listCredentialsInterface = {
                    authorization: {
                        username: "your_username",
                        token: "your_token",
                        type: "token"
                    }
                };
                const result = await listcredentials(credentials);
                this.users = result.credentials;
            } catch (error) {
                console.error("获取用户列表失败:", error);
            } finally {
                this.loading = false;
            }
        },
        async handleDeleteUser(username: string) {
            // 实现删除用户逻辑
            console.log(`删除用户: ${username}`);
        },
        async handleChangePassword(username: string) {
            // 实现修改密码逻辑
            console.log(`修改用户 ${username} 的密码`);
        }
    }
});
</script>