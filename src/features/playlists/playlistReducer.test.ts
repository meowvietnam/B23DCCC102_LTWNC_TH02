import { describe, it, expect } from 'vitest';
import { playlistReducer, type Playlist } from './playlistReducer';

describe('playlistReducer', () => {
  const initialPlaylists: Playlist[] = [
    {
      id: 'pl-1',
      name: 'Chạy bộ',
      songIds: ['s1', 's2'],
    },
  ];

  it('tạo playlist mới thành công', () => {
    const action = {
      type: 'create' as const,
      payload: { id: 'pl-2', name: 'Nhạc nhẹ' },
    };

    const newState = playlistReducer(initialPlaylists, action);

    expect(newState).toHaveLength(2);
    expect(newState[1]).toEqual({
      id: 'pl-2',
      name: 'Nhạc nhẹ',
      songIds: [],
    });
  });

  it('addSong không thêm trùng bài hát vào playlist', () => {
    // Thêm bài 's1' vốn đã có trong playlist 'pl-1'
    const actionDuplicate = {
      type: 'addSong' as const,
      payload: { playlistId: 'pl-1', songId: 's1' },
    };

    const stateAfterDuplicate = playlistReducer(initialPlaylists, actionDuplicate);
    expect(stateAfterDuplicate[0].songIds).toEqual(['s1', 's2']);

    // Thêm bài 's3' chưa có
    const actionNewSong = {
      type: 'addSong' as const,
      payload: { playlistId: 'pl-1', songId: 's3' },
    };

    const stateWithNewSong = playlistReducer(initialPlaylists, actionNewSong);
    expect(stateWithNewSong[0].songIds).toEqual(['s1', 's2', 's3']);
  });

  it('removeSong xóa đúng bài hát khỏi playlist', () => {
    const action = {
      type: 'removeSong' as const,
      payload: { playlistId: 'pl-1', songId: 's1' },
    };

    const newState = playlistReducer(initialPlaylists, action);
    expect(newState[0].songIds).toEqual(['s2']);
  });

  it('xóa playlist không tồn tại thì state giữ nguyên (toEqual)', () => {
    const action = {
      type: 'remove' as const,
      payload: { id: 'pl-non-existent' },
    };

    const newState = playlistReducer(initialPlaylists, action);
    expect(newState).toEqual(initialPlaylists);
  });
});
