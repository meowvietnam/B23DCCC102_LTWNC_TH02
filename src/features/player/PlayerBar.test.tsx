import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PlayerBar } from './PlayerBar';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';
import type { Song } from '../../types';

describe('PlayerBar component', () => {
  const mockSong: Song = {
    id: 's1',
    title: 'Mưa tháng Sáu 1',
    artist: 'Lê Minh',
    genre: 'Pop',
    duration: 150,
  };

  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hiển thị "Chưa phát bài nào" khi chưa có nhạc trong hàng đợi', () => {
    render(<PlayerBar />);
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();
  });

  it('hiển thị thông tin bài hát đang phát và các nút điều khiển', () => {
    usePlayerStore.setState({
      queue: [mockSong],
      currentIndex: 0,
      isPlaying: true,
      position: 10,
    });

    render(<PlayerBar />);
    expect(
      screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tạm dừng' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trước' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sau' })).toBeInTheDocument();
  });

  it('bấm Tạm dừng / Phát để thay đổi trạng thái isPlaying', () => {
    usePlayerStore.setState({
      queue: [mockSong],
      currentIndex: 0,
      isPlaying: true,
    });

    render(<PlayerBar />);
    const pauseBtn = screen.getByRole('button', { name: 'Tạm dừng' });
    fireEvent.click(pauseBtn);

    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('đồng hồ tự động chạy tick mỗi giây khi isPlaying = true', () => {
    vi.useFakeTimers();

    usePlayerStore.setState({
      queue: [mockSong],
      currentIndex: 0,
      isPlaying: true,
      position: 0,
    });

    render(<PlayerBar />);

    expect(usePlayerStore.getState().position).toBe(0);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(usePlayerStore.getState().position).toBe(3);
  });
});
