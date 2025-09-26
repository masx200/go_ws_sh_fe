# 代理使用指南

此文件为 Claude Code (claude.ai/code) 提供在此代码库中工作时的指导信息。

## 代码库概述

这是一个基于 Nuxt 3 的 WebSocket
远程终端管理系统前端应用，支持多会话管理。该应用提供：

- 使用 xterm.js 的终端界面
- 与后端的 WebSocket 通信
- 会话管理（创建、编辑、删除、复制、移动会话）
- 用户管理（创建用户、修改密码）
- Token 管理
- PWA（渐进式 Web 应用）支持

## 关键技术

- **框架**: Nuxt 3（支持 SSR）
- **UI 库**: Element Plus, Ant Design Vue
- **终端**: xterm.js 及多个插件（canvas、clipboard、fit、image 等）
- **数据存储**: Dexie（IndexedDB）
- **构建工具**: Vite
- **包管理器**: Yarn 4

## 开发命令

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 生产环境构建
npm run build

# 生成静态站点
npm run generate

# 预览生产构建
npm run preview

# 运行测试
npm run test

# 代码格式化
npm run format

# 添加依赖后更新自动导入
npm run postinstall
```

## 代码风格与格式化

- **缩进宽度**: 4 个空格
- **引号**: 双引号（不使用单引号）
- **格式化工具**: Prettier
- **代码检查**: 无显式配置检查器 - 使用 `npm run format` 进行格式化

## 主要文件结构

### 页面文件 (`/pages/`)

- `index.vue` - 首页/路由页
- `login.vue` - 用户认证
- `manage.vue` - 管理界面
- `shell.vue` - 终端会话界面

### 源代码 (`/src/`)

- API 函数 (`*.ts`) - 后端操作
- Vue 组件 (`*.vue`) - UI 组件
- 协议处理 (`wsmsg.ts`) - WebSocket 消息定义

### 配置文件

- `nuxt.config.ts` - Nuxt 配置，包含 PWA、Element Plus 和样式设置
- `package.json` - 依赖项和脚本
- `.prettierrc.json` - 代码格式化规则

## 测试

- 测试框架: Vitest
- 测试文件位于 `/password-hashed/` 目录
- 运行所有测试: `npm run test`

## 构建与部署

- 静态站点生成: `npm run generate`
- 输出目录: `./.output/public/`
- 生产环境构建: `npm run build`
- 本地服务: `npm run preview`

## 后端集成

- WebSocket 协议定义在 `wsmsg.proto`
- API 文档在 `/go-ws-sh-api/`
- 使用 protobuf 进行消息序列化

## 重要说明

- 应用支持服务端渲染（SSR）
- 具有自动更新功能的 PWA 特性
- 同时使用服务器端和客户端插件
- 认证和会话管理是关键功能
- 终端功能使用 xterm.js，支持 zmodem 文件传输以便文件传输
