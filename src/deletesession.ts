export const deleteSessionUrl = "http://localhost:28080/";

// 定义删除会话请求体的接口
export interface deleteSessionCredentialsInterface {
    authorization: {
        username?: string;
        password?: string;
        token?: string;
        identifier?: string;
        type: string;
    };
    session: {
        name: string;
    };
}

// 定义删除会话的响应结果接口
export interface deleteSessionResults {
    message: string;
    username: string;
    session: {
        name: string;
    };
}

// 定义删除会话的函数
export async function deletesession(
    credentials: deleteSessionCredentialsInterface,
    baseurl = deleteSessionUrl,
): Promise<deleteSessionResults> {
    const url = new URL("/sessions", baseurl).href;

    try {
        const init: RequestInit = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-HTTP-method-override": "DELETE",
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

        const data = (await response.json()) as deleteSessionResults;
        console.log("delete session successful:", data);
        return data;
    } catch (error) {
        console.error("delete session failed:", error);
        throw error;
    }
}
