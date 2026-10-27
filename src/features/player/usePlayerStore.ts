import { create } from 'zustand';
import type { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
  seek: (position: number) => void;
}

export const initialPlayerState = {
  queue: [] as Song[],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
};

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  ...initialPlayerState,

  playQueue: (songs, startIndex) => {
    if (!songs || songs.length === 0) return;
    const validIndex = Math.max(0, Math.min(startIndex, songs.length - 1));
    set({
      queue: [...songs],
      currentIndex: validIndex,
      position: 0,
      isPlaying: true,
    });
  },

  togglePlay: () => {
    const { currentIndex, queue, isPlaying } = get();
    if (currentIndex >= 0 && currentIndex < queue.length) {
      set({ isPlaying: !isPlaying });
    }
  },

  next: () => {
    const { currentIndex, queue } = get();
    if (currentIndex + 1 < queue.length) {
      set({
        currentIndex: currentIndex + 1,
        position: 0,
        isPlaying: true,
      });
    } else {
      // next() ở bài cuối thì dừng phát
      set({
        isPlaying: false,
      });
    }
  },

  prev: () => {
    const { currentIndex, position } = get();
    // khi đã phát quá 3 giây thì chỉ tua về 0:00
    if (position > 3) {
      set({ position: 0 });
    } else if (currentIndex > 0) {
      // ngược lại lùi về bài trước
      set({
        currentIndex: currentIndex - 1,
        position: 0,
      });
    } else {
      // bài đầu thì tua về 0:00
      set({ position: 0 });
    }
  },

  addToQueue: (song) => {
    const { queue } = get();
    // thêm vào cuối hàng đợi (bài đã có trong hàng đợi thì bỏ qua)
    if (queue.some((item) => item.id === song.id)) {
      return;
    }
    set({
      queue: [...queue, song],
    });
  },

  tick: () => {
    const { queue, currentIndex, position, next } = get();
    if (currentIndex < 0 || currentIndex >= queue.length) {
      return;
    }
    const currentSong = queue[currentIndex];
    if (position + 1 >= currentSong.duration) {
      next();
    } else {
      set({ position: position + 1 });
    }
  },

  seek: (position) => {
    set({ position: Math.max(0, position) });
  },
}));
