<template>
    <div>
        <h2>修改会话属性</h2>
        <a-form
            :model="sessionInfo"
            name="dynamic_form_item"
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
            <a-form
                :model="dynamicValidateForm"
                name="dynamic_form_item"
                ref="formRef2"
                :rules="rules"
                @finish="handleUpdateSessionAttributes"
            >
                <div
                    v-for="(arg, index) in dynamicValidateForm.args"
                    :key="arg.key"
                >
                    <a-form-item
                        :key="arg.key"
                        :label="'参数[' + index + ']'"
                        :name="['args', index, 'value']"
                        :rules="{
                            required: true,
                            message: '参数不能为空',
                            trigger: 'change',
                        }"
                    >
                        <a-input

                        name="args"
                        autocomplete="on"
                            v-model:value="arg.value"
                            placeholder="please input arg"
                            style="width: 60%; margin-right: 8px"
                        />
                    </a-form-item>
                    <a-form-item>
                        <a-button type="dashed" @click="removearg(arg)">
                            <MinusCircleOutlined
                                v-if="dynamicValidateForm.args.length > 0"
                                class="dynamic-delete-button"
                                @click="removearg(arg)"
                            />删除参数</a-button
                        >
                    </a-form-item>
                </div>
            </a-form>
            <!-- <a-form-item
                name="args"
                label="参数"
                :rules="[{ required: true, message: '请输入参数' }]"
            >
                <a-input v-model:value="sessionInfo.args" />
            </a-form-item> -->

            <a-form-item>
                <a-button type="dashed" style="width: 60%" @click="addarg">
                    <PlusOutlined />
                    添加参数
                </a-button>
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
            <a-form-item>
                <a-button style="margin-left: 10px" @click="resetForm"
                    >重置参数</a-button
                >
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import {
    Button,
    Form,
    Input,
    message,
    type FormInstance,
} from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form/interface";
import { defineComponent, ref } from "vue";
import { editSession } from "./editsession";
import { listsessions } from "./listsessions";
import { routepushdisplaySessions } from "./routepush";
import { getAuth } from "./SessionDisplay.vue";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
interface arg {
    value: string;
    key: number;
}
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
                    // args: JSON.stringify(session.args), // 将数组转换为字符串
                    dir: session.dir,
                };
                this.dynamicValidateForm.args = session.args.map((arg) => ({
                    value: arg,
                    key: Date.now(),
                }));
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
        MinusCircleOutlined,
        PlusOutlined,
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-input": Input,
        "a-button": Button,
    },
    setup() {
        const removearg = (item: arg) => {
            const index = dynamicValidateForm.args.indexOf(item);
            if (index !== -1) {
                dynamicValidateForm.args.splice(index, 1);
            }
        };

        const resetForm = () => {
            formRef.value?.resetFields();
            formRef2.value?.resetFields();

            dynamicValidateForm.args.length = 0;
        };
        const router = useRouter();
        const formRef = ref<FormInstance>();
        const formRef2 = ref<FormInstance>();
        const sessionInfo = ref({
            // id: "",
            name: "",
            cmd: "",
            // args: "",
            dir: "",
        });

        const handleUpdateSessionAttributes = async () => {
            await formRef2.value?.validateFields();
            await formRef.value?.validateFields();
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
                            args: dynamicValidateForm.args
                                .map((a) => a.value)
                                .filter(Boolean), //JSON.parse(sessionInfo.value.args),
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

        const dynamicValidateForm = reactive<{ args: arg[] }>({
            args: [],
        });
        const addarg = () => {
            dynamicValidateForm.args.push({
                value: "",
                key: Date.now(),
            });
        };
        return {
            formRef2,
            removearg,
            addarg,

            resetForm,
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
                // args: [
                //     { required: true, message: "请输入参数", trigger: "blur" },
                //     {
                //         max: 100,
                //         message: "参数长度不能超过 100 个字符",
                //         trigger: "blur",
                //     },
                // ],
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
            dynamicValidateForm,
            // router,
        };
    },
});
</script>
