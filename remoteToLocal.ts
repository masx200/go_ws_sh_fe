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

            if (importer && isHttpVirtualProtocol(importer)) {
                if ((id.startsWith("/node/") || id.startsWith("/avsc@")) && id.endsWith(".mjs")) {
                    const baseUrl = importer.replace("virtual:", "");
                    const nodeModuleUrl = new URL(id, baseUrl);
                    return "virtual:" + nodeModuleUrl.href;
                }

                if (id.startsWith("./chunk-") && id.endsWith(".mjs")) {
                    const baseUrl = importer.replace("virtual:", "");
                    const chunkUrl = new URL(id, baseUrl);
                    return "virtual:" + chunkUrl.href;
                }
            }
        },
        async load(id: string) {
            if (isHttpVirtualProtocol(id)) console.log("Loading id:", id);
            if (id !== resolvedId && !isHttpVirtualProtocol(id)) return null;

            if (moduleCache.has(id)) {
                return moduleCache.get(id);
            }

            let urlToFetch = id;
            if (id === resolvedId) {
                urlToFetch = remoteUrlhttp;
            } else {
                urlToFetch = id.replace("virtual:", "");
            }

            try {
                const { data } = await axios.get(urlToFetch, {
                    headers: {
                        Accept: "application/javascript",

                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
                    },
                });

                let processedData = data;

                if (id.includes("/node/")) {
                    console.log(`Processing ${id} to fix variable conflicts`);
                    const nodeParts = id.split("/node/");
                    if (nodeParts.length > 1) {
                        const modulePart = nodeParts[1];
                        if (modulePart) {
                            const moduleNameParts = modulePart.split(".mjs");
                            if (moduleNameParts.length > 0) {
                                let moduleName = moduleNameParts[0];
                                if (moduleName && moduleName.includes("chunk-")) {
                                    moduleName = "chunk";
                                }

                                processedData = data.replace(/var h=/g, `var h_${moduleName}=`);
                                processedData = processedData.replace(/function h\(/g, `function h_${moduleName}(`);
                                processedData = processedData.replace(/,h=/g, `,h_${moduleName}=`);
                                processedData = processedData.replace(/function e\(/g, `function e_${moduleName}(`);
                                processedData = processedData.replace(/,e\(/g, `,e_${moduleName}(`);
                            }
                        }
                    }
                }

                moduleCache.set(id, processedData);
                return processedData;
            } catch (error) {
                console.error(
                    `[vite-plugin]  Failed to fetch ${urlToFetch}:`,
                    error,
                );
                throw new Error(`Remote module load failed: ${urlToFetch}`);
            }
        },
    };
}
