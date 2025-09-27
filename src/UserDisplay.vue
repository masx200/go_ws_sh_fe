<template>
    <el-table
        :data="users"
        :loading="loading"
        style="width: 100%"
        :row-key="(record) => record.username"
    >
        <template #default="{ column, record }">
            <template v-if="column.key === 'delete'">
                <span>
                    <el-popconfirm
                        title="确定删除该用户？"
                        @confirm="handleDeleteUser(record.username)"
                    >
                        <el-button type="text">删除</el-button>
                    </el-popconfirm></span
                >
            </template>
            <template v-if="column.key === 'modify'">
                <span>
                    <el-button type="text" @click="handleChangePassword(record.username)"
                        >修改密码</el-button
                    ></span
                >
            </template>
        </template>
    </el-table>
</template>

<script lang="ts">
import { ElPopconfirm, ElTable, ElButton, ElMessage } from "element-plus";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { listcredentials } from "./listcredentials.ts";
import { getAuth } from "./SessionDisplay.vue";
import { deleteUser } from "./deleteUser";

interface User {
    username: string;
    // password: string;
    updated_at: string;
    created_at: string;
}

export default defineComponent({
    setup() {
        const router = useRouter();
        return {
            router,
            users: ref([] as User[]),
            loading: ref(false),
            columns: [
                { prop: "username", label: "用户名" },
                { prop: "created_at", label: "创建时间" },
                { prop: "updated_at", label: "修改时间" },
                { label: "修改操作", key: "modify" },
                { label: "删除操作", key: "delete" },
                // { label: "操作", key: "action" }
            ] as TableColumnCtx<User>[],
        };
    },
    components: {
        "el-table": ElTable,
        "el-popconfirm": ElPopconfirm,
        "el-button": ElButton,
    },

    mounted() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            this.loading = true;
            try {
                const { router } = this;
                const authresult = await getAuth(router);
                if (!authresult) {
                    return null;
                }
                const { baseurl, credentials } = authresult;
                const result = await listcredentials(credentials, baseurl);
                this.users = result.credentials;
            } catch (error) {
                console.error("获取用户列表失败:", error);
                ElMessage.error(
                    "获取会话列表失败" + "\n" + error + "\n" + String(error),
                );
            } finally {
                this.loading = false;
            }
        },
        async handleDeleteUser(username: string) {
            console.log(`删除用户: ${username}`);
            const { router } = this;
            const authresult = await getAuth(router);
            if (!authresult) {
                return null;
            }
            const { baseurl, credentials } = authresult;
            try {
                const result = await deleteUser(
                    {
                        ...credentials,

                        credential: {
                            username: username,
                        },
                    },
                    baseurl,
                );
                console.log("User deleted successfully:", result);
                ElMessage.success("用户删除成功");
                console.log(`删除用户: ${username}`);

                // location.reload();
                await this.fetchUsers();
            } catch (error) {
                console.error("User deletion failed:", error);
                ElMessage.error(
                    "用户删除失败" + "\n" + error + "\n" + String(error),
                );
            }
            // 实现删除用户逻辑
        },
        async handleChangePassword(username: string) {
            // const { router } = this;
            // 实现修改密码逻辑
            console.log(`修改用户 ${username} 的密码`);

            const url = new URL(window.location.href);
            url.searchParams.set("tab", "changepassword");
            url.searchParams.set("username", username);
            console.log(url);
            // await router.push(url.href.slice(url.origin.length));//居然不管用
            history.pushState(null, "", url.href.slice(url.origin.length));
            location.reload();
        },
    },
});
</script>
