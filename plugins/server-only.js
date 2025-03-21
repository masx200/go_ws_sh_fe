// plugins/client-only.js
export default function ({ app }, inject) {
    if (import.meta.server) {
        // 在浏览器环境中运行的代码
        if (typeof window == "undefined") {
            //@ts-ignore
            globalThis.window = {};
        }
        if (typeof self == "undefined") {
            //@ts-ignore
            globalThis.self = {};
        }
        if (typeof process == "undefined") {
            //@ts-ignore
            globalThis.process = {};
        }
        // 执行需要使用 self 的操作
    }
}
