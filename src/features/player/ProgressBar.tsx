import React from 'react';
import { usePlayerStore } from './usePlayerStore';
import { formatDuration } from '../../utils/format';

export const ProgressBar: React.FC = () => {
  const position = usePlayerStore((s) => s.position);
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length ? s.queue[s.currentIndex] : null
  );
  const seek = usePlayerStore((s) => s.seek);

  const duration = currentSong ? currentSong.duration : 0;
  const percentage = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPos = Math.round((clickX / rect.width) * duration);
    seek(newPos);
  };

  return (
    <div className="progress-container" data-testid="player-progress">
      <span className="progress-time current-time">{formatDuration(position)}</span>
      <div
        className="progress-bar-bg"
        onClick={handleSeek}
        role="progressbar"
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={duration}
      >
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="progress-time total-time">{formatDuration(duration)}</span>
    </div>
  );
};

export default ProgressBar;
