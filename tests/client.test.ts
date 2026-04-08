import { apiGet, apiPost, apiPut, apiPatch } from '../src/client.js';

const originalFetch = global.fetch;

beforeEach(() => {
  process.env.JARVIS_API_KEY = 'test-key';
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('apiGet', () => {
  it('returns success with data on 200', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ id: 1, name: 'Test' }],
    } as Response);

    const result = await apiGet('/api/projects');
    expect(result).toEqual({ success: true, data: [{ id: 1, name: 'Test' }] });
  });

  it('returns error on 401', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    } as Response);

    const result = await apiGet('/api/projects');
    expect(result).toEqual({
      success: false,
      error: 'JarvisWeb 인증 실패: JARVIS_API_KEY 환경변수를 확인하세요',
    });
  });

  it('returns error on 404', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response);

    const result = await apiGet('/api/projects/999');
    expect(result).toEqual({
      success: false,
      error: '항목을 찾을 수 없음: projectId/planId/taskId를 확인하세요',
    });
  });

  it('returns error on timeout', async () => {
    global.fetch = jest.fn().mockRejectedValue(
      Object.assign(new Error('timeout'), { name: 'TimeoutError' })
    );

    const result = await apiGet('/api/projects');
    expect(result).toEqual({
      success: false,
      error: 'JarvisWeb API 응답 없음 (5초 타임아웃). 서버 상태 확인 필요',
    });
  });
});
