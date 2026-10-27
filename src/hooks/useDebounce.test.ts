import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('đổi giá trị, trước 300ms vẫn là giá trị cũ, sau 300ms chuyển sang giá trị mới', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'mưa', delay: 300 },
      }
    );

    expect(result.current).toBe('mưa');

    // Cập nhật giá trị mới
    rerender({ value: 'mưa rào', delay: 300 });

    // Trước 300ms (ví dụ 150ms hoặc 299ms), giá trị debounced vẫn là giá trị cũ
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('mưa');

    // Sau khi hết 300ms, giá trị debounced cập nhật thành giá trị mới
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('mưa rào');
  });
});
