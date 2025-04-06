# go_ws_sh_fe

基于websocket的支持多个会话管理的web远程终端

go_ws_sh_fe

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
