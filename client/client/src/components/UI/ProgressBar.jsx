import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressBar = ({ timeLeft, totalTime, size = 70, strokeWidth = 7 }) => {

  const percentage = totalTime
  ? Math.max(0, (timeLeft / totalTime) * 100)
  : 0;

  // Format time MM:SS
const formatTime = (seconds) => `${Math.round(seconds)}`;
  // Theme-based color logic
  const getPathColor = (pct) => {
    if (pct > 50) return '#2EBDDB';       // primary cyan
    if (pct > 25) return '#6ED0E3';       // lighter cyan
    return '#FF6B6B';                     // soft red (not too harsh)
  };

  return (
    <div
      style={{
        height: size,
        width: size,
        position: 'relative',
      }}
    >
      <CircularProgressbar
        value={percentage}
        text={formatTime(Math.round(timeLeft))}
        strokeWidth={strokeWidth}
        styles={buildStyles({
          rotation: 0.25,
          strokeLinecap: 'round',

          // Smooth animation
          pathTransitionDuration: 0.6,

          // Colors
          pathColor: getPathColor(percentage),
          trailColor: '#E5E7EB', // very light cyan instead of gray
          textColor: '#2EBDDB',

          // Typography
          textSize: '24px',
        })}
      />

      {/* subtle glow effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: `0 0 10px ${getPathColor(percentage)}40`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default ProgressBar;