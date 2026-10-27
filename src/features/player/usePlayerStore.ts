import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;
  isShuffle: boolean;
  isRepeat: boolean;
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
  seek: (position: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const initialPlayerState = {
  queue: [] as Song[],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
  isShuffle: false,
  isRepeat: false,
};

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set, get) => ({
      ...initialPlayerState,

      playQueue: (songs, startIndex) => {
        if (!songs || songs.length === 0) return;
        const validIndex = Math.max(0, Math.min(startIndex, songs.length - 1));
        set(
          {
            queue: [...songs],
            currentIndex: validIndex,
            position: 0,
            isPlaying: true,
          },
          false,
          'player/playQueue'
        );
      },

      togglePlay: () => {
        const { currentIndex, queue, isPlaying } = get();
        if (currentIndex >= 0 && currentIndex < queue.length) {
          set({ isPlaying: !isPlaying }, false, 'player/togglePlay');
        }
      },

      next: () => {
        const { currentIndex, queue, isRepeat, isShuffle } = get();
        if (queue.length === 0) return;

        if (isRepeat) {
          set({ position: 0, isPlaying: true }, false, 'player/repeat');
          return;
        }

        if (isShuffle && queue.length > 1) {
          let nextIdx = Math.floor(Math.random() * queue.length);
          if (nextIdx === currentIndex) {
            nextIdx = (nextIdx + 1) % queue.length;
          }
          set(
            {
              currentIndex: nextIdx,
              position: 0,
              isPlaying: true,
            },
            false,
            'player/shuffleNext'
          );
          return;
        }

        if (currentIndex + 1 < queue.length) {
          set(
            {
              currentIndex: currentIndex + 1,
              position: 0,
              isPlaying: true,
            },
            false,
            'player/next'
          );
        } else {
          // next() ở bài cuối thì dừng phát
          set(
            {
              isPlaying: false,
            },
            false,
            'player/stopAtEnd'
          );
        }
      },

      prev: () => {
        const { currentIndex, position } = get();
        if (position > 3) {
          set({ position: 0 }, false, 'player/prevReset');
        } else if (currentIndex > 0) {
          set(
            {
              currentIndex: currentIndex - 1,
              position: 0,
            },
            false,
            'player/prevTrack'
          );
        } else {
          set({ position: 0 }, false, 'player/prevFirst');
        }
      },

      addToQueue: (song) => {
        const { queue } = get();
        if (queue.some((item) => item.id === song.id)) {
          return;
        }
        set(
          {
            queue: [...queue, song],
          },
          false,
          'player/addToQueue'
        );
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
          set({ position: position + 1 }, false, 'player/tick');
        }
      },

      seek: (position) => {
        set({ position: Math.max(0, position) }, false, 'player/seek');
      },

      toggleShuffle: () => {
        set((state) => ({ isShuffle: !state.isShuffle }), false, 'player/toggleShuffle');
      },

      toggleRepeat: () => {
        set((state) => ({ isRepeat: !state.isRepeat }), false, 'player/toggleRepeat');
      },
    }),
    { name: 'PlayerStore' }
  )
);
