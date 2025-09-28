export const loginUrl = "http://localhost:28080/";

export interface LoginCredentials {
    authorization: {
        username?: string;
        password?: string;
        token?: string;
        identifier?: string;
        type: string;
    };
    token: {
        description: string;
        username: string;
    };
}
export interface LoginResults {
    username: string;
    token: {
        description: string;

        token: string;
        identifier: string;
    };

    message: string;
}

// 导出一个异步函数，用于登录
export async function login(
    // 登录凭证
    credentials: LoginCredentials,
    // 登录URL，默认为loginUrl
    baseurl = loginUrl,
): Promise<LoginResults> {
    const url = new URL("/tokens", baseurl).href;
    try {
        const init: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-HTTP-method-override": "POST",
                authorization:
                    "Bearer " + btoa(JSON.stringify(credentials.authorization)),
            },
            body: JSON.stringify(credentials),
        };
        // 发送POST请求，将登录凭证作为请求体
        const response = await fetch(url, init);

        // 如果响应状态码不是200，抛出错误
        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${response.status}\nurl:${response.url}`,
            );
        }

        // 如果需要处理响应数据，可以在这里进行
        const data = (await response.json()) as LoginResults;
        console.log("Login successful:", data);
        return data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}
export function savetoken(result: LoginResults) {
    Object.entries(result).forEach(([key, value]) => {
        if (typeof value === "object") return;
        localStorage.setItem(key, value);
    });
    Object.entries(result.token).forEach(([key, value]) => {
        localStorage.setItem(key, value);
    });
}
