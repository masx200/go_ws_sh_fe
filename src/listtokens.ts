export const listUrl = "http://localhost:28080/";

export interface listCredentials {
    authorization: {
        username: string;
        password?: string;
        token?: string;
        identifier?: string;
        type: string;
    };
}

// 新增：令牌列表的响应结果接口
export interface listTokenResults {
    message: string;
    username: string;
    tokens: {
        description: string;
        username: string;
        identifier: string;
        token: string;
        updated_at: string;
        created_at: string;
    }[];
}

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
        // 可以根据实际需求添加更多凭证相关字段
    }[];
}

// 新增：获取令牌列表的函数
export async function listtokens(
    credentials: listCredentials,
    baseurl = listUrl
): Promise<listTokenResults> {
    const url = new URL("/tokens", baseurl).href;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-HTTP-method-override": "GET"
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as listTokenResults;
        console.log("list tokens successful:", data);
        return data;
    } catch (error) {
        console.error("list tokens failed:", error);
        throw error;
    }
}

// 新增：获取凭证列表的函数
export async function listcredentials(
    credentials: listCredentials,
    baseurl = listUrl
): Promise<listCredentialResults> {
    const url = new URL("/credentials", baseurl).href;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-HTTP-method-override": "GET"
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as listCredentialResults;
        console.log("list credentials successful:", data);
        return data;
    } catch (error) {
        console.error("list credentials failed:", error);
        throw error;
    }
}
