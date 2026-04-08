import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiPost, apiPut, apiPatch } from '../client.js';
import type { ApiResult, Plan } from '../types.js';

export async function createPlan(projectId: number, title: string): Promise<ApiResult<Plan>> {
  return apiPost<Plan>(`/api/projects/${projectId}/plans`, { title });
}

export async function updatePlan(
  projectId: number,
  planId: number,
  fields: Record<string, unknown>
): Promise<ApiResult<Plan>> {
  if (!fields.changeReason) {
    return { success: false, error: 'changeReason 필드는 필수입니다' };
  }
  return apiPut<Plan>(`/api/projects/${projectId}/plans/${planId}`, fields);
}

export async function updatePlanStatus(
  projectId: number,
  planId: number,
  status: string
): Promise<ApiResult<{ status: string }>> {
  return apiPatch(`/api/projects/${projectId}/plans/${planId}/status`, { status });
}

export function registerPlansTools(server: McpServer): void {
  server.tool(
    'jarvis_create_plan',
    'JarvisWeb 기획서 생성. 응답의 id를 .jarvis.json의 planId에 저장할 것.',
    { projectId: z.number(), title: z.string() },
    async ({ projectId, title }) => {
      const result = await createPlan(projectId, title);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'jarvis_update_plan',
    'JarvisWeb 기획서 업데이트 (A1~A6 필드). changeReason 필수. PUT 후 status가 pending으로 초기화되므로 필요 시 jarvis_update_plan_status로 재승인할 것.',
    {
      projectId: z.number(),
      planId: z.number(),
      changeReason: z.string(),
      a1Objective: z.string().optional(),
      a1Background: z.string().optional(),
      a1Scope: z.string().optional(),
      a1Success: z.string().optional(),
      a2Approach: z.string().optional(),
      a2Stack: z.array(z.string()).optional(),
      a2Risks: z.string().optional(),
      a3Structure: z.array(z.object({
        phase: z.string(),
        tasks: z.array(z.object({
          task: z.string(),
          checklists: z.array(z.string()),
        })),
      })).optional(),
      a4Memo: z.string().optional(),
      a5Checklist: z.array(z.object({ item: z.string(), result: z.string() })).optional(),
      a5Result: z.string().optional(),
      a6Summary: z.string().optional(),
      a6Lessons: z.string().optional(),
    },
    async (params) => {
      const { projectId, planId, ...fields } = params;
      const result = await updatePlan(projectId, planId, fields);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'jarvis_update_plan_status',
    'JarvisWeb 기획서 상태 변경. status: "pending" | "approved" | "rejected"',
    { projectId: z.number(), planId: z.number(), status: z.string() },
    async ({ projectId, planId, status }) => {
      const result = await updatePlanStatus(projectId, planId, status);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
