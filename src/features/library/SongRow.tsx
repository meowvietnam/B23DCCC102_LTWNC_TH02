import React from 'react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export interface SongRowData {
  songs: Song[];
  onPlay: (song: Song) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: (id: string) => boolean;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  canAddToPlaylist?: boolean;
}

export interface SongRowProps {
  song?: Song;
  index: number;
  style?: React.CSSProperties;
  data?: SongRowData;
  onPlay?: (song: Song) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  canAddToPlaylist?: boolean;
}

export const SongRow: React.FC<SongRowProps> = React.memo(({
  song: directSong,
  index,
  style,
  data,
  onPlay: directOnPlay,
  onToggleFavorite: directOnToggleFavorite,
  isFavorite: directIsFavorite,
  onAddToQueue: directOnAddToQueue,
  onAddToPlaylist: directOnAddToPlaylist,
  canAddToPlaylist: directCanAddToPlaylist,
}) => {
  const song = directSong ?? (data ? data.songs[index] : undefined);
  if (!song) return null;

  const onPlay = directOnPlay ?? data?.onPlay;
  const onToggleFavorite = directOnToggleFavorite ?? data?.onToggleFavorite;
  const isFav = directIsFavorite !== undefined ? directIsFavorite : (data?.isFavorite ? data.isFavorite(song.id) : false);
  const onAddToQueue = directOnAddToQueue ?? data?.onAddToQueue;
  const onAddToPlaylist = directOnAddToPlaylist ?? data?.onAddToPlaylist;
  const canAddToPlaylist = directCanAddToPlaylist !== undefined ? directCanAddToPlaylist : (data?.canAddToPlaylist ?? false);

  return (
    <div style={style} className="song-row" data-testid={`song-row-${song.id}`}>
      <span className="song-index">{index + 1}</span>
      <span className="song-title" title={song.title}>{song.title}</span>
      <span className="song-artist" title={song.artist}>{song.artist}</span>
      <span className="song-genre">{song.genre}</span>
      <span className="song-duration">{formatDuration(song.duration)}</span>
      <div className="song-actions">
        {onPlay && (
          <button type="button" className="btn-action btn-play" onClick={() => onPlay(song)}>
            Phát
          </button>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            className={`btn-action btn-fav ${isFav ? 'active' : ''}`}
            aria-label={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            onClick={() => onToggleFavorite(song.id)}
          >
            {isFav ? '♥' : '♡'}
          </button>
        )}
        {onAddToQueue && (
          <button type="button" className="btn-action btn-queue" onClick={() => onAddToQueue(song)}>
            + Hàng đợi
          </button>
        )}
        {onAddToPlaylist && (
          <button
            type="button"
            className="btn-action btn-playlist"
            disabled={!canAddToPlaylist}
            onClick={() => onAddToPlaylist(song)}
          >
            + Playlist
          </button>
        )}
      </div>
    </div>
  );
});

SongRow.displayName = 'SongRow';
