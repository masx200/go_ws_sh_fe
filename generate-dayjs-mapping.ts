import { promises as fs } from "fs";

interface PluginMapping {
    [key: string]: string;
}

async function generateDayjsPluginMapping(
    pluginDir: string,
): Promise<PluginMapping> {
    const mapping: PluginMapping = {};

    try {
        // Read all files in the plugin directory
        const files = await fs.readdir(pluginDir);

        // Filter for .js files (excluding .d.ts files)
        const jsFiles = files.filter(
            (file) => file.endsWith(".js") && !file.endsWith(".d.ts"),
        );

        // Remove .js extension to get plugin name
        const pluginNames = jsFiles.map((file) => file.replace(".js", ""));

        // Generate mapping for each plugin
        for (const pluginName of pluginNames) {
            const cjsPath = `dayjs/plugin/${pluginName}`;
            const esmPath = `dayjs/esm/plugin/${pluginName}/index`;
            mapping[cjsPath] = esmPath;
        }

        return mapping;
    } catch (error) {
        console.error("Error reading plugin directory:", error);
        return {};
    }
}

// Example usage
// const pluginDirectory = 'F:/github/go_ws_sh_fe/node_modules/dayjs/plugin';

// async function main() {
//   const mapping = await generateDayjsPluginMapping(pluginDirectory);
//   console.log(mapping);
// }

export { generateDayjsPluginMapping };
export type { PluginMapping };

// // If this file is run directly, execute the example
// if (require.main === module) {
//   main();
// }
