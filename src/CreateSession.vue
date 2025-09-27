<template>
    <div>
        <h2>创建会话</h2>

        <el-form
            ref="formRef"
            style="max-width: 100%"
            :model="sessionInfo"
            @submit.prevent="handleCreateSession"
            :rules="rules"
            label-width="auto"
            class="demo-dynamic"
        >
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
                <!-- <a-form-item
                name="args"
                label="参数"
                :rules="[{ required: true, message: '请输入参数' }]"
            >
                <a-input v-model:value="sessionInfo.args" />
            </a-form-item> -->
                <div
                    v-for="(arg, index) in dynamicValidateForm.args"
                    :key="arg.key"
                >
                    <el-form-item
                        :label="'参数' + '[' + index + ']'"
                        :prop="'args.' + index + '.value'"
                        :rules="{
                            required: true,
                            message: '参数不能为空',
                            trigger: 'blur',
                        }"
                    >
                        <el-input
                            v-model="arg.value"
                            :name="'args[' + index + ']'"
                            autocomplete="on"
                        />
                    </el-form-item>

                    <el-form-item
                        ><el-button
                            class="mt-2"
                            @click.prevent="removearg(arg)"
                        >
                            删除参数
                        </el-button></el-form-item
                    >
                </div>
                <el-form-item>
                    <el-button @click="addarg">添加参数</el-button>
                </el-form-item>
                <el-form-item
                    prop="dir"
                    label="目录"
                    :rules="[{ required: true, message: '请输入目录' }]"
                >
                    <el-input v-model="sessionInfo.dir" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">创建</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm(formRef)"
                        >重置参数</el-button
                    >
                </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElMessage,
    type FormInstance,
    type FormRules,
} from "element-plus";

import { useRouter } from "vue-router";
import { getAuth } from "./SessionDisplay.vue";
import { createsession } from "./createsession";
import { routepushdisplaySessions } from "./routepush";
// import axios from "axios";
interface argItem {
    key: number;
    value: string;
}
export default defineComponent({
    components: {
        "el-form": ElForm,
        "el-form-item": ElFormItem,
        "el-input": ElInput,
        "el-button": ElButton,
    },
    setup() {
        const resetForm = (formEl: FormInstance | undefined) => {
            if (!formEl) return;
            formEl.resetFields();
            dynamicValidateForm.args.length = 0;
            formRef?.value?.resetFields();
        };
        const removearg = (item: argItem) => {
            const index = dynamicValidateForm.args.indexOf(item);
            if (index !== -1) {
                dynamicValidateForm.args.splice(index, 1);
            }
        };

        const addarg = () => {
            dynamicValidateForm.args.push({
                key: Date.now(),
                value: "",
            });
        };

        const dynamicValidateForm = reactive<{
            args: argItem[];
            //   email: string
        }>({
            args: [
                // {
                //     key: 1,
                //     value: "",
                // },
            ],
            //   email: '',
        });
        const router = useRouter();
        const formRef = ref<FormInstance>();
        const sessionInfo = ref({
            name: "",
            cmd: "",
            // args: "",
            dir: "",
        });

        const handleCreateSession = async () => {
            if (!formRef.value) return;
            formRef.value.validate(async (valid: boolean) => {
                if (valid) {
                    console.log("submit!");
                    try {
                        const authresult = await getAuth(router);
                        if (!authresult) {
                            return;
                        }
                        const { baseurl, credentials } = authresult;

                        const result = await createsession(
                            {
                                ...credentials,

                                session: {
                                    name: sessionInfo.value.name,
                                    cmd: sessionInfo.value.cmd,
                                    args: dynamicValidateForm.args
                                        .map((item) => item.value)
                                        .filter(Boolean),
                                    // args: JSON.parse(sessionInfo.value.args),
                                    dir: sessionInfo.value.dir,
                                },
                            },
                            baseurl,
                        );
                        console.log(result);
                        ElMessage.success("会话创建成功");

                        // 根据 go_ws_sh.openapi.json 实现创建会话的 API 调用
                        // const response = await axios.post("/api/sessions", sessionInfo.value);
                        //message.success("会话创建成功");

                        routepushdisplaySessions();
                    } catch (error) {
                        console.error("会话创建失败:", error);
                        ElMessage.error(
                            "会话创建失败" + "\n" + String(error),
                        );
                    }
                } else {
                    console.log("error submit!");
                }
            });
        };

        return {
            addarg,
            removearg,
            resetForm,
            dynamicValidateForm,
            formRef,
            router,
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
            handleCreateSession,
        };
    },
});
</script>
