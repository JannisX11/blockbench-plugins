import fs from "node:fs";
import path from "node:path";

const OUTPUT_DIR = "../../plugins/mcp";
const entryFile = path.resolve("./index.ts");

async function main() {
  console.log("🏗️ Building MCP plugin with Bun...");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Build the plugin
  const result = await Bun.build({
    entrypoints: [entryFile],
    outdir: OUTPUT_DIR,
    target: "node",
    format: "cjs",
    sourcemap: "external",
    external: [
      //   "express",
      //     "zod",
      //     "@modelcontextprotocol/*"
    ],
    minify: process.env.NODE_ENV === "production",
  });

  if (!result.success) {
    console.error("❌ Build failed:");
    for (const message of result.logs) {
      console.error(message);
    }
    process.exit(1);
  }

  const iconSource = path.resolve("./icon.svg");
  const iconDest = path.join(OUTPUT_DIR, "icon.svg");

  if (fs.existsSync(iconSource)) {
    fs.copyFileSync(iconSource, iconDest);
    console.log("📁 Copied icon.svg");
  }

  const indexFile = path.join(OUTPUT_DIR, "index.js");
  const mcpFile = path.join(OUTPUT_DIR, "mcp.js");

  if (fs.existsSync(indexFile)) {
    fs.renameSync(indexFile, mcpFile);
    console.log("📁 Renamed index.js to mcp.js");
  }

  // Rename the sourcemap file
  const indexMapFile = path.join(OUTPUT_DIR, "index.js.map");
  const mcpMapFile = path.join(OUTPUT_DIR, "mcp.js.map");

  if (fs.existsSync(indexMapFile)) {
    fs.renameSync(indexMapFile, mcpMapFile);
    console.log("📁 Renamed index.js.map to mcp.js.map");
  }

  // Copy the README file
  const readmeSource = path.resolve("./README.md");
  const readmeDest = path.join(OUTPUT_DIR, "README.md");
  if (fs.existsSync(readmeSource)) {
    fs.copyFileSync(readmeSource, readmeDest);
    console.log("📁 Copied README.md");
  }

  console.log(`✅ Build completed successfully! Output in ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("💥 Build error:", err);
  process.exit(1);
});
