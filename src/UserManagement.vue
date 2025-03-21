<template>
    <div>
        <h1>用户管理</h1>
        <!-- 修改用户名和密码 -->
        <a-form :model="userInfo" @finish="handleSubmit">
            <a-form-item
                label="用户名"
                :rules="[{ required: true, message: '请输入用户名' }]"
            >
                <a-input v-model:value="userInfo.username" />
            </a-form-item>
            <a-form-item
                label="密码"
                :rules="[{ required: true, message: '请输入密码' }]"
            >
                <a-input-password v-model:value="userInfo.password" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">修改</a-button>
            </a-form-item>
        </a-form>
        <!-- 私人令牌管理 -->
        <h2>私人令牌管理</h2>
        <a-button type="primary" @click="createToken">创建令牌</a-button>
        <a-table :data-source="tokens" :columns="columns">
            <template #title>
                <h3>令牌列表</h3>
            </template>
            <template #bodyCell="{ record, column }">
                <template #default>
                    <span v-if="column.dataIndex === 'actions'">
                        <a-button @click="deleteToken(record.id)"
                            >删除</a-button
                        >
                    </span>
                    <span v-else>{{ record[column.dataIndex] }}</span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { Form } from "ant-design-vue";
import { ref } from "vue";
import { message } from "ant-design-vue";
defineComponent({
    components: {
        "a-form": Form,
    },
});
// 模拟用户信息
const userInfo = ref({
    username: "testuser",
    password: "testpassword",
});

// 模拟令牌列表
const tokens = ref([
    { id: 1, token: "token123" },
    { id: 2, token: "token456" },
]);

// 表格列配置
const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "令牌",
        dataIndex: "token",
        key: "token",
    },
    {
        title: "操作",
        dataIndex: "actions",
        key: "actions",
    },
];

// 处理表单提交
const handleSubmit = () => {
    // 这里可以添加实际的修改逻辑
    message.success("用户名和密码修改成功");
};

// 创建令牌
const createToken = () => {
    // 这里可以添加实际的创建逻辑
    const newToken = {
        id: tokens.value.length + 1,
        token: `token${tokens.value.length + 1}`,
    };
    tokens.value.push(newToken);
    message.success("令牌创建成功");
};

// 删除令牌
const deleteToken = (id) => {
    // 这里可以添加实际的删除逻辑
    tokens.value = tokens.value.filter((token) => token.id !== id);
    message.success("令牌删除成功");
};
</script>

<style scoped>
h1,
h2,
h3 {
    margin-bottom: 16px;
}
</style>
