export const MOVEsessionUrl = "http://localhost:28080/";

// 定义删除会话请求体的接口
export interface MOVEsessionCredentialsInterface {
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
export interface MOVEsessionResults {
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
export async function MOVEsession(
    credentials: MOVEsessionCredentialsInterface,
    baseurl = MOVEsessionUrl,
): Promise<MOVEsessionResults> {
    const url = new URL("/sessions", baseurl).href;

    try {
        const response = await fetch(url, {
            method: "MOVE",
            headers: {
                "Content-Type": "application/json",
                "x-HTTP-method-override": "MOVE",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${response.status}\nurl:${response.url}`,
            );
        }

        const data = (await response.json()) as MOVEsessionResults;
        console.log("MOVE session successful:", data);
        return data;
    } catch (error) {
        console.error("MOVE session failed:", error);
        throw error;
    }
}
