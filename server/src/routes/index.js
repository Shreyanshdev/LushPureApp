import pkg from "glob";
import { promisify } from "util";
import { fileURLToPath } from "url";
import path from "path";

const { glob } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const globPromise = promisify(glob);

export const registerRoutes = async (fastify) => {
  // Finds all .js files except index.js and utils.js
  const routeFiles = await globPromise("**/*.js", {
    cwd: __dirname,
    ignore: ["**/index.js", "**/utils.js"],
  });

  for (const file of routeFiles) {
    try {
      const routeModule = await import(path.join(__dirname, file));

      if (typeof routeModule.default !== "function") {
        console.error(`❌ Invalid route export in file: ${file}`);
        console.error(`Export received:`, routeModule.default);
        continue; // Skip this file
      }

      // Register route module as a Fastify plugin
      await fastify.register(routeModule.default);
    } catch (e) {
      console.error(`❌ Error importing route file ${file}:`, e);
      // Optionally: process.exit(1);
    }
  }
};
