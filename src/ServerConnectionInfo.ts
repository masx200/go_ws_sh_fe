import Dexie, { type EntityTable } from "dexie";
export type { ServerConnectionInfo as ServerConnectionInfo };
interface ServerConnectionInfo {
    id: number;
    server: string;
    token: string;
    username: string;
}
export function createTableServerConnectionInfo() {
    const db = new Dexie("GO-WS-SH-Database") as Dexie & {
        ServerConnectionInfo: EntityTable<
            ServerConnectionInfo,
            "id" // primary key "id" (for the typings only)
        >;
    };

    // Schema declaration:
    db.version(1).stores({
        ServerConnectionInfo: "++id, username, token,server", // primary key "id" (for the runtime!)
    });
    return db.ServerConnectionInfo;
}
export async function updateOrAddIntoTableServerInfo({
    server,
    token,
    username,
}: {
    server: string;
    token: string;
    username: string;
}) {
    const { serverinfo, tableserver } = await fetchServerInfoServer(server);
    if (serverinfo.length) {
        const n = await tableserver.bulkUpdate(
            serverinfo.map((item) => {
                return {
                    key: item.id,
                    changes: {
                        username: username,
                        server: server,
                        token: token,
                    },
                };
            }),
        );
        console.log("update success count", n);
    } else {
        const id = await tableserver.add({
            username: username,
            server: server,
            token: token,
        });
        console.log("add success id", id);
    }
}

export async function TableServerInfoDeleteAll() {
    const tableserver = createTableServerConnectionInfo();
    await tableserver.clear();
}
export async function fetchServerInfoServer(server: string) {
    const tableserver = createTableServerConnectionInfo();
    const serverinfo = await tableserver.where({ server: server }).toArray();
    return { serverinfo, tableserver };
}
export async function fetchServerInfoAll() {
    const tableserver = createTableServerConnectionInfo();
    const serverinfo = await tableserver.toArray();
    return { serverinfo, tableserver };
}
