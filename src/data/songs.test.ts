import { describe, it, expect } from 'vitest';
import { generateSongs } from './songs';

describe('generateSongs', () => {
  it('tạo ra đúng 10000 phần tử, id không trùng lặp, thời lượng từ 150 đến 300', () => {
    const songs = generateSongs(10000);

    expect(songs).toHaveLength(10000);

    const ids = new Set(songs.map((s) => s.id));
    expect(ids.size).toBe(10000);

    for (const song of songs) {
      expect(song.duration).toBeGreaterThanOrEqual(150);
      expect(song.duration).toBeLessThanOrEqual(300);
      expect(song.title).toBeTruthy();
      expect(song.artist).toBeTruthy();
      expect(song.genre).toBeTruthy();
    }
  });
});
