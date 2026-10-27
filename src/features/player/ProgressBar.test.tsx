import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';
import type { Song } from '../../types';

describe('ProgressBar component', () => {
  const mockSong: Song = {
    id: 's1',
    title: 'Mưa tháng Sáu 1',
    artist: 'Lê Minh',
    genre: 'Pop',
    duration: 150,
  };

  beforeEach(() => {
    usePlayerStore.setState({
      ...initialPlayerState,
      queue: [mockSong],
      currentIndex: 0,
      position: 30,
    });
  });

  it('hiển thị thời gian hiện tại 0:30 và tổng thời lượng 2:30', () => {
    render(<ProgressBar />);

    expect(screen.getByText('0:30')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('click vào thanh tiến trình để tua nhạc (seek)', () => {
    render(<ProgressBar />);

    const bar = screen.getByRole('progressbar');
    // Mock getBoundingClientRect
    bar.getBoundingClientRect = () => ({
      width: 100,
      height: 4,
      top: 0,
      left: 0,
      bottom: 4,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.click(bar, { clientX: 50 });

    // 50% của 150s = 75s
    expect(usePlayerStore.getState().position).toBe(75);
  });
});
