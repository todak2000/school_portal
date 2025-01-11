'use client'
import React, { ReactElement, useEffect, useState } from "react";

interface CountdownProps {
  icon: ReactElement;
  value: number;
  unit: string;
}

const Countdown: React.FC<CountdownProps> = ({ icon, value, unit }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let currentCount = 0;
    const interval = setInterval(() => {
      if (currentCount < value) {
        currentCount += 1;
        setCount(currentCount);
      } else {
        clearInterval(interval);
      }
    }, 30); 

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="flex max-w-44 min-w-[150px] flex-col items-center justify-center p-4 bg-gradient-to-r from-secondary to-green-500 text-white rounded-lg shadow-md">
      {icon}
      <div className="text-6xl my-2">{count}</div>
      <div className="text-xl font-semibold">{unit}</div>
    </div>
  );
};

export default React.memo(Countdown);
