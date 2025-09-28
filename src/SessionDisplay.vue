<template>
    <el-table
        :data="sessions"
        :loading="loading"
        style="width: 100%"
        :row-key="(record) => record.name"
    >
        <el-table-column
            v-for="col in columns"
            :key="col.prop || col.label"
            :prop="col.prop"
            :label="col.label"
        >
            <template v-if="col.key === 'copy'" #default="{ row: record }">
                <span>
                    <el-button
                        type="text"
                        @click="handleCopyAttributes(record.name)"
                        >复制</el-button
                    ></span
                >
            </template>
            <template v-if="col.key === 'move'" #default="{ row: record }">
                <span>
                    <el-button
                        type="text"
                        @click="handleMoveAttributes(record.name)"
                        >移动</el-button
                    ></span
                >
            </template>
            <template v-if="col.key === 'args'" #default="{ row: record }">
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
                        <el-tag type="primary">{{ arg }}</el-tag>
                    </li>
                </ul>
            </template>
            <template v-if="col.key === 'delete'" #default="{ row: record }">
                <span>
                    <el-popconfirm
                        title="确定删除该会话？"
                        @confirm="handleDeleteSession(record.name)"
                    >
                        <el-button type="text">删除</el-button>
                    </el-popconfirm></span
                >
            </template>
            <template v-if="col.key === 'modify'" #default="{ row: record }">
                <span>
                    <el-button
                        type="text"
                        @click="handleChangeAttributes(record.name)"
                        >修改</el-button
                    ></span
                >
            </template>
        </el-table-column>
    </el-table>
    <el-dialog
        :close-on-click-modal="false"
        v-model="visible"
        title="复制会话"
        @confirm="handleCopy"
        @cancel="handleCancel"
        width="30%"
    >
        <el-col
            :span="24"
            style="
                display: flex;
                flex-direction: column;
                align-content: center;
                justify-content: center;
                align-items: center;
            "
        >
            <p><strong>新的会话名称</strong></p>
            <el-input v-model="newSessionName" placeholder="请输入新会话名称"
        /></el-col>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleCopy">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        :close-on-click-modal="false"
        v-model="visibleMove"
        title="移动会话"
        @confirm="handleMove"
        @cancel="handleCancelMove"
        width="30%"
    >
        <el-col
            :span="24"
            style="
                display: flex;
                flex-direction: column;
                align-content: center;
                justify-content: center;
                align-items: center;
            "
        >
            <p><strong>新的会话名称</strong></p>
            <el-input
                v-model="newSessionNameMove"
                placeholder="请输入新会话名称"
        /></el-col>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancelMove">取消</el-button>
                <el-button type="primary" @click="handleMove">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { type Router, useRouter } from "vue-router";
import {
    ElCol,
    ElInput,
    ElDialog,
    ElPopconfirm,
    ElTable,
    ElTableColumn,
    ElTag,
    ElButton,
    ElMessage,
} from "element-plus";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { defineComponent } from "vue";
import { fetchServerInfoServer } from "./ServerConnectionInfo.ts";
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
    //@ts-ignore
    const token = urlserver ? conninfo.token : localStorage?.getItem("token");
    if (!token || !urlserver) {
        await router.push("/");
        return null;
    }

    return {
        baseurl: new URL(urlserver).href,
        credentials: {
            authorization: {
                //@ts-ignore
                username: conninfo.username,
                token: token,
                type: "token",
                //@ts-ignore
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

interface TableColumnWithKey extends TableColumnCtx<Session> {
    key?: string;
}

export default defineComponent({
    setup() {
        async function handleMove() {
            if (!newSessionNameMove.value) {
                ElMessage.error("请输入新的会话名称");
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
                ElMessage.success("移动会话成功");
                await fetchSessions();
            } catch (error) {
                console.error("移动会话失败:", error);
                ElMessage.error(
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
                ElMessage.error("请输入新的会话名称");
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
                ElMessage.success("复制会话成功");
                await fetchSessions();
            } catch (error) {
                console.error("复制会话失败:", error);
                ElMessage.error(
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
                ElMessage.success("会话列表获取成功");
            } catch (error) {
                console.error("获取会话列表失败:", error);
                ElMessage.error(
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

                ElMessage.success("会话删除成功");
                await fetchSessions();
            } catch (error) {
                console.error("删除会话失败:", error);
                ElMessage.error(
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
                { prop: "name", label: "会话名称" },
                { prop: "cmd", label: "命令" },
                {
                    prop: "args",
                    key: "args",
                    label: "参数",
                },
                { prop: "dir", label: "目录" },
                { prop: "created_at", label: "创建时间" },
                { prop: "updated_at", label: "修改时间" },
                { label: "修改", key: "modify" },
                { label: "复制", key: "copy" },
                { label: "移动", key: "move" },
                { label: "删除", key: "delete" },
            ] as TableColumnWithKey[],
        };
    },
    components: {
        "el-col": ElCol,
        "el-dialog": ElDialog,
        "el-tag": ElTag,
        "el-table": ElTable,
        "el-table-column": ElTableColumn,
        "el-input": ElInput,
        "el-popconfirm": ElPopconfirm,
        "el-button": ElButton,
    },

    mounted() {
        this.fetchSessions();
    },
    methods: {},
});
</script>
