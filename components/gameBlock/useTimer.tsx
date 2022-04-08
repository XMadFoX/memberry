import { useState, useEffect } from 'react';

/*
 * @param {Function} callback
 * @return {Object}
 * @return {Function} start - @param {Number} time in seconds, @param {Number} accuracy (interval) in ms
 * @return {Number} timeLeft - time left in milliseconds
 */
export default function useTimer() {
  const [timeLeft, setTimeLeft] = useState<number | null>(-9);
  const [time, setTime] = useState<number | undefined | null>();
  const [accuracy, setAccuracy] = useState<number | undefined>(200);

  useEffect(() => {
    if (!time) return;
    let it = setInterval(() => {
      const now = Date.now();
      const leftMs = time! - now;
      if (leftMs < 0) {
        setTimeLeft(0);
        clearInterval(it);
      } else setTimeLeft(leftMs);
    }, accuracy);
    return () => clearInterval(it);
  }, [time, accuracy]);

  const parseTime = (time: number) => {
    const now = new Date();
    const newTime = new Date(now.getTime() + time * 1000);
    setTime(newTime.getTime());
  };

  return {
    start: (time: number | null, accuracy?: number) => {
      // @param {Number} time in seconds
      // @accuracy (interval) in ms
      accuracy && setAccuracy(accuracy);
      console.log('got setTime', time);
      accuracy && console.log('got accuracy', accuracy);
      time ? parseTime(time) : setTime(null);
    },
    timeLeft, // time left in milliseconds
  };
}
