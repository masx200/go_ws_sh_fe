// 新增：凭证列表的响应结果接口

export interface listCredentialResults {
    message: string;
    username: string;
    // 根据 openapi 补充凭证列表的响应结构
    // 这里假设凭证响应结构中包含一个 credentials 数组，具体字段可根据实际情况调整
    credentials: {

        username: string;
        updated_at: string;
        created_at: string;
    }[];
}
