<template>
    <div>
        <h2>创建会话</h2>
        <a-form
            :model="sessionInfo"
            @finish="handleCreateSession"
            ref="formRef"
            :rules="rules"
        >
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
                <a-button type="primary" html-type="submit">创建</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Form, Input, Button, message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form/interface";
import { getAuth } from "./SessionDisplay.vue";
import { createsession } from "./createsession";
import { routepushdisplaySessions } from "./routepush";
// import axios from "axios";

export default defineComponent({
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
            name: "",
            cmd: "",
            args: "",
            dir: "",
        });

        const handleCreateSession = async () => {
            await formRef.value
                .validateFields()
                .then(async () => {
                    try {
                        const authresult = await getAuth(router);
                        if (!authresult) {
                            return null;
                        }
                        const { baseurl, credentials } = authresult;

                        const result = await createsession(
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
                        message.success("会话创建成功");

                        // 根据 go_ws_sh.openapi.json 实现创建会话的 API 调用
                        // const response = await axios.post("/api/sessions", sessionInfo.value);
                        message.success("会话创建成功");

                        routepushdisplaySessions()
                    } catch (error) {
                        console.error("会话创建失败:", error);
                        message.error("会话创建失败");
                    }
                })
                .catch((error: any) => {
                    console.log("error", error);
                    message.error(error);
                });
        };

        return {
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
            handleCreateSession,
        };
    },
});
</script>
