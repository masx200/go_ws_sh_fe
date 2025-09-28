# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Codebase Overview

This is a Vite plugin that resolves remote HTTP/HTTPS modules as virtual modules
with caching support. The plugin allows developers to import modules directly
from remote URLs using the `virtual:` prefix.

## Key Technologies

- **Framework**: Vite plugin system
- **Language**: TypeScript
- **Dependencies**: axios (HTTP client), fs-extra (file system utilities)
- **Build Tool**: Vite with Rollup
- **Package Manager**: npm/yarn/pnpm

## Development Commands

```bash
# Install dependencies
npm install

# Development build with watch mode
npm run dev

# Production build
npm run build

# Build before publishing
npm run prepublishOnly
```

## Architecture

### Core Plugin (`src/index.ts`)

The main plugin implementation with these key components:

1. **FileCache Class**: File system-based cache implementation using SHA-512
   hashing
2. **Memory Cache**: In-memory Map-based cache (default)
3. **Plugin Logic**:
   - `resolveId`: Converts HTTP/HTTPS URLs to virtual modules and handles
     relative imports
   - `load`: Fetches remote content with caching and post-processing

### Virtual Module Resolution

The plugin handles several import patterns:

- Direct HTTP/HTTPS URLs → `virtual:https://...`
- Relative imports from virtual modules
- Node modules (`/node/` paths)
- Chunk files (`./chunk-*.mjs`)
- Skypack-style redirects (`/-/package@version/...`)

### Caching Strategy

- **Default**: In-memory cache (Map)
- **Alternative**: FileCache using user's home directory (`~/cache/fetch`)
- **Custom**: Implement CacheType interface for custom caching

### Variable Conflict Resolution

Special handling for node modules to prevent variable name conflicts by renaming
common variables like `h` to module-specific names.

## Build Configuration

The build outputs multiple formats:

- ES Module: `dist/index.mjs`
- CommonJS: `dist/index.js`
- TypeScript declarations: `dist/index.d.ts`

External dependencies include Vite, axios, and Node.js built-in modules.

## Important Notes

- Plugin uses `enforce: "pre"` to run before other plugins
- Handles URL normalization for virtual protocols
- Includes comprehensive error handling for remote module loading
- Supports custom fetcher functions for specialized HTTP needs
