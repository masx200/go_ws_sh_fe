import { defineConfig } from "vite";
import { resolve } from "path";
import cleanup from "rollup-plugin-cleanup";
export default defineConfig({
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VirtualHttpResolve",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      plugins: [
        // 专业删除注释的插件
        cleanup({
          comments: "none", // 删除所有注释
          extensions: ["js", "ts", "jsx", "tsx", "css"], // 处理的文件类型
        }),
      ],
      external: [
        "vite",
        "axios",
        "fs-extra",
        "node:os",
        "node:crypto",
        "node:path",
      ],
      output: {
        "exports": "named",
        globals: {
          vite: "vite",
          axios: "axios",
          "fs-extra": "fsExtra",
        },
      },
    },
  },
});
