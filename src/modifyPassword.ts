// src/modifyPassword.ts

export const modifyPasswordUrl = "http://localhost:28080/";

// 新增：创建用户请求体的接口
export interface modifyPasswordCredentialsInterface {
    authorization: {
        username?: string;
        token?: string;
        password?: string;
        identifier?: string;
        type: string;
    };
    credential: {
        username: string;
        password: string;
    };
}

// 新增：创建用户的响应结果接口
export interface modifyPasswordResults {
    message: string;
    username: string;
    credential: {
        username: string;
        // password: string;
    };
}

// 新增：创建用户的函数
export async function modifyPassword(
    credentials: modifyPasswordCredentialsInterface,
    baseurl = modifyPasswordUrl,
): Promise<modifyPasswordResults> {
    const url = new URL("/credentials", baseurl).href;

    try {
        const init: RequestInit = {
            method: "PUT",
            headers: {
                "x-HTTP-method-override": "PUT",
                "Content-Type": "application/json",
                authorization:
                    "Bearer " + btoa(JSON.stringify(credentials.authorization)),
            },
            body: JSON.stringify(credentials),
        };
        const response = await fetch(url, init);

        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${response.status}\nurl:${response.url}`,
            );
        }

        const data = (await response.json()) as modifyPasswordResults;
        console.log("create user successful:", data);
        return data;
    } catch (error) {
        console.error("create user failed:", error);
        throw error;
    }
}
