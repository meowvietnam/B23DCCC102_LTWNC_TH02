import React, { useState, useMemo, useCallback, useEffect, useContext } from 'react';
import { FixedSizeList } from 'react-window';
import type { Genre, Song } from '../../types';
import { SONGS, GENRES } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
import { SongRow, type SongRowData } from './SongRow';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { PlaylistStateContext, PlaylistDispatchContext } from '../playlists/PlaylistContext';

export type SortOption = 'default' | 'title' | 'duration';

export interface LibraryPageProps {
  onPlaySong?: (song: Song, list: Song[]) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: (id: string) => boolean;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song, playlistId: string) => void;
  playlists?: Array<{ id: string; name: string }>;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  onPlaySong,
  onToggleFavorite: propsToggleFavorite,
  isFavorite: propsIsFavorite,
  onAddToQueue: propsAddToQueue,
  onAddToPlaylist,
  playlists: propsPlaylists,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<'ALL' | Genre>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Lấy playlist từ context hoặc props
  const contextPlaylists = useContext(PlaylistStateContext) ?? [];
  const contextDispatch = useContext(PlaylistDispatchContext);
  const playlists = propsPlaylists ?? contextPlaylists;

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(
    playlists.length > 0 ? playlists[0].id : ''
  );

  useEffect(() => {
    if (playlists.length > 0) {
      if (!selectedPlaylistId || !playlists.some((p) => p.id === selectedPlaylistId)) {
        setSelectedPlaylistId(playlists[0].id);
      }
    } else {
      setSelectedPlaylistId('');
    }
  }, [playlists, selectedPlaylistId]);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Zustand selectors
  const storePlayQueue = usePlayerStore((s) => s.playQueue);
  const storeAddToQueue = usePlayerStore((s) => s.addToQueue);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const storeToggleFavorite = useFavoritesStore((s) => s.toggle);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  // Bắt buộc theo đề bài: hàm xử lý khi gõ vào ô tìm kiếm phải đặt tên là handleQueryShift
  const handleQueryShift = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredSongs = useMemo(() => {
    let result = SONGS;

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim().toLowerCase();
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(q) ||
          song.artist.toLowerCase().includes(q)
      );
    }

    if (selectedGenre !== 'ALL') {
      result = result.filter((song) => song.genre === selectedGenre);
    }

    if (sortBy === 'title') {
      return [...result].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    }

    if (sortBy === 'duration') {
      return [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [debouncedQuery, selectedGenre, sortBy]);

  const handlePlay = useCallback(
    (song: Song) => {
      if (onPlaySong) {
        onPlaySong(song, filteredSongs);
      } else {
        const idx = filteredSongs.findIndex((s) => s.id === song.id);
        storePlayQueue(filteredSongs, idx >= 0 ? idx : 0);
      }
    },
    [onPlaySong, filteredSongs, storePlayQueue]
  );

  const handleToggleFavoriteCallback = useCallback(
    (id: string) => {
      if (propsToggleFavorite) {
        propsToggleFavorite(id);
      } else {
        storeToggleFavorite(id);
      }
    },
    [propsToggleFavorite, storeToggleFavorite]
  );

  const checkIsFavorite = useCallback(
    (id: string) => {
      if (propsIsFavorite) {
        return propsIsFavorite(id);
      }
      return favoriteSet.has(id);
    },
    [propsIsFavorite, favoriteSet]
  );

  const handleAddToQueueCallback = useCallback(
    (song: Song) => {
      if (propsAddToQueue) {
        propsAddToQueue(song);
      } else {
        storeAddToQueue(song);
      }
    },
    [propsAddToQueue, storeAddToQueue]
  );

  const handleAddToPlaylistCallback = useCallback(
    (song: Song) => {
      if (onAddToPlaylist && selectedPlaylistId) {
        onAddToPlaylist(song, selectedPlaylistId);
      } else if (contextDispatch && selectedPlaylistId) {
        contextDispatch({
          type: 'addSong',
          payload: { playlistId: selectedPlaylistId, songId: song.id },
        });
      }
    },
    [onAddToPlaylist, contextDispatch, selectedPlaylistId]
  );

  const itemData: SongRowData = useMemo(
    () => ({
      songs: filteredSongs,
      onPlay: handlePlay,
      onToggleFavorite: handleToggleFavoriteCallback,
      isFavorite: checkIsFavorite,
      onAddToQueue: handleAddToQueueCallback,
      onAddToPlaylist: handleAddToPlaylistCallback,
      canAddToPlaylist: Boolean(selectedPlaylistId && playlists.length > 0),
    }),
    [
      filteredSongs,
      handlePlay,
      handleToggleFavoriteCallback,
      checkIsFavorite,
      handleAddToQueueCallback,
      handleAddToPlaylistCallback,
      selectedPlaylistId,
      playlists.length,
    ]
  );

  const itemKey = useCallback((index: number, data: SongRowData) => {
    return data.songs[index].id;
  }, []);

  return (
    <div className="page library-page">
      <header className="page-header">
        <h1>Thư viện bài hát</h1>
      </header>

      <section className="filter-controls">
        <div className="control-group">
          <label htmlFor="search-input">Tìm kiếm</label>
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={handleQueryShift}
            placeholder="Tìm theo tên bài hoặc ca sĩ..."
          />
        </div>

        <div className="control-group">
          <label htmlFor="genre-select">Thể loại</label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value as 'ALL' | Genre)}
          >
            <option value="ALL">Tất cả</option>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort-select">Sắp xếp</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="default">Mặc định</option>
            <option value="title">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="playlist-select">Playlist đang chọn</label>
          <select
            id="playlist-select"
            value={selectedPlaylistId}
            disabled={playlists.length === 0}
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
          >
            {playlists.length === 0 ? (
              <option value="">(Chưa có playlist)</option>
            ) : (
              playlists.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.name}
                </option>
              ))
            )}
          </select>
        </div>
      </section>

      <div className="search-stats" data-testid="search-stats">
        {filteredSongs.length > 0 ? (
          <p>Tìm thấy {filteredSongs.length} bài hát</p>
        ) : (
          <p>Không tìm thấy bài hát nào</p>
        )}
      </div>

      <div className="song-table-header">
        <span className="song-index">#</span>
        <span className="song-title">Tiêu đề</span>
        <span className="song-artist">Nghệ sĩ</span>
        <span className="song-genre">Thể loại</span>
        <span className="song-duration">Thời lượng</span>
        <span className="song-actions">Hành động</span>
      </div>

      <div className="virtualized-list-container">
        {filteredSongs.length > 0 && (
          <FixedSizeList
            height={560}
            itemCount={filteredSongs.length}
            itemSize={56}
            width="100%"
            itemData={itemData}
            itemKey={itemKey}
          >
            {SongRow}
          </FixedSizeList>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
