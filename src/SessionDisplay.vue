<template>
    <a-table
        :columns="columns"
        :data-source="sessions"
        :loading="loading"
        style="width: 100%"
        :row-key="(record) => record.name"
    >
        <template #bodyCell="{ column, record, text, value, index }">
            <template v-if="column.key === 'copy'">
                <span>
                    <a href="#" @click="handleCopyAttributes(record.name)"
                        >复制</a
                    ></span
                >
            </template>
            <template v-if="column.key === 'move'">
                <span>
                    <a href="#" @click="handleMoveAttributes(record.name)"
                        >移动</a
                    ></span
                >
            </template>
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
                        >修改</a
                    ></span
                >
            </template>
        </template>
    </a-table>
    <a-modal
        :maskClosable="false"
        v-model:open="visible"
        title="复制会话"
        @ok="handleCopy"
        @cancel="handleCancel"
        cancelText="取消"
        okText="确定"
    >
        <a-col
            flex="auto"
            style="
                display: flex;
                flex-direction: column;
                align-content: center;
                justify-content: center;
                align-items: center;
            "
        >
            <p><strong>新的会话名称</strong></p>
            <a-input
                v-model:value="newSessionName"
                placeholder="请输入新会话名称"
        /></a-col>
    </a-modal>
    <a-modal
        :maskClosable="false"
        v-model:open="visibleMove"
        title="移动会话"
        @ok="handleMove"
        @cancel="handleCancelMove"
        cancelText="取消"
        okText="确定"
    >
        <a-col
            flex="auto"
            style="
                display: flex;
                flex-direction: column;
                align-content: center;
                justify-content: center;
                align-items: center;
            "
        >
            <p><strong>新的会话名称</strong></p>
            <a-input
                v-model:value="newSessionNameMove"
                placeholder="请输入新会话名称"
        /></a-col>
    </a-modal>
</template>

<script lang="ts">
import { type Router, useRouter } from "vue-router";
import {
    Col,
    Input,
    Modal,
    Popconfirm,
    Table,
    Tag,
    message,
} from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/es/table/interface";
import { defineComponent } from "vue";
import { fetchServerInfoServer } from "~/src/ServerConnectionInfo.ts";
import { listsessions, type listResults } from "./listsessions.ts"; // 引入 listsessions 函数
import { routepushEditSessions } from "./routepush";
import { deletesession } from "./deletesession";
import { copysession } from "./copysession";
import { MOVEsession } from "./movesession";

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
export interface Session {
    name: string;
    cmd: string;
    args: string;
    dir: string;
    created_at: string;
    updated_at: string;
}

export default defineComponent({
    setup() {
        async function handleMove() {
            if (!newSessionNameMove.value) {
                message.error("请输入新的会话名称");
                return;
            }
            try {
                console.log("新会话名称:", newSessionNameMove.value);

                const authresult = await getAuth(router);
                if (!authresult) {
                    return null;
                }
                const { baseurl, credentials } = authresult;
                const result = await MOVEsession(
                    {
                        ...credentials,

                        session: { name: oldSessionName.value },
                        destination: {
                            name: newSessionNameMove.value,
                        },
                    },
                    baseurl,
                );
                console.log(result);
                visibleMove.value = false;
                newSessionNameMove.value = ""; // 重置输入框
                message.success("移动会话成功");
                await fetchSessions();
            } catch (error) {
                console.error("移动会话失败:", error);
                message.error(
                    "移动会话失败" + "\n" + error + "\n" + String(error),
                );
            }
            // 此处添加复制会话的业务逻辑
        }
        const handleCancelMove = () => {
            visibleMove.value = false;
            newSessionNameMove.value = "";
        };
        const router = useRouter();

        const visibleMove = ref(false);
        const visible = ref(false);
        const newSessionName = ref("");
        const newSessionNameMove = ref("");
        const oldSessionName = ref("");

        const showCopyModal = () => {
            visible.value = true;
        };
        const showMoveModal = () => {
            visibleMove.value = true;
        };
        async function handleCopy() {
            if (!newSessionName.value) {
                message.error("请输入新的会话名称");
                return;
            }
            try {
                console.log("新会话名称:", newSessionName.value);

                const authresult = await getAuth(router);
                if (!authresult) {
                    return null;
                }
                const { baseurl, credentials } = authresult;
                const result = await copysession(
                    {
                        ...credentials,

                        session: { name: oldSessionName.value },
                        destination: {
                            name: newSessionName.value,
                        },
                    },
                    baseurl,
                );
                console.log(result);
                visible.value = false;
                newSessionName.value = ""; // 重置输入框
                message.success("复制会话成功");
                await fetchSessions();
            } catch (error) {
                console.error("复制会话失败:", error);
                message.error(
                    "复制会话失败" + "\n" + error + "\n" + String(error),
                );
            }
            // 此处添加复制会话的业务逻辑
        }

        async function fetchSessions() {
            loading.value = true;
            try {
                const result = await getSessions(router);
                if (!result) {
                    return;
                }
                // 调用 API 获取会话列表
                // const response = await api.getSessions();
                // this.sessions = response.data;
                sessions.value = result.sessions.map((session) => ({
                    ...session,
                    args: JSON.stringify(session.args), //.join(" ")
                }));
                message.success("会话列表获取成功");
            } catch (error) {
                console.error("获取会话列表失败:", error);
                message.error(
                    "获取会话列表失败" + "\n" + error + "\n" + String(error),
                );
            } finally {
                loading.value = false;
            }
        }
        async function handleDeleteSession(sessionname: string) {
            loading.value = true;
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
                await fetchSessions();
            } catch (error) {
                console.error("删除会话失败:", error);
                message.error(
                    "删除会话列表失败" + "\n" + error + "\n" + String(error),
                );
            } finally {
                loading.value = false;
            }
            // 调用 API 删除会话
            // await api.deleteSession(sessionId);
            //this.sessions = this.sessions.filter((s) => s.id !== sessionId);
        }
        async function handleChangeAttributes(sessionname: string) {
            // 实现修改属性逻辑
            console.log(`修改会话 ${sessionname} 的属性`);
            routepushEditSessions(sessionname);
        }
        const handleCancel = () => {
            visible.value = false;
            newSessionName.value = "";
        };
        const loading = ref(false);
        const sessions = ref<Session[]>([]);
        return {
            visibleMove,
            handleCancelMove,
            handleMove,
            newSessionNameMove,
            handleChangeAttributes,
            handleDeleteSession,
            fetchSessions,
            newSessionName,
            handleCopy,
            handleCancel,
            visible,
            handleCopyAttributes: async (sessionname: string) => {
                oldSessionName.value = sessionname;
                showCopyModal();
            },
            handleMoveAttributes: async (sessionname: string) => {


                oldSessionName.value = sessionname;
                showMoveModal();
            },
            router,
            sessions,
            loading,
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
                { title: "修改", key: "modify" },
                { title: "复制", key: "copy" },
                { title: "移动", key: "move" },
                { title: "删除", key: "delete" },
            ] as ColumnsType,
        };
    },
    components: {
        "a-col": Col,
        "a-modal": Modal,
        "a-tag": Tag,
        "a-table": Table,
        "a-input": Input,
        "a-popconfirm": Popconfirm,
    },

    mounted() {
        this.fetchSessions();
    },
    methods: {},
});
</script>
