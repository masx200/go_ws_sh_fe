export const logoutUrl = "http://localhost:28080/";

export interface logoutCredentials {
    authorization: {
        username?: string;

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
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
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
