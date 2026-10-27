import { describe, it, expect } from 'vitest';
import { formatDuration, formatDurationVietnamese } from './format';

describe('format.ts utility', () => {
  describe('formatDuration', () => {
    it('định dạng 0 giây thành "0:00"', () => {
      expect(formatDuration(0)).toBe('0:00');
    });

    it('định dạng 65 giây thành "1:05"', () => {
      expect(formatDuration(65)).toBe('1:05');
    });

    it('định dạng 300 giây thành "5:00"', () => {
      expect(formatDuration(300)).toBe('5:00');
    });

    it('định dạng 150 giây thành "2:30"', () => {
      expect(formatDuration(150)).toBe('2:30');
    });

    it('xử lý số giây âm hoặc số lẻ an toàn', () => {
      expect(formatDuration(-10)).toBe('0:00');
      expect(formatDuration(65.8)).toBe('1:05');
    });
  });

  describe('formatDurationVietnamese', () => {
    it('định dạng thời lượng dạng phút và giây bằng tiếng Việt', () => {
      expect(formatDurationVietnamese(0)).toBe('0 phút 0 giây');
      expect(formatDurationVietnamese(65)).toBe('1 phút 5 giây');
      expect(formatDurationVietnamese(337)).toBe('5 phút 37 giây');
    });
  });
});
