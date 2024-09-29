import { useEffect, useState } from "react";

const Timer = ({gameTime, onGameEnd}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [previousTime, setPreviousTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameTime * 1000)

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    setPreviousTime(Date.now());
    setTimeLeft(gameTime * 1000 - elapsedTime)
    const interval = setInterval(() => {
      const now = Date.now();
      const time = elapsedTime;
      setElapsedTime(time + (now - previousTime));
      setPreviousTime(now);
    }, 100);

    return () => {
      clearInterval(interval);
    }
  }, [elapsedTime, previousTime]);

  useEffect(() => {
    if (timeLeft <= 0 && onGameEnd) {
      onGameEnd()
    }
  }, [timeLeft]);

  const getSeconds = (t: number): number => Math.floor(t / 1000);
  const getMinutes = (t: number): number => Math.floor(getSeconds(t) / 60);
  const getHours = (t: number): number => Math.floor(getMinutes(t) / 60);

  const padNumber = (num: number): string => num.toString().padStart(2, '0');

  return (
    <>
      {timeLeft >= 0 ?
      <div className="flex align-middle items-center text-white text-2xl w-36">
        <svg className="inline-block text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6L12 12 16 14"></path>
        </svg>
        <span className="inline-block">
          {padNumber(getHours(timeLeft) % 60)}
          :
          {padNumber(getMinutes(timeLeft) % 60)}
          :
          { padNumber(getSeconds(timeLeft) % 60) }
        </span>
      </div>
      :
      <div className="flex align-middle items center text-center text-white text-2xl w-36">Game Over</div>
    }
    </>
  );
};

export default Timer;
