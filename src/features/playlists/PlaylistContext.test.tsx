import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  PlaylistProvider,
  usePlaylists,
  usePlaylistDispatch,
} from './PlaylistContext';

describe('PlaylistContext', () => {
  it('ném lỗi khi dùng usePlaylists ngoài PlaylistProvider', () => {
    // Ẩn log lỗi console trong test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => usePlaylists());
    }).toThrow('usePlaylists must be used within a PlaylistProvider');

    consoleSpy.mockRestore();
  });

  it('ném lỗi khi dùng usePlaylistDispatch ngoài PlaylistProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => usePlaylistDispatch());
    }).toThrow('usePlaylistDispatch must be used within a PlaylistProvider');

    consoleSpy.mockRestore();
  });

  it('loadInitialPlaylists đọc dữ liệu từ localStorage', () => {
    const stored = [{ id: 'pl-saved', name: 'Saved Playlist', songIds: [] }];
    window.localStorage.setItem('music-playlists', JSON.stringify(stored));

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <PlaylistProvider>{children}</PlaylistProvider>
    );

    const { result } = renderHook(() => usePlaylists(), { wrapper });
    expect(result.current).toEqual(stored);
  });
});
