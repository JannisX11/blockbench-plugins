import type { ToolParameters, Tool } from "fastmcp";

export interface IMCPTool implements Tool {
    name: string
    description: string
    enabled: boolean
}