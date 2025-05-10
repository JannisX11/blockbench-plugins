import type { FastMCP } from "fastmcp";
import type { IMCPTool } from "@/types";
import { server } from "@/server";

export const tools: Record<
  string,
  IMCPTool
> = {};

export function createTool(
  name: string,
  description: string,
  setup: (server: FastMCP) => void
) {
  if (tools[name]) {
    throw new Error(`Tool with name "${name}" already exists.`);
  }

  tools[name] = {
    name,
    description,
    enabled: true,
  };

  setup(server);

  return tools[name];
}
