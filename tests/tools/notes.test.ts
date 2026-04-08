import { getNotes, saveNote } from '../../src/tools/notes.js';

jest.mock('../../src/client.js', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPut: jest.fn(),
}));

import { apiGet, apiPost, apiPut } from '../../src/client.js';

describe('getNotes', () => {
  it('calls GET for context notes', async () => {
    (apiGet as jest.Mock).mockResolvedValue({ success: true, data: [] });
    await getNotes(1, 'context');
    expect(apiGet).toHaveBeenCalledWith('/api/projects/1/notes/context');
  });

  it('calls GET with limit for context notes', async () => {
    (apiGet as jest.Mock).mockResolvedValue({ success: true, data: [] });
    await getNotes(1, 'context', 1);
    expect(apiGet).toHaveBeenCalledWith('/api/projects/1/notes/context?limit=1');
  });
});

describe('saveNote', () => {
  it('calls POST for context type with required fields', async () => {
    (apiPost as jest.Mock).mockResolvedValue({ success: true, data: {} });
    await saveNote(1, 'context', { noteDate: '2026-04-08', title: '세션 완료', content: '내용' });
    expect(apiPost).toHaveBeenCalledWith('/api/projects/1/notes/context', {
      noteDate: '2026-04-08',
      title: '세션 완료',
      content: '내용',
    });
  });

  it('calls PUT for code type', async () => {
    (apiPut as jest.Mock).mockResolvedValue({ success: true, data: {} });
    await saveNote(1, 'code', { content: '코드노트 내용' });
    expect(apiPut).toHaveBeenCalledWith('/api/projects/1/notes/code', { content: '코드노트 내용' });
  });

  it('returns error when context note is missing noteDate', async () => {
    const result = await saveNote(1, 'context', { title: '제목', content: '내용' });
    expect(result).toEqual({
      success: false,
      error: 'context 노트 저장 시 noteDate(YYYY-MM-DD) 필드는 필수입니다',
    });
  });
});
