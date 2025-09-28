<template>
    <div>
        <h2>修改会话属性</h2>
        <el-form
            :model="sessionInfo"
            ref="formRef"
            :rules="rules"
            @submit.prevent="handleUpdateSessionAttributes"
        >
            <!-- <el-form-item
                label="会话 ID"
                :rules="[{ required: true, message: '请输入会话 ID' }]"
            >
                <el-input v-model="sessionInfo.id" disabled />
            </el-form-item> -->
            <el-form-item
                prop="name"
                label="会话名称"
                :rules="[{ required: true, message: '请输入会话名称' }]"
            >
                <el-input v-model="sessionInfo.name" />
            </el-form-item>
            <el-form-item
                prop="cmd"
                label="命令"
                :rules="[{ required: true, message: '请输入命令' }]"
            >
                <el-input v-model="sessionInfo.cmd" />
            </el-form-item>
            <el-form
                :model="dynamicValidateForm"
                ref="formRef2"
                :rules="rules"
                @submit.prevent="handleUpdateSessionAttributes"
            >
                <div
                    v-for="(arg, index) in dynamicValidateForm.args"
                    :key="arg.key"
                >
                    <el-form-item
                        :key="arg.key"
                        :label="'参数[' + index + ']'"
                        :prop="'args.' + index + '.value'"
                        :rules="{
                            required: true,
                            message: '参数不能为空',
                            trigger: 'change',
                        }"
                    >
                        <el-input
                            :name="'args[' + index + ']'"
                            autocomplete="on"
                            v-model="arg.value"
                            placeholder="please input arg"
                            style="width: 60%; margin-right: 8px"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain @click="removearg(arg)">
                            删除参数</el-button
                        >
                    </el-form-item>
                </div>
            </el-form>
            <!-- <el-form-item
                prop="args"
                label="参数"
                :rules="[{ required: true, message: '请输入参数' }]"
            >
                <el-input v-model="sessionInfo.args" />
            </el-form-item> -->

            <el-form-item>
                <el-button
                    type="primary"
                    plain
                    style="width: 60%"
                    @click="addarg"
                >
                    添加参数
                </el-button>
            </el-form-item>
            <el-form-item
                prop="dir"
                label="目录"
                :rules="[{ required: true, message: '请输入目录' }]"
            >
                <el-input v-model="sessionInfo.dir" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">修改</el-button>
            </el-form-item>
            <el-form-item>
                <el-button style="margin-left: 10px" @click="resetForm"
                    >重置参数</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import {
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElMessage,
    type FormInstance,
} from "element-plus";
import type { FormRules } from "element-plus";
import { defineComponent, ref } from "vue";
import { editSession } from "./editsession";
import { listsessions } from "./listsessions";
import { routepushdisplaySessions } from "./routepush";
import { getAuth } from "./SessionDisplay.vue";
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
                    //@ts-ignore
                    cmd: session.cmd,
                    // args: JSON.stringify(session.args), // 将数组转换为字符串
                    //@ts-ignore
                    dir: session.dir,
                };
                //@ts-ignore
                this.dynamicValidateForm.args = session.args.map((arg) => ({
                    value: arg,
                    key: Date.now(),
                }));
                this.sessionInfo = sessionInfo;
                console.log("会话信息获取成功:", sessionInfo);
                ElMessage.success("会话信息获取成功");
            } else {
                ElMessage.error("会话不存在");
            }
        } catch (error) {
            console.error("获取会话信息失败:", error);
            ElMessage.error("获取会话信息失败: " + error);
        }
    },
    components: {
        "el-form": ElForm,
        "el-form-item": ElFormItem,
        "el-input": ElInput,
        "el-button": ElButton,
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
            await formRef2.value?.validate();
            await formRef.value?.validate();
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
                ElMessage.error("会话修改失败" + "\n" + String(error));
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
            } as FormRules,
            sessionInfo,
            handleUpdateSessionAttributes,
            dynamicValidateForm,
            // router,
        };
    },
});
</script>
