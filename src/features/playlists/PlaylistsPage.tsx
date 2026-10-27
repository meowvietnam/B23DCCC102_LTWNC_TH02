import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';
import type { Playlist } from './playlistReducer';

interface PlaylistCreateFormProps {
  playlists: Playlist[];
}

const PlaylistCreateForm: React.FC<PlaylistCreateFormProps> = ({ playlists }) => {
  const dispatch = usePlaylistDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Tên playlist không được để trống');
      return;
    }
    const isDuplicate = playlists.some(
      (p) => p.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setError('Tên playlist đã tồn tại');
      return;
    }

    dispatch({
      type: 'create',
      payload: { name: trimmed },
    });
    setName('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className="control-group" style={{ flex: 1, maxWidth: '400px' }}>
        <label htmlFor="playlist-name-input">Tên playlist</label>
        <input
          id="playlist-name-input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder="Nhập tên playlist mới..."
        />
      </div>
      <button type="submit" className="btn-primary" style={{ marginTop: '1.25rem' }}>
        Tạo
      </button>
      {error && <p className="error-message" role="alert" style={{ width: '100%' }}>{error}</p>}
    </form>
  );
};

export const PlaylistsPage: React.FC = () => {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  return (
    <div className="page playlists-page">
      <header className="page-header">
        <h1>Danh sách playlist</h1>
      </header>

      <PlaylistCreateForm playlists={playlists} />

      {playlists.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem 0', color: 'var(--text-secondary)' }}>
          <p>Chưa có playlist nào. Hãy tạo playlist đầu tiên của bạn!</p>
        </div>
      ) : (
        <div className="playlists-list">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="playlist-card"
              data-testid={`playlist-card-${playlist.id}`}
            >
              <div className="playlist-card-header">
                <h3>{playlist.name}</h3>
                <p>{playlist.songIds.length} bài</p>
              </div>
              <div className="playlist-card-actions">
                <Link to={`/playlists/${playlist.id}`} className="playlist-link">
                  Xem chi tiết
                </Link>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => dispatch({ type: 'remove', payload: { id: playlist.id } })}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;
