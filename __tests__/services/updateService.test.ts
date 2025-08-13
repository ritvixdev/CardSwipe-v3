import { UpdateService } from '@/services/UpdateService';

describe('UpdateService.isUpdateRequired', () => {
  const service = new UpdateService();

  it('returns false for minor updates above minimum version', () => {
    // current 1.0.0 -> latest 1.1.0 should not be required
    // @ts-ignore private method access for testing
    expect(service.isUpdateRequired('1.0.0', '1.1.0')).toBe(false);
  });

  it('returns true when current version below minimum supported', () => {
    // @ts-ignore private method access for testing
    expect(service.isUpdateRequired('0.9.0', '1.1.0')).toBe(true);
  });

  it('returns true for major version upgrades', () => {
    // @ts-ignore private method access for testing
    expect(service.isUpdateRequired('1.5.0', '2.0.0')).toBe(true);
  });
});
