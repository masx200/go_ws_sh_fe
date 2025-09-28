# @masx200/vite-plugin-virtual-http-resolve

A Vite plugin that resolves remote HTTP/HTTPS modules to virtual modules with
caching support.

## Features

- 🚀 Resolves remote HTTP/HTTPS modules as virtual modules
- 📦 Built-in caching (memory and file system)
- 🔧 Customizable fetcher function
- 🎯 Handles relative imports from remote modules
- 🛡️ Variable conflict resolution for node modules
- ⚡ Fast and efficient with pre-processing

## Installation

```bash
npm install @masx200/vite-plugin-virtual-http-resolve
# or
yarn add @masx200/vite-plugin-virtual-http-resolve
# or
pnpm add @masx200/vite-plugin-virtual-http-resolve
```

## Usage

### Basic Usage

```javascript
// vite.config.js
import { defineConfig } from "vite";
import virtualHttpResolve from "@masx200/vite-plugin-virtual-http-resolve";

export default defineConfig({
  plugins: [virtualHttpResolve()],
});
```

### With Custom Options

```javascript
// vite.config.js
import { defineConfig } from "vite";
import virtualHttpResolve, {
  FileCache,
} from "@masx200/vite-plugin-virtual-http-resolve";

export default defineConfig({
  plugins: [
    virtualHttpResolve({
      // Use file cache instead of memory cache
      cache: new FileCache("./custom-cache-folder"),

      // Custom fetcher function
      fetcher: async (url) => {
        const response = await fetch(url);
        if (response.ok) return await response.text();

        throw Error("failed to fetch:" + url);
      },
    }),
  ],
});
```

### In Your Code

```javascript
// Import from remote HTTP/HTTPS URL
import React from "virtual:https://esm.sh/react@18.2.0";
import ReactDOM from "virtual:https://esm.sh/react-dom@18.2.0";

// The plugin will automatically handle relative imports
// from these remote modules
```

## API

### `virtualHttpResolve(options?)`

#### Options

- **`cache`** (`CacheType`) - Cache implementation for storing fetched modules.
  Defaults to in-memory cache.
- **`fetcher`** `(url: string) => Promise<string>` - Custom fetcher function for
  HTTP requests.

### `CacheType` Interface

```typescript
interface CacheType {
  has(key: string): Promise<boolean> | boolean;
  set(key: string, value: string): Promise<any> | any;
  get(key: string): Promise<string | undefined> | string | undefined;
}
```

### `FileCache`

A file system-based cache implementation.

```typescript
const cache = new FileCache(cacheFolder?: string)
```

## How It Works

1. **Virtual Module Resolution**: Converts HTTP/HTTPS URLs to virtual modules
   (`virtual:https://...`)
2. **Relative Import Handling**: Resolves relative imports from remote modules
3. **Caching**: Stores fetched modules to avoid repeated requests
4. **Variable Conflict Resolution**: Automatically resolves variable name
   conflicts in node modules
5. **Pre-processing**: Handles special cases like chunk files and Skypack-style
   redirects

## License

MIT
