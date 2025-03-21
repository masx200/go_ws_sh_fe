export const logoutUrl = "http://localhost:28080/logout";

export interface logoutCredentials {
    username: string;
    token: string;
    delete_identifier: string;
    identifier: string;
    type: string;
}
export interface logoutResults {
    delete_identifier: string;
    message: string;
    username: string;
}

export async function logout(
    credentials: logoutCredentials,
    url = logoutUrl,
): Promise<logoutResults> {
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
