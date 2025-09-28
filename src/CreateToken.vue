<template>
    <div style="width: 100%">
        <h1>令牌管理</h1>
        <el-form
            style="width: 100%"
            :model="formState"
            @submit.prevent="handleCreateToken"
            ref="formRef"
            :rules="rules"
        >
            <!-- <el-form-item label="令牌用户" prop="username" :rules="[{ required: true }]">
                <el-input v-model="formState.username" placeholder="请输入令牌用户" />
            </el-form-item> -->
            <el-form-item
                label="令牌描述"
                prop="description"
                :rules="[{ required: true }]"
            >
                <el-input
                    v-model="formState.description"
                    placeholder="请输入令牌描述"
                />
            </el-form-item>
            <el-button type="primary" native-type="submit"
                >创建新令牌</el-button
            >
        </el-form>
        <!-- 新增令牌信息展示区域 -->
        <div v-if="showTokenInfo" style="margin-top: 20px">
            <p>令牌创建成功</p>
            <el-table
                :data="tokenInfoSource"
                :columns="tokenInfoColumns"
                :pagination="false"
                border
            ></el-table>
            <!-- <p>令牌标识: {{ tokenInfo.identifier }}</p>
            <p>令牌密码: {{ tokenInfo.password }}</p> -->
            <el-button type="primary" @click="handleTokenSaved"
                >我已保存令牌</el-button
            >
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElTable,
    ElTableColumn,
    ElMessage,
    type FormRules,
} from "element-plus";
import { getAuth } from "./SessionDisplay.vue";
import { login } from "./login";
import { routepushdisplayTokens } from "./routepush";

// interface Token {
//     username: string;
//     description: string;

// }

export default defineComponent({
    setup() {
        const router = useRouter();
        const formRef = ref();
        return {
            router,
            formRef,
            rules: {
                description: [
                    {
                        required: true,
                        message: "请输入令牌描述",
                        trigger: "blur",
                    },
                    {
                        min: 5,
                        max: 100,
                        message: "令牌描述长度应在 5 到 100 个字符之间",
                        trigger: "blur",
                    },
                ],
            } as FormRules,
        };
    },
    components: {
        "el-form": ElForm,
        "el-form-item": ElFormItem,
        "el-input": ElInput,
        "el-button": ElButton,
        "el-table": ElTable,
        "el-table-column": ElTableColumn,
    },
    data() {
        return {
            tokenInfoSource: [] as { type: string; value: string }[],
            tokenInfoColumns: [
                {
                    title: "信息类型",
                    dataIndex: "type",
                    key: "type",
                    ellipsis: false,
                    customCell: () => {
                        return {
                            style: {
                                wordWrap: "break-word",
                                wordBreak: "break-all",
                                whiteSpace: "normal",
                                // minHeight: "50px",
                                // width: "50px",
                            },
                        };
                    },
                },
                {
                    title: "值",
                    dataIndex: "value",
                    key: "value",
                    ellipsis: false,
                    customCell: () => {
                        return {
                            style: {
                                wordWrap: "break-word",
                                wordBreak: "break-all",
                                whiteSpace: "normal",
                                // minHeight: "50px",
                                // width: "50px",
                            },
                        };
                    },
                },
            ] as any,
            formState: {
                description: "",

                // username: ""
            },
            // tokens: [] as Token[],
            loading: false,
            showTokenInfo: false,
            tokenInfo: {
                identifier: "",
                password: "",
            },
            // columns: [
            //     { title: "令牌标识", dataIndex: "identifier" },
            //     { title: "用户", dataIndex: "username" },
            //     { title: "描述", dataIndex: "description" },
            //     { title: "操作", key: "action" },
            // ] as const,
        };
    },

    methods: {
        handleTokenSaved() {
            this.showTokenInfo = false;
            this.formState.description = "";
            routepushdisplayTokens();
        },
        async handleCreateToken() {
            await this.formRef.validate();
            const { router } = this;
            try {
                const authresult = await getAuth(router);
                if (!authresult) {
                    return null;
                }
                const { baseurl, credentials } = authresult;

                const result = await login(
                    {
                        ...credentials,

                        token: {
                            description: this.formState.description,
                            username: credentials.authorization.username,
                        },
                    },
                    baseurl,
                );
                console.log(result);
                // 显示令牌信息
                this.tokenInfo = {
                    identifier: result.token.identifier,
                    password: result.token.token,
                };

                this.tokenInfoSource = [
                    {
                        type: "令牌标识",
                        value: result.token.identifier,
                    },
                    {
                        type: "令牌密码",
                        value: result.token.token,
                    },
                ];
                this.showTokenInfo = true;
                ElMessage.success("令牌创建成功");
                // this.formState.description = "";

                // routepushdisplayTokens();
            } catch (error) {
                console.error("创建令牌失败:", error);
                ElMessage.error("创建创建失败");
            }
        },
    },
});
import { useRouter } from "vue-router";
</script>
