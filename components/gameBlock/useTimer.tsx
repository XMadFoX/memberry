import { useState, useEffect } from 'react';

/*
 * @param {Function} callback
 * @return {Object}
 * @return {Function} start - @param {Number} time in seconds
 * @return {Number} timeLeft - time left in milliseconds
 */
export default function useTimer(cb: () => void) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [time, setTime] = useState<number | undefined>();

  useEffect(() => {
    if (!time) return;
    let it = setInterval(() => {
      const now = Date.now();
      const leftMs = time! - now;
      if (leftMs < 0) {
        setTimeLeft(0);
        clearInterval(it);
        cb();
      } else setTimeLeft(leftMs);
    }, 10);
    return () => clearInterval(it);
  }, [time, cb]);

  const parseTime = (time: number) => {
    const now = new Date();
    const newTime = new Date(now.getTime() + time * 1000);
    setTime(newTime.getTime());
  };

  return {
    start: (time: number) => parseTime(time), // @param {Number} time in seconds
    timeLeft, // time left in milliseconds
  };
}
