export const listUrl = "http://localhost:28080/list";

export interface listCredentials {
    token: string;
}
export interface listResults {
    username: string;
    message: string;
    list: string[];
}

export async function list(
    credentials: listCredentials, url = listUrl
): Promise<listResults> {
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
        const data = await response.json() as listResults;
        console.log("list successful:", data);
        return data;
    } catch (error) {
        console.error("list failed:", error);
        throw error;
    }
}
export function gettoken() {
    return localStorage?.getItem("token");
}
