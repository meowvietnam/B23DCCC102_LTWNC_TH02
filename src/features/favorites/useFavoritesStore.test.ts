import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from './useFavoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  it('toggle thêm id bài hát khi chưa có trong danh sách yêu thích', () => {
    const { toggle } = useFavoritesStore.getState();

    toggle('s1');

    expect(useFavoritesStore.getState().ids).toEqual(['s1']);
    expect(useFavoritesStore.getState().has('s1')).toBe(true);
  });

  it('toggle xóa id bài hát khi đã có trong danh sách yêu thích', () => {
    useFavoritesStore.setState({ ids: ['s1', 's2'] });
    const { toggle } = useFavoritesStore.getState();

    toggle('s1');

    expect(useFavoritesStore.getState().ids).toEqual(['s2']);
    expect(useFavoritesStore.getState().has('s1')).toBe(false);
  });
});
