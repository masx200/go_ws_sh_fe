# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Codebase Overview

This is a Nuxt 4 based frontend for a WebSocket-based remote terminal management
system with multiple session support. The application provides:

- Terminal interface using xterm.js
- WebSocket communication with backend
- Session management (create, edit, delete, copy, move sessions)
- User management (create users, modify passwords)
- Token management
- PWA (Progressive Web App) support

## Key Technologies

- **Framework**: Nuxt 4 (SSR enabled)
- **UI Library**: Element Plus, Ant Design Vue
- **Terminal**: xterm.js with various addons (canvas, clipboard, fit, image,
  etc.)
- **Data Storage**: Dexie (IndexedDB)
- **Build Tool**: Vite
- **Package Manager**: Yarn 4

## Development Commands

```bash
# Install dependencies
yarn install

# Development server
yarn dev

# Build for production
pnpm run build

# Generate static site
pnpm run generate

# Preview production build
yarn preview

# Run tests
yarn test

# Format code
yarn format

# Update auto imports after adding dependencies
yarn postinstall
```

## Code Style & Formatting

- **Tab Width**: 4 spaces
- **Quotes**: Double quotes (not single)
- **Formatters**: Prettier
- **Linting**: No explicit linter configured - use `yarn format` for formatting

## Key File Structure

### Pages (`/pages/`)

- `index.vue` - Home/page routing
- `login.vue` - User authentication
- `manage.vue` - Management interface
- `shell.vue` - Terminal session interface

### Source (`/src/`)

- API functions (`*.ts`) for backend operations
- Vue components (`*.vue`) for UI components
- Protocol handling (`wsmsg.ts`) - WebSocket message definitions

### Configuration

- `nuxt.config.ts` - Nuxt configuration with PWA, Element Plus, and styling
  setup
- `package.json` - Dependencies and scripts
- `.prettierrc.json` - Code formatting rules

## Testing

- Test framework: Vitest
- Test files located in `/password-hashed/` directory
- Run all tests: `yarn test`

## Build & Deployment

- Static site generation: `pnpm run generate`
- Output directory: `./.output/public/`
- Production build: `pnpm run build`
- Serve locally: `yarn preview`

## Backend Integration

- WebSocket protocol defined in `wsmsg.proto`
- API documentation in `/go-ws-sh-api/`
- Uses protobuf for message serialization

## Important Notes

- The application is SSR-enabled (server-side rendering)
- PWA features with auto-update functionality
- Uses both server-only and client-only plugins
- Authentication and session management are key features
- Terminal functionality uses xterm.js with zmodem support for file transfers
