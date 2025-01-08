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

export async function login(
    credentials: LoginCredentials,
    url = loginUrl,
): Promise<LoginResults> {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

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
