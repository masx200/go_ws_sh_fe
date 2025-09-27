<template>
    <div>
        <h2>修改令牌描述</h2>
        <el-form
            :model="tokenInfo"
            ref="formRef"
            :rules="rules"
            @submit.prevent="handleUpdateTokenDescription"
        >
            <el-form-item
                prop="identifier"
                label="令牌标识"
                :rules="[{ required: true, message: '请输入令牌标识' }]"
            >
                <el-input v-model="tokenInfo.identifier" />
            </el-form-item>
            <el-form-item
                prop="username"
                label="用户名"
                :rules="[{ required: true, message: '请输入用户名' }]"
            >
                <el-input v-model="tokenInfo.username" />
            </el-form-item>
            <el-form-item
                prop="description"
                label="新描述"
                :rules="[{ required: true, message: '请输入新的描述' }]"
            >
                <el-input v-model="tokenInfo.description" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { type Router, useRouter } from "vue-router";
import { defineComponent, ref } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { getAuth } from "./SessionDisplay.vue";
import { updateTokenDescription } from "./updateTokenDescription";
import { listtokens } from "./listtokens";

export default defineComponent({
    components: {
        "el-form": ElForm,
        "el-form-item": ElFormItem,
        "el-input": ElInput,
        "el-button": ElButton,
    },
    setup() {
        const router = useRouter();
        onMounted(async () => {
            try {
                const url = new URL(window.location.href);
                const identifier = url.searchParams.get("identifier");
                if (identifier) {
                    tokenInfo.value.identifier = identifier;

                    const authresult = await getAuth(router);
                    if (!authresult) {
                        return null;
                    }

                    const { baseurl, credentials } = authresult;
                    const result = await listtokens(
                        {
                            ...credentials,
                            token: {
                                identifier: identifier,
                            },
                        },
                        baseurl,
                    );
                    const tokens = result.tokens;

                    if (tokens.length > 0) {
                        //@ts-ignore
                        tokenInfo.value.username = tokens[0].username;
                            //@ts-ignore
                        tokenInfo.value.description = tokens[0].description;
                        console.log("令牌描述获取成功");
                        ElMessage.success("令牌描述获取成功");
                    } else {
                        console.error("令牌描述获取失败" + "\n" + "令牌不存在");
                        ElMessage.error("令牌描述获取失败" + "\n" + "令牌不存在");
                    }
                }
            } catch (error) {
                console.error("获取令牌描述失败:", error);
                ElMessage.error(
                    "获取令牌描述失败" + "\n" + error + "\n" + String(error),
                );
            }
        });
        const formRef = ref();
        const tokenInfo = ref({
            identifier: "",
            description: "",
            username: "",
        });

        const handleUpdateTokenDescription = async () => {
            await formRef.value.validate();
            try {
                const authresult = await getAuth(router);
                if (!authresult) {
                    return null;
                }
                const { baseurl, credentials } = authresult;
                const { identifier, description } = tokenInfo.value;
                console.log(
                    await updateTokenDescription(
                        credentials,
                        baseurl,
                        identifier,
                        description,
                        tokenInfo.value.username,
                    ),
                );
                ElMessage.success("令牌修改成功");
                // 调用 API 更新令牌描述
                // await api.updateTokenDescription(tokenInfo.value);
                console.log("令牌描述修改成功");

                const url = new URL(window.location.href);
                url.searchParams.set("tab", "displayTokens");

                console.log(url);
                // await router.push(url.href.slice(url.origin.length));//居然不管用
                history.pushState(null, "", url.href.slice(url.origin.length));
                location.reload();
            } catch (error) {
                console.error("修改令牌描述失败:", error);
                ElMessage.error(
                    "修改令牌描述失败" + "\n" + error + "\n" + String(error),
                );
            }
        };

        return {
            formRef,
            tokenInfo,
            handleUpdateTokenDescription,
            rules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                    {
                        pattern: /^[a-zA-Z0-9\-_]+$/,
                        message: "用户名只能包含字母、数字、下划线或短横线",
                        trigger: "blur",
                    },
                ],
                identifier: [
                    {
                        required: true,
                        message: "请输入令牌标识",
                        trigger: "blur",
                    },
                    {
                        pattern: /^[a-zA-Z0-9\-_]+$/,
                        message: "令牌标识只能包含字母、数字、下划线或短横线",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        message: "请输入新的描述",
                        trigger: "blur",
                    },
                    {
                        min: 5,
                        max: 100,
                        message: "描述长度应在 5 到 100 个字符之间",
                        trigger: "blur",
                    },
                ],
            } as FormRules,
        };
    },
});
</script>
