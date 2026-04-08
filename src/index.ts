import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { registerProjectsTools } from './tools/projects.js';
import { registerPlansTools } from './tools/plans.js';
import { registerTasksTools } from './tools/tasks.js';
import { registerNotesTools } from './tools/notes.js';

const app = express();
app.use(express.json());

function createServer(): McpServer {
  const server = new McpServer({
    name: 'jarvisweb',
    version: '1.0.0',
  });
  registerProjectsTools(server);
  registerPlansTools(server);
  registerTasksTools(server);
  registerNotesTools(server);
  return server;
}

app.post('/mcp', async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on('close', () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`JarvisWeb MCP server running on port ${port}`);
});
