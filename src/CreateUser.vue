<template>
    <div>
        <h2>创建用户</h2>
        <el-form
            ref="formRef"
            :rules="rules"
            :model="userInfo"
            @submit.prevent="handleCreateUser"
        >
            <el-form-item
                prop="username"
                label="用户名"
                :rules="[
                    { required: true, message: '请输入用户名' },

                    { min: 4, message: '用户名长度至少为4位', trigger: 'blur' },
                ]"
            >
                <el-input v-model="userInfo.username" />
            </el-form-item>
            <el-form-item
                prop="password"
                label="密码"
                :rules="[
                    { required: true, message: '请输入密码' },

                    { min: 4, message: '密码长度至少为4位', trigger: 'blur' },
                ]"
            >
                <el-input
                    v-model="userInfo.password"
                    type="password"
                    show-password
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">创建</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent, ref } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, type FormRules } from "element-plus";
import { getAuth } from "./SessionDisplay.vue";
import { createUser } from "./createUser";
import { routepushdisplayUsers } from "./routepush";
// import axios from "axios";

export default defineComponent({
    components: {
        "el-form": ElForm,
        "el-form-item": ElFormItem,
        "el-input": ElInput,
        "el-button": ElButton,
    },
    setup() {
        const formRef = ref();
        const router = useRouter();
        const userInfo = ref({
            username: "",
            password: "",
        });

        const handleCreateUser = async () => {
            await formRef.value.validate();
            if (!userInfo.value.username || !userInfo.value.password) {
                ElMessage.error("请输入用户名和密码");
                return;
            }
            try {
                const authresult = await getAuth(router);
                if (!authresult) {
                    return null;
                }
                const { baseurl, credentials } = authresult;
                // 根据 go_ws_sh.openapi.json 实现创建用户的 API 调用
                // const response = await axios.post("/api/users", userInfo.value);

                const result = await createUser(
                    {
                        ...credentials,

                        credential: {
                            username: userInfo.value.username,
                            password: userInfo.value.password,
                        },
                    },
                    baseurl,
                );
                console.log(result);
                ElMessage.success("用户创建成功");
                routepushdisplayUsers();
            } catch (error) {
                console.error("用户创建失败:", error);
                ElMessage.error(
                    "用户创建失败" + "\n" + error + "\n" + String(error),
                );
            }
        };

        return {
            formRef,
            rules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                    { min: 4, message: "用户名长度至少为4位", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 4, message: "密码长度至少为4位", trigger: "blur" },
                ],
            } as FormRules,
            userInfo,
            router,
            handleCreateUser,
        };
    },
});
</script>
