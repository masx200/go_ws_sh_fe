export const logoutUrl = "http://localhost:28080/";

export interface logoutCredentials {
    authorization: {
        username?: string;
        password?: string;
        token: string;
        identifier: string;
        type: string;
    };
    token: {
        identifier: string;
        username: string;
    };
}
export interface logoutResults {
    message: string;
    username: string;
    token: {
        identifier: string;
        username: string;
    };
}

export async function logout(
    credentials: logoutCredentials,
    baseurl = logoutUrl,
): Promise<logoutResults> {
    const url = new URL("/tokens", baseurl).href;
    try {
        const init: RequestInit = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
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

        // 如果需要处理响应数据，可以在这里进行
        const data = (await response.json()) as logoutResults;
        console.log("logout successful:", data);
        return data;
    } catch (error) {
        console.error("logout failed:", error);
        throw error;
    }
}
export function cleartoken(result: logoutResults) {
    Object.keys(result).forEach((key) => {
        localStorage.removeItem(key);
    });
}
