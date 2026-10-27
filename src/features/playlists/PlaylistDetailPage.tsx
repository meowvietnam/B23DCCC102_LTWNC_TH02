import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';
import { usePlayerStore } from '../player/usePlayerStore';
import { SONGS } from '../../data/songs';
import { formatDuration } from '../../utils/format';
import type { Song } from '../../types';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const playlist = playlists.find((p) => p.id === id);

  const playlistSongs: Song[] = useMemo(() => {
    if (!playlist) return [];
    const songMap = new Map(SONGS.map((s) => [s.id, s]));
    return playlist.songIds
      .map((songId) => songMap.get(songId))
      .filter((s): s is Song => s !== undefined);
  }, [playlist]);

  const totalSeconds = useMemo(() => {
    return playlistSongs.reduce((sum, song) => sum + song.duration, 0);
  }, [playlistSongs]);

  if (!playlist) {
    return (
      <div className="page playlist-detail-page">
        <p className="error-message" style={{ fontSize: '1.25rem', padding: '2rem 0' }}>
          Không tìm thấy playlist
        </p>
        <Link to="/playlists" className="playlist-link">
          ← Quay lại danh sách playlist
        </Link>
      </div>
    );
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playQueue(playlistSongs, 0);
    }
  };

  const handleRemoveSong = (songId: string) => {
    dispatch({
      type: 'removeSong',
      payload: { playlistId: playlist.id, songId },
    });
  };

  return (
    <div className="page playlist-detail-page">
      <header className="playlist-detail-header">
        <div>
          <Link to="/playlists" className="playlist-link" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
            ← Quay lại danh sách playlist
          </Link>
          <h1>{playlist.name}</h1>
          <p className="total-duration">
            Tổng thời lượng: {minutes} phút {seconds} giây
          </p>
        </div>
        {playlistSongs.length > 0 && (
          <button type="button" className="btn-primary" onClick={handlePlayAll}>
            Phát tất cả
          </button>
        )}
      </header>

      {playlistSongs.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem 0', color: 'var(--text-secondary)' }}>
          <p>Playlist này chưa có bài hát nào. Bạn có thể thêm bài hát từ Thư viện!</p>
        </div>
      ) : (
        <div className="playlist-songs-list">
          <div className="song-table-header">
            <span className="song-index">#</span>
            <span className="song-title">Tiêu đề</span>
            <span className="song-artist">Nghệ sĩ</span>
            <span className="song-genre">Thể loại</span>
            <span className="song-duration">Thời lượng</span>
            <span className="song-actions">Hành động</span>
          </div>

          <div className="songs-table-body">
            {playlistSongs.map((song, index) => (
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
                    onClick={() => playQueue(playlistSongs, index)}
                  >
                    Phát
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleRemoveSong(song.id)}
                  >
                    Bỏ
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

export default PlaylistDetailPage;
