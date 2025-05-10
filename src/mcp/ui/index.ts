import type { FastMCP } from "fastmcp";
import type { IMCPTool } from "@/types";
let panel: Panel | undefined;

export function uiSetup(server: FastMCP, tools: Record<string, IMCPTool>) {
    panel = new Panel("mcp_panel", {
        id: "mcp_panel",
        icon: "robot",
        name: "MCP",
        default_side: "right",
        component: {
            mounted() {
                server.on("connect", () => {
                    this.server.connected = true;
                });
            },
            data: () => ({
                server: {
                    connected: false,
                    name: server.options.name,
                    version: server.options.version,
                },
                tools: Object.values(tools).map(tool => ({
                    name: tool.name,
                    description: tool.description,
                })),
            }),
            name: "mcp_panel",
            template: /*html*/ `<div class="mcp-panel">
                <dl>
                    <dt>Server Name</dt>
                    <dd>{{server.name}}</dd>
                    <dt>Server Version</dt>
                    <dd>{{server.version}}</dd>
                </dl>

                <h3>Tools</h3>
                <ul>
                    <li v-for="tool in tools" :key="tool.name">
                        <strong>{{tool.name}}</strong>: {{tool.description}}
                    </li>
                </ul>
            </div>`
        },
        expand_button: true,
    });

    return panel;
}

export function uiTeardown() {
    if (panel) {
        panel.delete();
    }
}