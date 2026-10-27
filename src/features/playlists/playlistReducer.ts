export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export type PlaylistAction =
  | { type: 'create'; payload: { id?: string; name: string } }
  | { type: 'rename'; payload: { id: string; name: string } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'addSong'; payload: { playlistId: string; songId: string } }
  | { type: 'removeSong'; payload: { playlistId: string; songId: string } }
  | { type: 'setPlaylists'; payload: Playlist[] };

export function playlistReducer(
  state: Playlist[],
  action: PlaylistAction
): Playlist[] {
  switch (action.type) {
    case 'create': {
      const name = action.payload.name.trim();
      if (!name) return state;
      const newPlaylist: Playlist = {
        id: action.payload.id ?? `pl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name,
        songIds: [],
      };
      return [...state, newPlaylist];
    }

    case 'rename': {
      const { id, name } = action.payload;
      const trimmed = name.trim();
      if (!trimmed) return state;
      if (!state.some((p) => p.id === id)) {
        return state;
      }
      return state.map((p) => (p.id === id ? { ...p, name: trimmed } : p));
    }

    case 'remove': {
      const { id } = action.payload;
      // Nếu playlist không tồn tại thì state giữ nguyên
      if (!state.some((p) => p.id === id)) {
        return state;
      }
      return state.filter((p) => p.id !== id);
    }

    case 'addSong': {
      const { playlistId, songId } = action.payload;
      return state.map((pl) => {
        if (pl.id !== playlistId) {
          return pl;
        }
        // Không thêm trùng bài
        if (pl.songIds.includes(songId)) {
          return pl;
        }
        return {
          ...pl,
          songIds: [...pl.songIds, songId],
        };
      });
    }

    case 'removeSong': {
      const { playlistId, songId } = action.payload;
      return state.map((pl) => {
        if (pl.id !== playlistId) {
          return pl;
        }
        return {
          ...pl,
          songIds: pl.songIds.filter((id) => id !== songId),
        };
      });
    }

    case 'setPlaylists': {
      return action.payload;
    }

    default:
      return state;
  }
}
