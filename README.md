# go_ws_sh_fe

基于 WebSocket 的支持多会话管理的 Web 远程终端前端项目

## 项目简介

go_ws_sh_fe 是一个基于 Nuxt 3 构建的 Web 远程终端前端项目，通过 WebSocket
与后端进行通信，支持多个会话的管理和控制。

**后端项目地址**: https://github.com/masx200/go_ws_sh

## 主要特性

- 🖥️ **终端功能**: 基于 xterm.js 的完整终端体验
- 🔗 **实时通信**: WebSocket 双向实时通信
- 👥 **多会话管理**: 支持创建、编辑、删除、复制、移动会话
- 👤 **用户管理**: 用户创建、密码修改功能
- 🔐 **令牌管理**: API 令牌的创建和管理
- 📱 **PWA 支持**: 渐进式 Web 应用，支持离线使用
- 🎨 **现代化 UI**: 使用 Element Plus 和 Ant Design Vue 构建界面
- ⚡ **高性能**: Nuxt 3 SSR + Vite 构建

## 编译前端网页

```shell
npm run generate
```

复制dist目录下的内容到静态服务器目录下

```bash
cp -rfv ./.output/public/* /path_to_static/go-ws-sh-fe/
```

```powershell
Copy-Item -Path ".\.output\public/*" -Destination "/path_to_static\go-ws-sh-fe" -Recurse -Force -v
```

## 使用caddy部署静态网页

```caddyfile
:60001 {
	encode zstd gzip
	file_server
	root * "\path_to_static\go-ws-sh-fe"
}
```

```bash
caddy run --config Caddyfile --adapter caddyfile
```

# Nuxt Minimal Starter

Look at the
[Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to
learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the
[deployment documentation](https://nuxt.com/docs/getting-started/deployment) for
more information.

## 鸣谢

https://github.com/tsl0922/ttyd

https://github.com/FGasper/zmodemjs

## 构建protobuf文件

```shell
protoc --plugin=node_modules/ts-proto/node_modules/.bin/protoc-gen-ts_proto.CMD --ts_proto_out=./src/ wsmsg.proto
```
