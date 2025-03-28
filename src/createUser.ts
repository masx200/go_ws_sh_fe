// src/createUser.ts

export const createUserUrl = "http://localhost:28080/";

// 新增：创建用户请求体的接口
export interface createUserCredentialsInterface {
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
export interface createUserResults {
    message: string;
    username: string;
    credential: {
        username: string;
        // password: string;
    };
}

// 新增：创建用户的函数
export async function createUser(
    credentials: createUserCredentialsInterface,
    baseurl = createUserUrl,
): Promise<createUserResults> {
    const url = new URL("/credentials", baseurl).href;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "x-HTTP-method-override": "POST",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${response.status}\nurl:${response.url}`,
            );
        }

        const data = (await response.json()) as createUserResults;
        console.log("create user successful:", data);
        return data;
    } catch (error) {
        console.error("create user failed:", error);
        throw error;
    }
}
