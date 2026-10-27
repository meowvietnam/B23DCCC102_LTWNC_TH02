import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PlaylistDetailPage } from './PlaylistDetailPage';
import { PlaylistProvider } from './PlaylistContext';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';
import type { Playlist } from './playlistReducer';

function renderDetailPage(
  initialEntries: string[],
  initialPlaylists: Playlist[] = []
) {
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={initialEntries}>
        <PlaylistProvider initialPlaylists={initialPlaylists}>
          <Routes>
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          </Routes>
        </PlaylistProvider>
      </MemoryRouter>
    ),
  };
}

describe('PlaylistDetailPage component', () => {
  const mockPlaylist: Playlist = {
    id: 'pl-1',
    name: 'Chạy bộ',
    songIds: ['s1', 's2'], // s1: 150s, s2: 187s -> total: 337s = 5 phút 37 giây
  };

  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
  });

  it('hiển thị thông báo "Không tìm thấy playlist" khi id không tồn tại', () => {
    renderDetailPage(['/playlists/not-found'], [mockPlaylist]);

    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument();
  });

  it('hiển thị tên playlist, danh sách bài hát và "Tổng thời lượng: 5 phút 37 giây"', () => {
    renderDetailPage(['/playlists/pl-1'], [mockPlaylist]);

    expect(screen.getByText('Chạy bộ')).toBeInTheDocument();
    expect(screen.getByText('Tổng thời lượng: 5 phút 37 giây')).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
  });

  it('bấm Phát tất cả sẽ phát toàn bộ danh sách bài trong playlist', async () => {
    const playQueueSpy = vi.fn();
    usePlayerStore.setState({ playQueue: playQueueSpy });

    const { user } = renderDetailPage(['/playlists/pl-1'], [mockPlaylist]);

    const playAllBtn = screen.getByRole('button', { name: 'Phát tất cả' });
    await user.click(playAllBtn);

    expect(playQueueSpy).toHaveBeenCalledTimes(1);
    expect(playQueueSpy.mock.calls[0][1]).toBe(0);
  });

  it('bấm Bỏ để xóa bài hát ra khỏi playlist', async () => {
    const { user } = renderDetailPage(['/playlists/pl-1'], [mockPlaylist]);

    const removeButtons = screen.getAllByRole('button', { name: 'Bỏ' });
    expect(removeButtons).toHaveLength(2);

    await user.click(removeButtons[0]);

    // Bài 1 đã bị bỏ, chỉ còn lại bài 2 (187s = 3 phút 7 giây)
    expect(screen.getByText('Tổng thời lượng: 3 phút 7 giây')).toBeInTheDocument();
  });
});
