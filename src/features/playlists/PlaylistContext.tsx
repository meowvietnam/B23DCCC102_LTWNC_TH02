import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { playlistReducer, type Playlist, type PlaylistAction } from './playlistReducer';
import { withLogger } from './withLogger';

export const PlaylistStateContext = createContext<Playlist[] | undefined>(undefined);
export const PlaylistDispatchContext = createContext<React.Dispatch<PlaylistAction> | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'music-playlists';

function loadInitialPlaylists(): Playlist[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Nếu có lỗi parse thì fallback về rỗng
  }
  return [];
}

export interface PlaylistProviderProps {
  children: React.ReactNode;
  initialPlaylists?: Playlist[];
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({
  children,
  initialPlaylists,
}) => {
  const [state, dispatch] = useReducer(
    withLogger(playlistReducer),
    initialPlaylists ?? loadInitialPlaylists()
  );

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Bỏ qua lỗi quota nếu có
    }
  }, [state]);

  return (
    <PlaylistStateContext.Provider value={state}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
};

export function usePlaylists(): Playlist[] {
  const context = useContext(PlaylistStateContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
}

export function usePlaylistDispatch(): React.Dispatch<PlaylistAction> {
  const context = useContext(PlaylistDispatchContext);
  if (context === undefined) {
    throw new Error('usePlaylistDispatch must be used within a PlaylistProvider');
  }
  return context;
}
