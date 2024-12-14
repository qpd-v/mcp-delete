#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from "@modelcontextprotocol/sdk/types.js";
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, isAbsolute } from 'path';

/**
 * Create an MCP server with capabilities for file deletion
 */
const server = new Server(
  {
    name: "mcp-delete",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler that lists available tools.
 * Exposes a single "delete_file" tool that lets clients delete files.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "delete_file",
        description: "Delete a file at the specified path (supports both relative and absolute paths)",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the file to delete (relative to working directory or absolute)"
            }
          },
          required: ["path"]
        }
      }
    ]
  };
});

/**
 * Handler for the delete_file tool.
 * Deletes the specified file and returns success/failure message.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "delete_file": {
      const inputPath = String(request.params.arguments?.path);
      if (!inputPath) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "File path is required"
        );
      }
      
      // Try multiple potential paths
      const pathsToTry = [
        inputPath, // Original path
        isAbsolute(inputPath) ? inputPath : resolve(process.cwd(), inputPath), // Relative to process.cwd()
        isAbsolute(inputPath) ? inputPath : resolve('c:/mcpnfo', inputPath), // Relative to mcpnfo
      ];

      // Try each path
      let fileFound = false;
      let foundPath = '';
      for (const path of pathsToTry) {
        if (existsSync(path)) {
          fileFound = true;
          foundPath = path;
          break;
        }
      }

      if (!fileFound) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `File not found: ${inputPath}\nTried paths:\n${pathsToTry.join('\n')}`
        );
      }

      try {
        await unlink(foundPath);
        return {
          content: [{
            type: "text",
            text: `Successfully deleted file: ${inputPath}`
          }]
        };
      } catch (err) {
        const error = err as Error;
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to delete file ${inputPath}: ${error.message}\nTried paths:\n${pathsToTry.join('\n')}`
        );
      }
    }

    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        "Unknown tool"
      );
  }
});

/**
 * Start the server using stdio transport.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('File deletion MCP server running on stdio');
  console.error('Process working directory:', process.cwd());
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
