export interface deleteCredentialsInterface {
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

export async function deleteToken(
    credentials: deleteCredentialsInterface,
    baseurl: string,
    identifier: string,
): Promise<typeof deleteresult> {
    const url = new URL("/tokens", baseurl).href;
    try {
        const init: RequestInit = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " +
                    btoa(JSON.stringify(credentials.authorization)),
            },
            body: JSON.stringify({
                token: { identifier },
                authorization: credentials.authorization,
            }),
        };
        const response = await fetch(url, init);

        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${response.status}\nurl:${response.url}`,
            );
        }

        const data = await response.json();
        console.log("delete token successful:", data);
        return data;
    } catch (error) {
        console.error("delete token failed:", error);
        throw error;
    }
}
const deleteresult = {
    message: "Token deleted successfully",
    token: { identifier: "1904548698307932160", username: "admin" },
    username: "admin",
};
