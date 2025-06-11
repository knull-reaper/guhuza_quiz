import { useState, useEffect, useCallback } from "react";

interface UseCountdownParams {
  initialTime: number;
  onTick?: (remainingTime: number) => void;
  onComplete?: () => void;
  autoStart?: boolean;
}

interface UseCountdownReturn {
  remainingTime: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
}

const useCountdown = ({
  initialTime,
  onTick,
  onComplete,
  autoStart = true,
}: UseCountdownParams): UseCountdownReturn => {
  const [remainingTime, setRemainingTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);

  useEffect(() => {
    if (!isRunning || remainingTime <= 0) {
      if (remainingTime <= 0 && isRunning) {
        onComplete?.();
        setIsRunning(false);
      }
      return;
    }

    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1;
        onTick?.(newTime);
        if (newTime <= 0) {
          clearInterval(timerId);
          onComplete?.();
          setIsRunning(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, remainingTime, onTick, onComplete]);

  const start = useCallback(() => {
    if (remainingTime > 0) {
      setIsRunning(true);
    }
  }, [remainingTime]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (newTime?: number) => {
      setIsRunning(autoStart);
      setRemainingTime(newTime ?? initialTime);
    },
    [initialTime, autoStart]
  );

  useEffect(() => {
    if (!isRunning) {
      setRemainingTime(initialTime);
    }
  }, [initialTime, isRunning]);

  return { remainingTime, isRunning, start, pause, reset };
};

export default useCountdown;
