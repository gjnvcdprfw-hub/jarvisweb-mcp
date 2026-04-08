import { listProjects } from '../../src/tools/projects.js';

jest.mock('../../src/client.js', () => ({
  apiGet: jest.fn(),
}));

import { apiGet } from '../../src/client.js';

describe('listProjects', () => {
  it('returns project list on success', async () => {
    (apiGet as jest.Mock).mockResolvedValue({
      success: true,
      data: [{ id: 1, name: 'JARVISWEB', archived: false }],
    });

    const result = await listProjects();
    expect(result).toEqual({
      success: true,
      data: [{ id: 1, name: 'JARVISWEB', archived: false }],
    });
    expect(apiGet).toHaveBeenCalledWith('/api/projects');
  });

  it('propagates error from client', async () => {
    (apiGet as jest.Mock).mockResolvedValue({
      success: false,
      error: 'JarvisWeb 인증 실패: JARVIS_API_KEY 환경변수를 확인하세요',
    });

    const result = await listProjects();
    expect(result.success).toBe(false);
  });
});
