export const editSessionUrl = "http://localhost:28080/";

// 定义创建会话请求体的接口
export interface editSessionCredentialsInterface {
    authorization: {
        username?: string;
        password?: string;
        token?: string;
        identifier?: string;
        type: string;
    };
    session: {
        // 这里根据实际情况添加会话相关的属性
        name: string;
        args: string[];
        dir: string;
        cmd: string;
    };
}

// 定义创建会话的响应结果接口
export interface editSessionResults {
    message: string;
    username: string;
    session: {
        name: string;
        args: string[];
        dir: string;
        cmd: string;
        // created_at: string;
        // updated_at: string;
    };
}

// 定义创建会话的函数
export async function editSession(
    credentials: editSessionCredentialsInterface,
    baseurl = editSessionUrl,
): Promise<editSessionResults> {
    const url = new URL("/sessions", baseurl).href;

    try {
        const init: RequestInit = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-HTTP-method-override": "PUT",
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

        const data = (await response.json()) as editSessionResults;
        console.log("create session successful:", data);
        return data;
    } catch (error) {
        console.error("create session failed:", error);
        throw error;
    }
}
