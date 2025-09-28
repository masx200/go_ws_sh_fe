import type { Plugin } from "vite";
import axios from "axios";
function isHttpVirtualProtocol(id: string | undefined | null) {
    return (
        id?.startsWith("virtual:http://") || id?.startsWith("virtual:https://")
    );
}
// 内存缓存避免重复请求
const moduleCache = new Map<string, string>();

export default function remoteToLocal(): Plugin {
    const remoteUrlvirtual = "virtual:https://esm.sh/avsc@5.7.9/";
    const virtualModuleId = "virtual:https://esm.sh/avsc@5.7.9/";
    let remoteUrlhttp = "https://esm.sh/avsc@5.7.9/";
    const resolvedId = `${virtualModuleId}`;

    return {
        name: "remote-to-local",
        resolveId(id: string, importer?: string) {
            if (
                id.startsWith("virtual:http://") ||
                importer?.startsWith("virtual:http://") ||
                id.startsWith("virtual:https://") ||
                importer?.startsWith("virtual:https://")
            ) {
                console.log("Resolving id:", id, "importer:", importer);
            }
            if (id === remoteUrlvirtual) return resolvedId;

            if (isHttpVirtualProtocol(id)) {
                if (importer) {
                    const importerUrl = new URL(id, importer);
                    return "virtual:" + importerUrl.href;
                } else return id;
            }
        },
        async load(id: string) {
            if (isHttpVirtualProtocol(id)) console.log("Loading id:", id);
            if (id !== resolvedId) return null;

            if (moduleCache.has(remoteUrlhttp)) {
                return moduleCache.get(remoteUrlhttp);
            }

            try {
                const { data } = await axios.get(remoteUrlhttp, {
                    headers: {
                        Accept: "application/javascript",

                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
                    },
                });
                moduleCache.set(remoteUrlhttp, data);
                return data;
            } catch (error) {
                console.error(
                    `[vite-plugin]  Failed to fetch ${remoteUrlhttp}:`,
                    error,
                );
                throw new Error(`Remote module load failed: ${remoteUrlhttp}`);
            }
        },
    };
}
