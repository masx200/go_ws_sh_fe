export const listUrl = "http://localhost:28080/";

export interface listCredentialsInterface {
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

// 新增：获取令牌列表的函数
export async function listtokens(
    credentials: listCredentialsInterface,
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


