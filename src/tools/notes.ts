import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiGet, apiPost, apiPut } from '../client.js';
import type { ApiResult, Note } from '../types.js';

type NoteType = 'context' | 'cautions' | 'code' | 'prompt';

export async function getNotes(
  projectId: number,
  type: NoteType,
  limit?: number
): Promise<ApiResult<Note[]>> {
  const query = limit ? `?limit=${limit}` : '';
  return apiGet<Note[]>(`/api/projects/${projectId}/notes/${type}${query}`);
}

export async function saveNote(
  projectId: number,
  type: NoteType,
  body: Record<string, unknown>
): Promise<ApiResult<Note>> {
  if (type === 'code') {
    return apiPut<Note>(`/api/projects/${projectId}/notes/code`, body);
  }
  if (type === 'context' && !body.noteDate) {
    return { success: false, error: 'context 노트 저장 시 noteDate(YYYY-MM-DD) 필드는 필수입니다' };
  }
  return apiPost<Note>(`/api/projects/${projectId}/notes/${type}`, body);
}

export function registerNotesTools(server: McpServer): void {
  server.tool(
    'jarvis_get_notes',
    'JarvisWeb 노트 조회. type: context(맥락노트) | cautions(주의사항) | code(코드노트) | prompt(프롬프트). limit: context에만 사용 가능.',
    {
      projectId: z.number(),
      type: z.enum(['context', 'cautions', 'code', 'prompt']),
      limit: z.number().optional(),
    },
    async ({ projectId, type, limit }) => {
      const result = await getNotes(projectId, type, limit);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'jarvis_save_note',
    '노트 저장. context→POST(noteDate필수), cautions→POST(Idempotent), code→PUT(전체 덮어쓰기), prompt→POST. PUT 후 status pending 초기화 없음.',
    {
      projectId: z.number(),
      type: z.enum(['context', 'cautions', 'code', 'prompt']),
      content: z.string(),
      noteDate: z.string().optional(),
      title: z.string().optional(),
    },
    async ({ projectId, type, ...body }) => {
      const result = await saveNote(projectId, type, body);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
