export const listUrl = "http://localhost:28080/";

export interface listTokensInterface {
    authorization: {
        username?: string;
        password?: string;
        token?: string;
        identifier?: string;
        type: string;
    };
    token?: {
        identifier?: string;
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
    credentials: listTokensInterface,
    baseurl = listUrl,
): Promise<listTokenResults> {
    const url = new URL("/tokens", baseurl).href;
    try {
        const init: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-HTTP-method-override": "GET",
                authorization: "Bearer " +
                    btoa(JSON.stringify(credentials.authorization)),
            },
            body: JSON.stringify(credentials),
        };
        const response = await fetch(url, init);

        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${response.status}\nurl:${response.url}`,
            );
        }

        const data = (await response.json()) as listTokenResults;
        console.log("list tokens successful:", data);
        return data;
    } catch (error) {
        console.error("list tokens failed:", error);
        throw error;
    }
}
