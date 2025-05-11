import type { Tool, ToolParameters } from "fastmcp";
import type { IMCPTool } from "@/types";
import { server } from "@/server";

/**
 * User-visible list of tool details.
 */
export const tools: Record<
  string,
  IMCPTool
> = {};

/**
 * Creates a new MCP tool and adds it to the server.
 * @param tool - The tool to add.
 * @param tool.name - The name of the tool.
 * @param tool.description - The description of the tool.
 * @param tool.annotations - Annotations for the tool.
 * @param tool.parameters - The parameters for the tool.
 * @param tool.execute - The function to execute when the tool is called.
 * @param enabled - Whether the tool is enabled.
 * @returns - The created tool.
 * @throws - If a tool with the same name already exists.
 * @example
 * ```ts
 * createTool({
 *   name: "my_tool",
 *   description: "My tool description for the AI to read.",
 *   annotations: {
 *     title: "My tool description for the Human to read.",
 *     destructiveHint: true,
 *     openWorldHint: true,
 *   },
 *   parameters: z.object({
 *     name: z.string(),
 *   }),
 *   async execute({ name }) {
 *     console.log(`Hello, ${name}!`);
 *   },
 * });
 * ```
 */
export function createTool<T extends ToolParameters>(
    tool: Tool<undefined, T>,
    enabled = true
) {
  if (tools[tool.name]) {
    throw new Error(`Tool with name "${tool.name}" already exists.`);
  }

  server.addTool(tool);

  tools[tool.name] = {
    name: tool.name,
    description: tool.annotations?.title ?? tool.description ?? `${tool.name} tool`,
    enabled
  };

  return tools[tool.name];
}
