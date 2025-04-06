export const listUrl = "http://localhost:28080/";

export interface listSessionInterface {
    authorization: {
        username?: string;
        password?: string;
        token?: string;
        identifier?: string;
        type: string;
    };
    session?: {
        name?: string;
    };
}
export interface listResults {
    username: string;
    message: string;
    sessions: {
        name: string;
        args: string[];
        dir: string;
        cmd: string;
        created_at: string;
        updated_at: string;
    }[];
}

export async function listsessions(
    credentials: listSessionInterface,
    baseurl = listUrl,
): Promise<listResults> {
    const url = new URL("/sessions", baseurl).href;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-HTTP-method-override": "GET",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${response.status}\nurl:${response.url}`,
            );
        }

        // 如果需要处理响应数据，可以在这里进行
        const data = (await response.json()) as listResults;
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
