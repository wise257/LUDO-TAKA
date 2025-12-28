
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  onEnd?: () => void;
  compact?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onEnd, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference <= 0) {
        onEnd?.();
        return 'LIVE';
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const h = hours.toString().padStart(2, '0');
      const m = minutes.toString().padStart(2, '0');
      const s = seconds.toString().padStart(2, '0');

      if (compact) {
        // More robust display for tight spaces
        if (hours > 0) return `${h}:${m}:${s}`;
        return `${m}m ${s}s`;
      }
      return `${h}h ${m}m ${s}s`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, onEnd, compact]);

  return <span className="tabular-nums">{timeLeft}</span>;
};

export default CountdownTimer;
