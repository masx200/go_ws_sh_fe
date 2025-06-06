import type { listCredentialResults } from "./listCredentialResults";
import { listUrl } from "./listtokens";
export interface listCredentialsInterface {
    authorization: {
        username?: string;
        password?: string;
        token?: string;
        identifier?: string;
        type: string;
    };
    credential?: {
        username?: string;
    };
}
// 新增：获取凭证列表的函数

export async function listcredentials(
    credentials: listCredentialsInterface,
    baseurl = listUrl,
): Promise<listCredentialResults> {
    const url = new URL("/credentials", baseurl).href;
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

        const data = (await response.json()) as listCredentialResults;
        console.log("list credentials successful:", data);
        return data;
    } catch (error) {
        console.error("list credentials failed:", error);
        throw error;
    }
}
