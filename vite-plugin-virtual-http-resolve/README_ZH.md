# @masx200/vite-plugin-virtual-http-resolve

一个 Vite 插件，可将远程 HTTP/HTTPS 模块解析为虚拟模块，并支持缓存功能。

## 功能特点

- 🚀 将远程 HTTP/HTTPS 模块解析为虚拟模块
- 📦 内置缓存支持（内存和文件系统）
- 🔧 可自定义的获取函数
- 🎯 处理远程模块的相对导入
- 🛡️ Node 模块的变量冲突解析
- ⚡ 通过预处理实现快速高效

## 安装

```bash
npm install @masx200/vite-plugin-virtual-http-resolve
# 或者
yarn add @masx200/vite-plugin-virtual-http-resolve
# 或者
pnpm add @masx200/vite-plugin-virtual-http-resolve
```

## 使用方法

### 基本用法

```javascript
// vite.config.js
import { defineConfig } from "vite";
import virtualHttpResolve from "@masx200/vite-plugin-virtual-http-resolve";

export default defineConfig({
  plugins: [virtualHttpResolve()],
});
```

### 自定义选项

```javascript
// vite.config.js
import { defineConfig } from "vite";
import virtualHttpResolve, {
  FileCache,
} from "@masx200/vite-plugin-virtual-http-resolve";

export default defineConfig({
  plugins: [
    virtualHttpResolve({
      // 使用文件缓存而不是内存缓存
      cache: new FileCache("./custom-cache-folder"),

      // 自定义获取函数
      fetcher: async (url) => {
        const response = await fetch(url);
        if (response.ok) return await response.text();

        throw Error("failed to fetch:" + url);
      },
    }),
  ],
});
```

### 在代码中使用

```javascript
// 从远程 HTTP/HTTPS URL 导入
import React from "virtual:https://esm.sh/react@18.2.0";
import ReactDOM from "virtual:https://esm.sh/react-dom@18.2.0";

// 插件会自动处理这些远程模块的相对导入
```

## API

### `virtualHttpResolve(options?)`

#### 选项

- **`cache`** (`CacheType`) - 用于存储获取模块的缓存实现。默认为内存缓存。
- **`fetcher`** `(url: string) => Promise<string>` - 用于 HTTP
  请求的自定义获取函数。

### `CacheType` 接口

```typescript
interface CacheType {
  has(key: string): Promise<boolean> | boolean;
  set(key: string, value: string): Promise<any> | any;
  get(key: string): Promise<string | undefined> | string | undefined;
}
```

### `FileCache`

基于文件系统的缓存实现。

```typescript
const cache = new FileCache(cacheFolder?: string)
```

## 工作原理

1. **虚拟模块解析**：将 HTTP/HTTPS URL 转换为虚拟模块（`virtual:https://...`）
2. **相对导入处理**：解析远程模块的相对导入
3. **缓存**：存储获取的模块以避免重复请求
4. **变量冲突解析**：自动解析 Node 模块中的变量名冲突
5. **预处理**：处理特殊情况，如 chunk 文件和 Skypack 风格的重定向

## 许可证

MIT
