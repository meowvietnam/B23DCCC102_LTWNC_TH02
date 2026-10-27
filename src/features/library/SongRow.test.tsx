import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SongRow } from './SongRow';
import type { Song } from '../../types';

describe('SongRow component', () => {
  const mockSong: Song = {
    id: 's1',
    title: 'Mưa tháng Sáu 1',
    artist: 'Lê Minh',
    genre: 'Pop',
    duration: 150,
  };

  it('hiển thị tên bài và "2:30"', () => {
    render(<SongRow song={mockSong} index={0} />);

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
    expect(screen.getByText('Lê Minh')).toBeInTheDocument();
    expect(screen.getByText('Pop')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('bấm nút Phát (tìm bằng getByRole) thì hàm mock vi.fn() được gọi với đúng bài hát', () => {
    const handlePlay = vi.fn();
    render(<SongRow song={mockSong} index={0} onPlay={handlePlay} />);

    const playButton = screen.getByRole('button', { name: 'Phát' });
    fireEvent.click(playButton);

    expect(handlePlay).toHaveBeenCalledTimes(1);
    expect(handlePlay).toHaveBeenCalledWith(mockSong);
  });

  it('tương tác nút Yêu thích, Thêm hàng đợi và Thêm playlist', () => {
    const handleToggleFavorite = vi.fn();
    const handleAddToQueue = vi.fn();
    const handleAddToPlaylist = vi.fn();

    const { rerender } = render(
      <SongRow
        song={mockSong}
        index={0}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={false}
        onAddToQueue={handleAddToQueue}
        onAddToPlaylist={handleAddToPlaylist}
        canAddToPlaylist={true}
      />
    );

    const favButton = screen.getByRole('button', { name: 'Thêm vào yêu thích' });
    expect(favButton).toHaveTextContent('♡');
    fireEvent.click(favButton);
    expect(handleToggleFavorite).toHaveBeenCalledWith('s1');

    const queueButton = screen.getByRole('button', { name: '+ Hàng đợi' });
    fireEvent.click(queueButton);
    expect(handleAddToQueue).toHaveBeenCalledWith(mockSong);

    const playlistButton = screen.getByRole('button', { name: '+ Playlist' });
    expect(playlistButton).toBeEnabled();
    fireEvent.click(playlistButton);
    expect(handleAddToPlaylist).toHaveBeenCalledWith(mockSong);

    // Khi đã thích (isFavorite = true)
    rerender(
      <SongRow
        song={mockSong}
        index={0}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={true}
      />
    );
    const favButtonActive = screen.getByRole('button', { name: 'Bỏ yêu thích' });
    expect(favButtonActive).toHaveTextContent('♥');
  });

  it('render thông qua itemData của virtualized list', () => {
    const handlePlay = vi.fn();
    render(
      <SongRow
        index={0}
        data={{
          songs: [mockSong],
          onPlay: handlePlay,
          isFavorite: () => false,
        }}
      />
    );

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
  });
});
