import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet } from '../client.js';
import type { ApiResult, Project } from '../types.js';

export async function listProjects(): Promise<ApiResult<Project[]>> {
  return apiGet<Project[]>('/api/projects');
}

export function registerProjectsTools(server: McpServer): void {
  server.tool(
    'jarvis_list_projects',
    'JarvisWeb 프로젝트 목록 조회',
    {},
    async () => {
      const result = await listProjects();
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
