## Model Context Protocol Server
Configure experimental MCP server under Blockbench settings: __Settings__ > __General__ > __MCP Server Port__ and __MCP Server Endpoint__

The following examples use the default values of `:3000/mcp`

> __Be sure your Blockbench settings match the port and endpoint used in the MCP JSON configuration.__

### Installation

#### Claude Desktop

__`claude_desktop_config.json`__

```json
{
  "mcpServers": {
    "blockbench": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3000/mcp"
      ]
    }
  }
}
```

#### VS Code

<span style="background: darkred; box-shadow: 1px 1px 6px rgba(0 0 0 / 50%); color: pink; font: 600 12px sans-serif; padding: 0.3em 0.5em; border-radius: 0.25em; outline: 0.125em solid red;">Unstable</span>

> This plugin _should_ be compatible but Copilot often throws errors when using most tools.

__`.vscode/mcp.json`__

```json
{
    "servers": {
        "blockbench": {
            "url": "http://localhost:3000/mcp"
        },
    }
}
```