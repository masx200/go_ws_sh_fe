import type { Plugin } from "vite";
import axios from "axios";

// 内存缓存避免重复请求
const moduleCache = new Map<string, string>();

export default function remoteToLocal(): Plugin {
    const remoteUrlvirtual = "virtual:https://esm.sh/avsc@5.7.9/";
    const virtualModuleId = "virtual:avsc";
    const resolvedId = `\0${virtualModuleId}`;

    return {
        name: "remote-to-local",
        resolveId(id: string) {
            if (id === remoteUrlvirtual) return resolvedId;
        },
        async load(id: string) {
            if (id !== resolvedId) return null;
            let remoteUrlhttp = "https://esm.sh/avsc@5.7.9/";

            if (moduleCache.has(remoteUrlhttp)) {
                return moduleCache.get(remoteUrlhttp);
            }

            try {
                const { data } = await axios.get(remoteUrlhttp, {
                    headers: { Accept: "application/javascript" },
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
