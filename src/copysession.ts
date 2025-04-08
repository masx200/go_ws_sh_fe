export const copysessionUrl = "http://localhost:28080/";

// 定义删除会话请求体的接口
export interface copysessionCredentialsInterface {
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
    destination: {
        name: string;
    };
}

// 定义删除会话的响应结果接口
export interface copysessionResults {
    message: string;
    username: string;
    session: {
        name: string;
        args: string[];
        dir: string;
        cmd: string;
        created_at: string;
        updated_at: string;
    };
}

// 定义删除会话的函数
export async function copysession(
    credentials: copysessionCredentialsInterface,
    baseurl = copysessionUrl,
): Promise<copysessionResults> {
    const url = new URL("/sessions", baseurl).href;

    try {
        const response = await fetch(url, {
            method: "COPY",
            headers: {
                "Content-Type": "application/json",
                "x-HTTP-method-override": "COPY",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${response.status}\nurl:${response.url}`,
            );
        }

        const data = (await response.json()) as copysessionResults;
        console.log("copy session successful:", data);
        return data;
    } catch (error) {
        console.error("copy session failed:", error);
        throw error;
    }
}
