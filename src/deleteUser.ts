// src/deleteUser.ts

export const deleteUserUrl = "http://localhost:28080/";

// 新增：删除用户请求体的接口
export interface deleteUserCredentialsInterface {
    authorization: {
        identifer?: string;
        username?: string;
        token?: string;
        password?: string;
        type: string;
    };
    credential: {
        username: string;
        password?: string;
    };
}

// 新增：删除用户的响应结果接口
export interface deleteUserResults {
    message: string;
    username: string;
    credential: {
        username: string;
        password?: string;
    };
}

// 新增：删除用户的函数
export async function deleteUser(
    credentials: deleteUserCredentialsInterface,
    baseurl = deleteUserUrl,
): Promise<deleteUserResults> {
    const url = new URL("/credentials", baseurl).href;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "x-HTTP-method-override": "DELETE",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as deleteUserResults;
        console.log("delete user successful:", data);
        return data;
    } catch (error) {
        console.error("delete user failed:", error);
        throw error;
    }
}