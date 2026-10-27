import React, { useMemo } from 'react';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { SONGS } from '../../data/songs';
import { formatDuration } from '../../utils/format';
import type { Song } from '../../types';

export const FavoritesPage: React.FC = () => {
  const ids = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const favoriteSongs = useMemo(() => {
    const idSet = new Set(ids);
    return SONGS.filter((song) => idSet.has(song.id));
  }, [ids]);

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      playQueue(favoriteSongs, 0);
    }
  };

  const handlePlaySong = (_song: Song, index: number) => {
    playQueue(favoriteSongs, index);
  };

  return (
    <div className="page favorites-page">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Bài hát yêu thích</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {favoriteSongs.length > 0 ? `${favoriteSongs.length} bài hát đã lưu` : ''}
          </p>
        </div>
        {favoriteSongs.length > 0 && (
          <button type="button" className="btn-primary" onClick={handlePlayAll}>
            Phát tất cả
          </button>
        )}
      </header>

      {favoriteSongs.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p>Bạn chưa có bài hát yêu thích</p>
        </div>
      ) : (
        <div className="favorites-list-container">
          <div className="song-table-header">
            <span className="song-index">#</span>
            <span className="song-title">Tiêu đề</span>
            <span className="song-artist">Nghệ sĩ</span>
            <span className="song-genre">Thể loại</span>
            <span className="song-duration">Thời lượng</span>
            <span className="song-actions">Hành động</span>
          </div>

          <div className="favorites-table-body">
            {favoriteSongs.map((song, index) => (
              <div key={song.id} className="song-row">
                <span className="song-index">{index + 1}</span>
                <span className="song-title" title={song.title}>
                  {song.title}
                </span>
                <span className="song-artist" title={song.artist}>
                  {song.artist}
                </span>
                <span className="song-genre">{song.genre}</span>
                <span className="song-duration">{formatDuration(song.duration)}</span>
                <div className="song-actions">
                  <button
                    type="button"
                    className="btn-action btn-play"
                    onClick={() => handlePlaySong(song, index)}
                  >
                    Phát
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-fav active"
                    aria-label="Bỏ yêu thích"
                    onClick={() => toggleFavorite(song.id)}
                  >
                    ♥
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-queue"
                    onClick={() => addToQueue(song)}
                  >
                    + Hàng đợi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
