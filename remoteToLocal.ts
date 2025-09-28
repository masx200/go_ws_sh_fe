import type { Plugin } from "vite";

import { createHash } from "node:crypto";
import fse from "fs-extra";
import { homedir } from "node:os";
import path from "node:path";

export class fileCache implements CacheType {
    #cacheFolder: string;
    has(key: string): Promise<boolean> | boolean {
        const filepath = this.#getCachePath(key);
        return fse.exists(filepath);
    }
    constructor(cacheFolder?: string) {
        this.#cacheFolder = path.join(homedir(), "cache", "fetch");
        if (cacheFolder) this.#cacheFolder = cacheFolder;

        // 确保缓存目录存在
        fse.ensureDirSync(this.#cacheFolder);
    }

    #getCachePath(key: string) {
        const hash = createHash("sha512");
        hash.update(key);
        const filename = hash.digest("base64");
        return path.join(this.#cacheFolder, filename);
    }
    async set(key: string, value: string) {
        const filepath = this.#getCachePath(key);
        await fse.ensureFile(filepath);
        return await fse.writeFile(filepath, value, { encoding: "utf-8" });
    }
    async get(key: string) {
        const filepath = this.#getCachePath(key);
        if (!fse.exists(filepath)) {
            return;
        }
        await fse.ensureFile(filepath);

        return await fse.readFile(filepath, "utf-8");
    }
}

import axios from "axios";
function isHttpVirtualProtocol(id: string | undefined | null) {
    return (
        id?.startsWith("virtual:http://") || id?.startsWith("virtual:https://")
    );
}
export interface CacheType {
    has(key: string): Promise<boolean> | boolean;
    set(key: string, value: string): Promise<any> | any;
    get(key: string): Promise<string | undefined> | string | undefined;
}

// 内存缓存避免重复请求
const cacheMemory = new Map<string, string>();
export type HttpResolveOptions = {
    cache?: CacheType;
    fetcher?: (url: string) => Promise<string>;
};
export default function remoteToLocal(
    options: HttpResolveOptions = {},
): Plugin {
    const {
        cache = cacheMemory,
        fetcher = async (urlToFetch): Promise<string> => {
            const { data } = await axios.get(urlToFetch, {
                headers: {
                    Accept: "application/javascript",

                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
                },
            });
            return data;
        },
    } = options;
    const remoteUrlvirtual = "virtual:https://esm.sh/avsc@5.7.9/";
    const virtualModuleId = "virtual:https://esm.sh/avsc@5.7.9/";
    let remoteUrlhttp = "https://esm.sh/avsc@5.7.9/";
    const resolvedId = `${virtualModuleId}`;
    function resolveId(id: string, importer?: string) {
        if (
            importer?.startsWith("http://") ||
            importer?.startsWith("https://")
        ) {
            return null;
        }
        if (id.startsWith("http://") || id.startsWith("https://")) {
            return null;
        }
        // If already a virtual HTTP/HTTPS protocol, return as-is
        if (isHttpVirtualProtocol(id)) {
            return id;
        }

        // Handle the specific remote URL case
        if (id === remoteUrlvirtual) return resolvedId;

        // Handle regular HTTP/HTTPS URLs - convert to virtual protocol

        // Handle relative imports when importer is a virtual HTTP/HTTPS URL
        if (importer && isHttpVirtualProtocol(importer)) {
            const baseUrl = importer.replace("virtual:", "");

            // Handle node modules and avsc modules
            if (
                (id.startsWith("/node/") || id.startsWith("/avsc@")) &&
                id.endsWith(".mjs")
            ) {
                const nodeModuleUrl = new URL(id, baseUrl);
                return "virtual:" + nodeModuleUrl.href;
            }

            // Handle chunk files
            if (id.startsWith("./chunk-") && id.endsWith(".mjs")) {
                const chunkUrl = new URL(id, baseUrl);
                return "virtual:" + chunkUrl.href;
            }

            // Handle Skypack-style redirects (like /-/jquery@v3.7.1-7rUWvYxyB0VFidIbWTia/dist=es2019,mode=imports/optimized/jquery.js)
            if (id.startsWith("/-/") && id.includes("@")) {
                const resolvedUrl = new URL(id, baseUrl);
                return "virtual:" + resolvedUrl.href;
            }

            // Handle any other relative imports
            if (
                id.startsWith("./") ||
                id.startsWith("../") ||
                id.startsWith("/")
            ) {
                const resolvedUrl = new URL(id, baseUrl);
                return "virtual:" + resolvedUrl.href;
            }
        }

        return null;
    }
    return {
        name: "remote-to-local",
        resolveId(id: string, importer?: string) {
            if (importer?.startsWith("virtual:https:/"))
                console.log("resolveId", { id, importer });
            if (id.startsWith("virtual:https:/"))
                console.log("resolveId", { id, importer });
            if (id.startsWith("virtual:https:/")) {
                id = id
                    .replaceAll("virtual:https:/", "virtual:https://")
                    .replaceAll("virtual:https:///", "virtual:https://");
            }

            if (importer?.startsWith("virtual:https:/")) {
                importer = importer?.replaceAll("virtual:https:/", "virtual:https://")
                    .replaceAll("virtual:https:///", "virtual:https://");
            }
            const result = resolveId(id, importer);
            if (result) {
                // Handle virtual URLs
                if (result.startsWith("virtual:https:/")) {
                    return result
                        .replaceAll("virtual:https:/", "virtual:https://")
                        .replaceAll("virtual:https:///", "virtual:https://");
                }
                return result;
            }
            return null;
        },
        async load(id: string) {
            if (id.startsWith("virtual:https:/")) console.log("load", { id });

            if (id.startsWith("virtual:https:/")) {
                id = id
                    .replaceAll("virtual:https:/", "virtual:https://")
                    .replaceAll("virtual:https:///", "virtual:https://");
            }
            if (id.startsWith("http://") || id.startsWith("https://")) {
                return null;
            }
            // if (isHttpVirtualProtocol(id)) console.log("Loading id:", id);
            if (id !== resolvedId && !isHttpVirtualProtocol(id)) return null;

            if (await cache.has(id)) {
                return await cache.get(id);
            }

            let urlToFetch = id;
            if (id === resolvedId) {
                urlToFetch = remoteUrlhttp;
            } else {
                urlToFetch = id.replace("virtual:", "");
            }

            try {
                let processedData: string | undefined = undefined;

                if (fetcher) {
                    processedData = await fetcher(urlToFetch);
                } else {
                    const { data } = await axios.get(urlToFetch, {
                        headers: {
                            Accept: "application/javascript",

                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
                        },
                    });

                    processedData = data;
                }
                if (!processedData) {
                    throw new Error(`No data fetched from ${urlToFetch}`);
                }

                if (id.includes("/node/")) {
                    // console.log(`Processing ${id} to fix variable conflicts`);
                    const nodeParts = id.split("/node/");
                    if (nodeParts.length > 1) {
                        const modulePart = nodeParts[1];
                        if (modulePart) {
                            const moduleNameParts = modulePart.split(".mjs");
                            if (moduleNameParts.length > 0) {
                                let moduleName = moduleNameParts[0];
                                if (
                                    moduleName &&
                                    moduleName.includes("chunk-")
                                ) {
                                    moduleName = "chunk";
                                }

                                processedData = processedData.replace(
                                    /var h=/g,
                                    `var h_${moduleName}=`,
                                );
                                if (!processedData) {
                                    throw new Error(
                                        `No data fetched from ${urlToFetch}`,
                                    );
                                }
                                processedData = processedData.replace(
                                    /function h\(/g,
                                    `function h_${moduleName}(`,
                                );
                                processedData = processedData.replace(
                                    /,h=/g,
                                    `,h_${moduleName}=`,
                                );
                                processedData = processedData.replace(
                                    /function e\(/g,
                                    `function e_${moduleName}(`,
                                );
                                processedData = processedData.replace(
                                    /,e\(/g,
                                    `,e_${moduleName}(`,
                                );
                            }
                        }
                    }
                }

                await cache.set(id, processedData);
                return processedData;
            } catch (error) {
                // console.error(
                //     `[vite-plugin]  Failed to fetch ${urlToFetch}:`,
                //     error,
                // );
                throw new Error(
                    `Remote module load failed: ${urlToFetch}\n` +
                    String(error),
                    { cause: error },
                );
            }
        },
    };
}
