export interface listCredentialsInterface {
    authorization: {
        username?: string;
        password?: string;
        token?: string;
        identifier?: string;
        type: string;
    };
}
export async function updateTokenDescription(
    credentials: listCredentialsInterface,
    baseurl: string,
    identifier: string,
    description: string,
    username: string,
): Promise<typeof updateresult> {
    const url = new URL("/tokens", baseurl).href;
    try {
        const init: RequestInit = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " +
                    btoa(JSON.stringify(credentials.authorization)),
            },
            body: JSON.stringify({
                token: { identifier, description, username: username },
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
        console.log("update token description successful:", data);
        return data;
    } catch (error) {
        console.error("update token description failed:", error);
        throw error;
    }
}
const updateresult = {
    message: "Token deleted successfully",
    token: { identifier: "1904548698307932160", username: "admin" },
    username: "admin",
};
