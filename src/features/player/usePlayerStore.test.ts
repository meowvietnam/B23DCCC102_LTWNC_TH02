import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';
import type { Song } from '../../types';

describe('usePlayerStore', () => {
  const mockSongs: Song[] = [
    {
      id: 's1',
      title: 'Mưa tháng Sáu 1',
      artist: 'Lê Minh',
      genre: 'Pop',
      duration: 150,
    },
    {
      id: 's2',
      title: 'Nắng tháng Sáu 1',
      artist: 'Quang Huy',
      genre: 'Indie',
      duration: 187,
    },
  ];

  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
  });

  it('playQueue đặt đúng bài và khởi tạo trạng thái phát', () => {
    const { playQueue } = usePlayerStore.getState();

    playQueue(mockSongs, 1);

    const state = usePlayerStore.getState();
    expect(state.queue).toEqual(mockSongs);
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('tick ở giây cuối tự sang bài sau', () => {
    const { playQueue, tick } = usePlayerStore.getState();

    playQueue(mockSongs, 0);

    // Bài 1 có duration là 150, đặt position ở giây cuối (149)
    usePlayerStore.setState({ position: 149 });

    tick();

    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('next ở bài cuối thì isPlaying là false', () => {
    const { playQueue, next } = usePlayerStore.getState();

    // Phát ở bài cuối (chỉ số 1 trong danh sách 2 bài)
    playQueue(mockSongs, 1);
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    next();

    const state = usePlayerStore.getState();
    expect(state.isPlaying).toBe(false);
  });

  it('prev khi đã phát quá 3 giây thì chỉ tua về 0:00, ngược lại lùi về bài trước', () => {
    const { playQueue, prev } = usePlayerStore.getState();

    playQueue(mockSongs, 1);
    usePlayerStore.setState({ position: 5 });

    // Phát quá 3 giây -> chỉ tua về 0
    prev();
    let state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);

    // Đang ở đầu bài (position <= 3) -> lùi về bài trước
    prev();
    state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.position).toBe(0);

    // Bài đầu tiên (index 0) lùi tiếp vẫn ở bài đầu tiên và position 0
    prev();
    state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.position).toBe(0);
  });

  it('addToQueue thêm bài mới vào cuối và bỏ qua bài đã có', () => {
    const { playQueue, addToQueue } = usePlayerStore.getState();

    playQueue([mockSongs[0]], 0);
    expect(usePlayerStore.getState().queue).toHaveLength(1);

    // Thêm bài thứ 2
    addToQueue(mockSongs[1]);
    expect(usePlayerStore.getState().queue).toHaveLength(2);
    expect(usePlayerStore.getState().queue[1].id).toBe('s2');

    // Thêm lại bài thứ 1 (đã có trong hàng đợi) -> bỏ qua
    addToQueue(mockSongs[0]);
    expect(usePlayerStore.getState().queue).toHaveLength(2);
  });
});
