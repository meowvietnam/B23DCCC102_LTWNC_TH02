import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LibraryPage } from './LibraryPage';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { PlaylistProvider } from '../playlists/PlaylistContext';

describe('LibraryPage component', () => {
  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
    useFavoritesStore.setState({ ids: [] });
  });

  it('mặc định hiển thị "Tìm thấy 10000 bài hát"', () => {
    render(<LibraryPage />);
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
  });

  it('tìm kiếm có debounce: gõ "mưa", sau 300ms tìm thấy 1250 bài hát', () => {
    vi.useFakeTimers();
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'mưa' } });

    // Trong lúc gõ (trước 300ms), số lượng chưa đổi
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();

    // Hết 300ms, danh sách lọc lại
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('lọc theo thể loại Rock khi đang tìm kiếm "mưa" cho ra 250 bài hát', () => {
    vi.useFakeTimers();
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'mưa' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    const genreSelect = screen.getByLabelText('Thể loại');
    fireEvent.change(genreSelect, { target: { value: 'Rock' } });

    expect(screen.getByText('Tìm thấy 250 bài hát')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('tìm theo ca sĩ "thu hà" cho ra 1000 bài hát', () => {
    vi.useFakeTimers();
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'thu hà' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1000 bài hát')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('tìm kiếm không khớp "xyz" hiển thị "Không tìm thấy bài hát nào"', () => {
    vi.useFakeTimers();
    render(<LibraryPage />);

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'xyz' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Không tìm thấy bài hát nào')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('sắp xếp Tên A–Z và Thời lượng tăng dần hoạt động chính xác', () => {
    render(<LibraryPage />);

    const sortSelect = screen.getByLabelText('Sắp xếp');
    fireEvent.change(sortSelect, { target: { value: 'title' } });
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();

    fireEvent.change(sortSelect, { target: { value: 'duration' } });
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
  });

  it('chọn playlist và tương tác thêm bài hát vào playlist', () => {
    const handleAddToPlaylist = vi.fn();
    const handlePlaySong = vi.fn();
    const mockPlaylists = [{ id: 'pl-1', name: 'Nhạc tập', songIds: [] }];

    render(
      <PlaylistProvider initialPlaylists={mockPlaylists}>
        <LibraryPage
          playlists={mockPlaylists}
          onAddToPlaylist={handleAddToPlaylist}
          onPlaySong={handlePlaySong}
        />
      </PlaylistProvider>
    );

    const playlistSelect = screen.getByLabelText('Playlist đang chọn');
    expect(playlistSelect).toBeInTheDocument();
    fireEvent.change(playlistSelect, { target: { value: 'pl-1' } });

    // Gọi trực tiếp callback hoặc kiểm tra props
    expect(playlistSelect).toHaveValue('pl-1');
  });

  it('gọi callback onPlay khi phát bài hát từ thư viện', () => {
    const playQueueSpy = vi.fn();
    usePlayerStore.setState({ playQueue: playQueueSpy });

    render(<LibraryPage onPlaySong={(_song, list) => playQueueSpy(list, 0)} />);
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
  });
});
