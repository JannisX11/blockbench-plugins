const settings: Setting[] = []

export function settingsSetup() {
    settings.push(
        new Setting("mcp_instructions", {
            name: "MCP System Instructions",
            // https://github.com/punkpeye/fastmcp?tab=readme-ov-file#providing-instructions
            description: "Instructions for the MCP system.",
            type: "text",
            value: "",
            category: "AI",
            icon: "psychology",
        }),
        new Setting("mcp_port", {
            name: "MCP Server Port",
            description: "Port for the MCP server.",
            type: "number",
            value: 3000,
            category: "AI",
            icon: "settings_input_component",
        }),
        new Setting("mcp_endpoint", {
            name: "MCP Server Endpoint",
            description: "Endpoint for the MCP server.",
            type: "text",
            value: "/mcp",
            category: "AI",
            icon: "settings_input_component",
        }),
    );
}

export function settingsTeardown() {
    settings.forEach(setting => {
        setting.delete();
    });
}