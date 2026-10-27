import React, { useEffect } from 'react';
import { usePlayerStore } from './usePlayerStore';
import { ProgressBar } from './ProgressBar';

export const PlayerBar: React.FC = () => {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const queueLength = usePlayerStore((s) => s.queue.length);
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length ? s.queue[s.currentIndex] : null
  );
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const tick = usePlayerStore((s) => s.tick);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, tick]);

  return (
    <footer className="player-bar" data-testid="player-bar">
      <div className="player-track-info">
        <div className="track-playing-text">
          {currentSong ? (
            `Đang phát: ${currentSong.title} – ${currentSong.artist}`
          ) : (
            'Chưa phát bài nào'
          )}
        </div>
        <div className="track-queue-info">Hàng đợi: {queueLength} bài</div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button
            type="button"
            className="player-btn"
            onClick={prev}
          >
            Trước
          </button>
          <button
            type="button"
            className="player-btn player-btn-main"
            onClick={togglePlay}
          >
            {isPlaying ? 'Tạm dừng' : 'Phát'}
          </button>
          <button
            type="button"
            className="player-btn"
            onClick={next}
          >
            Sau
          </button>
        </div>
        <ProgressBar />
      </div>

      <div className="player-right" />
    </footer>
  );
};

export default PlayerBar;
