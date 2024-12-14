# @qpd-v/mcp-delete

A Model Context Protocol (MCP) server that provides file deletion capabilities. This server allows AI assistants to safely delete files when needed, with support for both relative and absolute paths.

## Features

- Delete files using relative or absolute paths
- Smart path resolution that tries multiple potential paths
- Clear error messages with detailed path resolution information
- Safe file existence checks before deletion
- Works with Claude and other MCP-compatible AI assistants

## Examples

### Using with Claude Desktop
![Claude Desktop Example](img/1-screenshot-claude-desktop-mcp-delete.jpg)

### Using with VSCode Roo Cline Extension
![VSCode Roo Cline Example](img/1-screenshot-cline-mcp-delete.jpg)

## Installation

```bash
npx @qpd-v/mcp-delete
```

Or install globally:

```bash
npm install -g @qpd-v/mcp-delete
```

## Configuration

### Claude Desktop

Add the server configuration to your Claude Desktop config file:

Windows:
```json
// %APPDATA%/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "mcp-delete": {
      "command": "npx",
      "args": ["@qpd-v/mcp-delete"]
    }
  }
}
```

MacOS:
```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "mcp-delete": {
      "command": "npx",
      "args": ["@qpd-v/mcp-delete"]
    }
  }
}
```

### VSCode Extension

Add the server configuration to your Cline settings:

Windows:
```json
// %APPDATA%/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json
{
  "mcpServers": {
    "mcp-delete": {
      "command": "npx",
      "args": ["@qpd-v/mcp-delete"]
    }
  }
}
```

MacOS:
```json
// ~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json
{
  "mcpServers": {
    "mcp-delete": {
      "command": "npx",
      "args": ["@qpd-v/mcp-delete"]
    }
  }
}
```

## Available Tools

### delete_file

Deletes a file at the specified path.

Parameters:
- `path` (string, required): Path to the file to delete (relative to working directory or absolute)

Example usage in Claude:
```
You can ask me to delete a file like this:
"Please delete the file example.txt"

I will use the delete_file tool to safely remove the file.
```

## Path Resolution

The server intelligently handles path resolution by trying multiple approaches:
1. The exact path as provided
2. Path relative to the current working directory
3. Path relative to a specified base directory

This makes it more user-friendly as files can be referenced by relative paths and the server will attempt to locate them correctly.

## Development

Clone the repository:
```bash
git clone https://github.com/qpd-v/mcp-delete.git
cd mcp-delete
```

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. Use the MCP Inspector for debugging:

```bash
npm run inspector
```

This will provide a URL to access debugging tools in your browser.

## License

MIT

## Author

qpd-v
