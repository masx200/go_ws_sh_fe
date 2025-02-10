export const loginUrl = "http://localhost:28080/login";

export interface LoginCredentials {
    username: string;
    password: string;
}
export interface LoginResults {
    username: string;
    token: string;
    message: string;
}

// 导出一个异步函数，用于登录
export async function login(
    // 登录凭证
    credentials: LoginCredentials,
    // 登录URL，默认为loginUrl
    url = loginUrl,
): Promise<LoginResults> {
    try {
        // 发送POST请求，将登录凭证作为请求体
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        // 如果响应状态码不是200，抛出错误
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
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
        localStorage.setItem(key, value);
    });
}
