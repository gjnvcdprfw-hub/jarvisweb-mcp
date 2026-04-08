import { listTasks, createTask, updateTaskStatus } from '../../src/tools/tasks.js';

jest.mock('../../src/client.js', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPatch: jest.fn(),
}));

import { apiGet, apiPost, apiPatch } from '../../src/client.js';

describe('listTasks', () => {
  it('calls GET with projectId', async () => {
    (apiGet as jest.Mock).mockResolvedValue({ success: true, data: [] });
    await listTasks(1);
    expect(apiGet).toHaveBeenCalledWith('/api/projects/1/tasks');
  });
});

describe('createTask', () => {
  it('calls POST with all required fields', async () => {
    (apiPost as jest.Mock).mockResolvedValue({ success: true, data: { id: 1 } });

    await createTask(1, {
      planId: 30,
      phase: 'Phase 1',
      task: '태스크명',
      checklist: '체크리스트 항목',
      phaseOrder: 1,
      taskOrder: 1,
      checklistOrder: 1,
      status: '미착수',
    });

    expect(apiPost).toHaveBeenCalledWith('/api/projects/1/tasks', {
      planId: 30,
      phase: 'Phase 1',
      task: '태스크명',
      checklist: '체크리스트 항목',
      phaseOrder: 1,
      taskOrder: 1,
      checklistOrder: 1,
      status: '미착수',
    });
  });
});

describe('updateTaskStatus', () => {
  it('calls PATCH with status', async () => {
    (apiPatch as jest.Mock).mockResolvedValue({ success: true, data: {} });
    await updateTaskStatus(1, 5, '완료');
    expect(apiPatch).toHaveBeenCalledWith('/api/projects/1/tasks/5/status', { status: '완료' });
  });
});
