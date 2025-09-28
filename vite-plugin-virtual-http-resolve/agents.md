# agents.md

此文件为在此代码库中工作时为 AI 智能体提供指导。

## 代码库概述

这是一个 Vite 插件，可将远程 HTTP/HTTPS
模块解析为虚拟模块，并支持缓存功能。该插件允许开发者使用 `virtual:`
前缀直接从远程 URL 导入模块。

## 核心技术

- **框架**: Vite 插件系统
- **语言**: TypeScript
- **依赖**: axios (HTTP 客户端), fs-extra (文件系统工具)
- **构建工具**: Vite with Rollup
- **包管理器**: npm/yarn/pnpm

## 开发命令

```bash
# 安装依赖
npm install

# 开发构建（监听模式）
npm run dev

# 生产构建
npm run build

# 发布前构建
npm run prepublishOnly
```

## 架构

### 核心插件 (`src/index.ts`)

主要插件实现包含以下关键组件：

1. **FileCache 类**: 基于 SHA-512 哈希的文件系统缓存实现
2. **内存缓存**: 基于 Map 的内存缓存（默认）
3. **插件逻辑**:
   - `resolveId`: 将 HTTP/HTTPS URL 转换为虚拟模块并处理相对导入
   - `load`: 获取远程内容并进行缓存和后处理

### 虚拟模块解析

插件处理多种导入模式：

- 直接 HTTP/HTTPS URL → `virtual:https://...`
- 来自虚拟模块的相对导入
- Node 模块 (`/node/` 路径)
- Chunk 文件 (`./chunk-*.mjs`)
- Skypack 风格重定向 (`/-/package@version/...`)

### 缓存策略

- **默认**: 内存缓存 (Map)
- **替代方案**: 使用用户主目录的 FileCache (`~/cache/fetch`)
- **自定义**: 实现 CacheType 接口进行自定义缓存

### 变量冲突解析

对 Node 模块进行特殊处理，通过将通用变量（如
`h`）重命名为模块特定名称来防止变量名冲突。

## 构建配置

构建输出多种格式：

- ES 模块: `dist/index.mjs`
- CommonJS: `dist/index.js`
- TypeScript 声明: `dist/index.d.ts`

外部依赖包括 Vite、axios 和 Node.js 内置模块。

## 重要说明

- 插件使用 `enforce: "pre"` 在其他插件之前运行
- 处理虚拟协议的 URL 标准化
- 包含远程模块加载的全面错误处理
- 支持自定义获取函数以满足特殊 HTTP 需求
