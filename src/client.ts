import type { ApiResult } from './types.js';

const BASE_URL = 'https://jarvisweb-production-0e23.up.railway.app';

async function request<T>(
  path: string,
  method: string,
  body?: unknown
): Promise<ApiResult<T>> {
  const key = process.env.JARVIS_API_KEY;
  if (!key) {
    return { success: false, error: 'JarvisWeb 인증 실패: JARVIS_API_KEY 환경변수를 확인하세요' };
  }
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'x-api-key': key,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(5000),
    });

    if (res.status === 401) {
      return { success: false, error: 'JarvisWeb 인증 실패: JARVIS_API_KEY 환경변수를 확인하세요' };
    }
    if (res.status === 404) {
      return { success: false, error: '항목을 찾을 수 없음: projectId/planId/taskId를 확인하세요' };
    }
    if (!res.ok) {
      return { success: false, error: `JarvisWeb API 오류: HTTP ${res.status}` };
    }

    const data = await res.json() as T;
    return { success: true, data };
  } catch (e) {
    if (e instanceof Error && e.name === 'TimeoutError') {
      return { success: false, error: 'JarvisWeb API 응답 없음 (5초 타임아웃). 서버 상태 확인 필요' };
    }
    return { success: false, error: `네트워크 오류: ${String(e)}` };
  }
}

export const apiGet = <T>(path: string) => request<T>(path, 'GET');
export const apiPost = <T>(path: string, body: unknown) => request<T>(path, 'POST', body);
export const apiPut = <T>(path: string, body: unknown) => request<T>(path, 'PUT', body);
export const apiPatch = <T>(path: string, body: unknown) => request<T>(path, 'PATCH', body);
