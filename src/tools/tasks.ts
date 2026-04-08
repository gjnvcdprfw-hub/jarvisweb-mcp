import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiGet, apiPost, apiPatch } from '../client.js';
import type { ApiResult, Task } from '../types.js';

interface CreateTaskInput {
  planId: number;
  phase: string;
  task: string;
  checklist: string;
  phaseOrder: number;
  taskOrder: number;
  checklistOrder: number;
  status: string;
}

export async function listTasks(projectId: number): Promise<ApiResult<Task[]>> {
  return apiGet<Task[]>(`/api/projects/${projectId}/tasks`);
}

export async function createTask(
  projectId: number,
  input: CreateTaskInput
): Promise<ApiResult<Task>> {
  return apiPost<Task>(`/api/projects/${projectId}/tasks`, input);
}

export async function updateTaskStatus(
  projectId: number,
  taskId: number,
  status: string
): Promise<ApiResult<Task>> {
  return apiPatch<Task>(`/api/projects/${projectId}/tasks/${taskId}/status`, { status });
}

export function registerTasksTools(server: McpServer): void {
  server.tool(
    'jarvis_list_tasks',
    'JarvisWeb 현황판 태스크 목록 조회',
    { projectId: z.number() },
    async ({ projectId }) => {
      const result = await listTasks(projectId);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'jarvis_create_task',
    'JarvisWeb 현황판 태스크 생성. Checklist 항목 1개 = 1회 호출. Idempotent (중복 호출 시 기존 항목 반환).',
    {
      projectId: z.number(),
      planId: z.number(),
      phase: z.string(),
      task: z.string(),
      checklist: z.string(),
      phaseOrder: z.number(),
      taskOrder: z.number(),
      checklistOrder: z.number(),
      status: z.string().default('미착수'),
    },
    async ({ projectId, ...input }) => {
      const result = await createTask(projectId, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'jarvis_update_task_status',
    'JarvisWeb 현황판 태스크 상태 변경. status: "미착수" | "진행중" | "완료"',
    { projectId: z.number(), taskId: z.number(), status: z.string() },
    async ({ projectId, taskId, status }) => {
      const result = await updateTaskStatus(projectId, taskId, status);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
