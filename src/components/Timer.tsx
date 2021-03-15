import { useEffect, useState } from "react";

const Timer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [previousTime, setPreviousTime] = useState(0);

  useEffect(() => {
    setPreviousTime(Date.now());
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

  const getSeconds = (elapsedTime: number): number => Math.floor(elapsedTime / 1000);
  const getMinutes = (elapsedTime: number): number => Math.floor(getSeconds(elapsedTime) / 60);
  const getHours = (elapsedTime: number): number => Math.floor(getMinutes(elapsedTime) / 60);

  const padNumber = (num: number): string => num.toString().padStart(2, '0');

  return <div className="flex align-middle items-center text-white text-3xl">
    <svg className="inline-block text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 6L12 12 16 14"></path>
    </svg>
    <span className="inline-block">
      {padNumber(getHours(elapsedTime) % 60)}
      :
      {padNumber(getMinutes(elapsedTime) % 60)}
      :
      { padNumber(getSeconds(elapsedTime) % 60) }
    </span>
  </div>;
};

export default Timer;
