import { createPlan, updatePlan, updatePlanStatus } from '../../src/tools/plans.js';

jest.mock('../../src/client.js', () => ({
  apiPost: jest.fn(),
  apiPut: jest.fn(),
  apiPatch: jest.fn(),
}));

import { apiPost, apiPut, apiPatch } from '../../src/client.js';

describe('createPlan', () => {
  it('calls POST with title and returns plan', async () => {
    (apiPost as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 30, title: '테스트 기획서', status: 'pending' },
    });

    const result = await createPlan(1, '테스트 기획서');
    expect(result).toEqual({
      success: true,
      data: { id: 30, title: '테스트 기획서', status: 'pending' },
    });
    expect(apiPost).toHaveBeenCalledWith('/api/projects/1/plans', { title: '테스트 기획서' });
  });
});

describe('updatePlan', () => {
  it('calls PUT with changeReason and fields', async () => {
    (apiPut as jest.Mock).mockResolvedValue({ success: true, data: {} });

    await updatePlan(1, 30, { changeReason: 'A1 완료', a1Objective: '목표' });
    expect(apiPut).toHaveBeenCalledWith('/api/projects/1/plans/30', {
      changeReason: 'A1 완료',
      a1Objective: '목표',
    });
  });

  it('returns error when changeReason is missing', async () => {
    const result = await updatePlan(1, 30, { a1Objective: '목표' } as any);
    expect(result).toEqual({
      success: false,
      error: 'changeReason 필드는 필수입니다',
    });
  });
});

describe('updatePlanStatus', () => {
  it('calls PATCH with status', async () => {
    (apiPatch as jest.Mock).mockResolvedValue({ success: true, data: {} });

    await updatePlanStatus(1, 30, 'approved');
    expect(apiPatch).toHaveBeenCalledWith('/api/projects/1/plans/30/status', { status: 'approved' });
  });
});
