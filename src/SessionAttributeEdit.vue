<template>
    <div>
        <h2>修改会话属性</h2>
        <a-form
            :model="sessionInfo"
            ref="formRef"
            :rules="rules"
            @finish="handleUpdateSessionAttributes"
        >
            <!-- <a-form-item
                label="会话 ID"
                :rules="[{ required: true, message: '请输入会话 ID' }]"
            >
                <a-input v-model:value="sessionInfo.id" disabled />
            </a-form-item> -->
            <a-form-item
                name="name"
                label="会话名称"
                :rules="[{ required: true, message: '请输入会话名称' }]"
            >
                <a-input v-model:value="sessionInfo.name" />
            </a-form-item>
            <a-form-item
                name="cmd"
                label="命令"
                :rules="[{ required: true, message: '请输入命令' }]"
            >
                <a-input v-model:value="sessionInfo.cmd" />
            </a-form-item>
            <a-form-item
                name="args"
                label="参数"
                :rules="[{ required: true, message: '请输入参数' }]"
            >
                <a-input v-model:value="sessionInfo.args" />
            </a-form-item>
            <a-form-item
                name="dir"
                label="目录"
                :rules="[{ required: true, message: '请输入目录' }]"
            >
                <a-input v-model:value="sessionInfo.dir" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">修改</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { type listSessionInterface, listsessions } from "./listsessions";
import { defineComponent, ref } from "vue";
import { Form, Input, Button, message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form/interface";
import { routepushdisplaySessions } from "./routepush";
import { getAuth } from "./SessionDisplay.vue";
import { editSession } from "./editsession";

export default defineComponent({
    async mounted() {
        let sessionInfo = this.sessionInfo;
        const router = this.router;
        try {
            const url = new URL(window.location.href);
            const sessionname = url.searchParams.get("sessionname");
            if (!sessionname) {
                // message.error("会话不存在");
                return;
            }
            if (sessionname) {
                this.sessionInfo.name = sessionname;
            }

            const authresult = await getAuth(router);
            if (!authresult) return;

            const { baseurl, credentials } = authresult;
            const result = await listsessions(
                {
                    ...credentials,
                    session: { name: sessionname },
                },
                baseurl,
            );

            if (result.sessions.length > 0) {
                const session = result.sessions[0];
                sessionInfo = {
                    name: sessionname,
                    cmd: session.cmd,
                    args: JSON.stringify(session.args), // 将数组转换为字符串
                    dir: session.dir,
                };
                this.sessionInfo = sessionInfo;
                console.log("会话信息获取成功:", sessionInfo);
                message.success("会话信息获取成功");    
            } else {
                message.error("会话不存在");
            }
        } catch (error) {
            console.error("获取会话信息失败:", error);
            message.error("获取会话信息失败: " + error);
        }
    },
    components: {
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-input": Input,
        "a-button": Button,
    },
    setup() {
        const router = useRouter();
        const formRef = ref();
        const sessionInfo = ref({
            // id: "",
            name: "",
            cmd: "",
            args: "",
            dir: "",
        });

        const handleUpdateSessionAttributes = async () => {
            await formRef.value.validateFields();
            try {
                const authresult = await getAuth(router);
                if (!authresult) {
                    return null;
                }
                const { baseurl, credentials } = authresult;

                const result = await editSession(
                    {
                        ...credentials,

                        session: {
                            name: sessionInfo.value.name,
                            cmd: sessionInfo.value.cmd,
                            args: JSON.parse(sessionInfo.value.args),
                            dir: sessionInfo.value.dir,
                        },
                    },
                    baseurl,
                );
                console.log(result);
                // 调用 API 更新会话属性
                // await api.updateSessionAttributes(sessionInfo.value);
                console.log("会话属性修改成功");
                routepushdisplaySessions();
            } catch (error) {
                console.error("修改会话属性失败:", error);
                message.error("会话修改失败" + "\n" + String(error));
            }
        };

        return {
            router,
            formRef,
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入会话名称",
                        trigger: "blur",
                    },
                    {
                        min: 2,
                        max: 50,
                        message: "会话名称长度应在 2 到 50 个字符之间",
                        trigger: "blur",
                    },
                ],
                cmd: [
                    { required: true, message: "请输入命令", trigger: "blur" },
                    {
                        pattern: /^[a-zA-Z0-9_\-/]+$/,
                        message: "命令只能包含字母、数字、下划线、短横线或斜杠",
                        trigger: "blur",
                    },
                ],
                args: [
                    { required: true, message: "请输入参数", trigger: "blur" },
                    {
                        max: 100,
                        message: "参数长度不能超过 100 个字符",
                        trigger: "blur",
                    },
                ],
                dir: [
                    { required: true, message: "请输入目录", trigger: "blur" },
                    {
                        pattern: /^([a-zA-Z]:)?(\/[a-zA-Z0-9_\- ]+)+$/,
                        message: "请输入有效的目录路径",
                        trigger: "blur",
                    },
                ],
            } as Record<string, Rule[]>,
            sessionInfo,
            handleUpdateSessionAttributes,
            // router,
        };
    },
});
</script>
