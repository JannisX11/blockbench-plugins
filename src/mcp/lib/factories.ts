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
