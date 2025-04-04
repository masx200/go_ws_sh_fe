<template>
    <a-table
        :columns="columns"
        :data-source="sessions"
        :loading="loading"
        style="width: 100%"
        :row-key="(record) => record.name"
    >
        <!-- <template slot="args" slot-scope="args">
            <ul style="list-style: none; padding: 0; margin: 0">
                <li v-for="(arg, index) in args" :key="index">
                    <a-tag color="blue">{{ arg }}</a-tag>
                    <!-- 使用 Ant Design 的 Tag 组件 -->
        <!-- </li> -->
        <!-- </ul> -->
        <!-- </template> -->
        <template #bodyCell="{ column, record, text, value, index }">
            <template v-if="column.key === 'args'">
                <ul
                    style="
                        display: flex;
                        list-style: none;
                        padding: 0px;
                        margin: 0px;
                        flex-direction: column;
                        align-content: center;
                        justify-content: center;
                        align-items: center;
                        flex-wrap: wrap;
                    "
                >
                    <li
                        v-for="(arg, index) in JSON.parse(record.args)"
                        :key="index"
                    >
                        <a-tag color="blue">{{ arg }}</a-tag>
                    </li>
                </ul>
            </template>
            <template v-if="column.key === 'delete'">
                <span>
                    <a-popconfirm
                        title="确定删除该会话？"
                        @confirm="handleDeleteSession(record.name)"
                    >
                        <a href="#">删除</a>
                    </a-popconfirm></span
                >
            </template>
            <template v-if="column.key === 'modify'">
                <span>
                    <a href="#" @click="handleChangeAttributes(record.name)"
                        >修改属性</a
                    ></span
                >
            </template>
        </template>
    </a-table>
</template>

<script lang="ts">
import { type Router, useRouter } from "vue-router";
import { Popconfirm, Table, Tag, message } from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table/interface";
import { defineComponent } from "vue";
import { fetchServerInfoServer } from "~/src/ServerConnectionInfo.ts";
import { listsessions, type listResults } from "./listsessions.ts"; // 引入 listsessions 函数
import { routepushEditSessions } from "./routepush";
import { deletesession } from "./deletesession";

export async function getAuth(router: Router): Promise<{
    baseurl: string;
    credentials: {
        authorization: {
            username: string;
            token?: string;
            type: string;
            identifier?: string;
        };
    };
} | null> {
    const urlserver = new URL(location.href).searchParams.get("server");
    const conninfo = (await fetchServerInfoServer(urlserver || ""))
        .serverinfo?.[0];
    const token = urlserver ? conninfo.token : localStorage?.getItem("token");
    if (!token || !urlserver) {
        await router.push("/");
        return null;
    }

    return {
        baseurl: new URL(urlserver).href,
        credentials: {
            authorization: {
                username: conninfo.username,
                token: token,
                type: "token",
                identifier: conninfo.identifier,
            },
        },
    };
}
export async function getSessions(router: Router): Promise<listResults | null> {
    const authresult = await getAuth(router);
    if (!authresult) {
        return null;
    }
    const { baseurl, credentials } = authresult;
    const result = await listsessions(credentials, baseurl);
    return result;
}
interface Session {
    name: string;
    cmd: string;
    args: string;
    dir: string;
    created_at: string;
    updated_at: string;
}

export default defineComponent({
    setup() {
        const router = useRouter();
        return {
            router,
            sessions: ref([] as Session[]),
            loading: ref(false),
            columns: [
                { title: "会话名称", dataIndex: "name" },
                { title: "命令", dataIndex: "cmd" },
                {
                    title: "参数",
                    dataIndex: "args",
                    key: "args",
                },
                { title: "目录", dataIndex: "dir" },
                { title: "创建时间", dataIndex: "created_at" },
                { title: "修改时间", dataIndex: "updated_at" },
                { title: "修改操作", key: "modify" },
                { title: "删除操作", key: "delete" },
            ] as ColumnsType,
        };
    },
    components: {
        "a-tag": Tag,
        "a-table": Table,
        "a-popconfirm": Popconfirm,
    },

    mounted() {
        this.fetchSessions();
    },
    methods: {
        async fetchSessions() {
            const { router } = this;
            this.loading = true;
            try {
                const result = await getSessions(router);
                if (!result) {
                    return;
                }
                // 调用 API 获取会话列表
                // const response = await api.getSessions();
                // this.sessions = response.data;
                this.sessions = result.sessions.map((session) => ({
                    ...session,
                    args: JSON.stringify(session.args), //.join(" ")
                }));
            } catch (error) {
                console.error("获取会话列表失败:", error);
                message.error(
                    "获取会话列表失败" + "\n" + error + "\n" + String(error),
                );
            } finally {
                this.loading = false;
            }
        },
        async handleDeleteSession(sessionname: string) {
            const { router } = this;
            this.loading = true;
            try {
                const authresult = await getAuth(router);
                if (!authresult) {
                    return null;
                }
                const { baseurl, credentials } = authresult;

                const result = await deletesession(
                    {
                        authorization: credentials.authorization,
                        session: {
                            name: sessionname,
                        },
                    },
                    baseurl,
                );
                if (!result) {
                    return;
                }
                // 调用 API 获取会话列表
                // const response = await api.getSessions();
                // this.sessions = response.data;

                message.success("会话删除成功");
                await this.fetchSessions();
            } catch (error) {
                console.error("删除会话失败:", error);
                message.error(
                    "删除会话列表失败" + "\n" + error + "\n" + String(error),
                );
            } finally {
                this.loading = false;
            }
            // 调用 API 删除会话
            // await api.deleteSession(sessionId);
            //this.sessions = this.sessions.filter((s) => s.id !== sessionId);
        },
        async handleChangeAttributes(sessionname: string) {
            // 实现修改属性逻辑
            console.log(`修改会话 ${sessionname} 的属性`);
            routepushEditSessions(sessionname);
        },
    },
});
</script>
