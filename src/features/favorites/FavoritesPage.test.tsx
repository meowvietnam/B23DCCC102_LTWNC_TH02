import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoritesPage } from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';

describe('FavoritesPage component', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState({ ...initialPlayerState });
  });

  it('hiển thị thông báo khi chưa có bài hát yêu thích nào', () => {
    render(<FavoritesPage />);
    expect(screen.getByText('Bạn chưa có bài hát yêu thích')).toBeInTheDocument();
  });

  it('hiển thị danh sách bài hát yêu thích và có thể bấm Phát tất cả', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1', 's2'] });

    const playQueueSpy = vi.fn();
    usePlayerStore.setState({ playQueue: playQueueSpy });

    render(<FavoritesPage />);

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();

    const playAllButton = screen.getByRole('button', { name: 'Phát tất cả' });
    await user.click(playAllButton);

    expect(playQueueSpy).toHaveBeenCalledTimes(1);
  });

  it('bấm Bỏ yêu thích sẽ xóa bài hát khỏi danh sách', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1'] });

    render(<FavoritesPage />);

    const unfavBtn = screen.getByRole('button', { name: 'Bỏ yêu thích' });
    await user.click(unfavBtn);

    expect(screen.getByText('Bạn chưa có bài hát yêu thích')).toBeInTheDocument();
  });
});
