import React, { useState, useEffect } from 'react';
import {
  format,
  differenceInDays,
  differenceInSeconds,
  addDays,
  setDate,
  addMonths,
  setHours,
  setMinutes,
  setSeconds,
  isBefore,
} from 'date-fns';
import { Sun, Cloud, CloudRain } from 'lucide-react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 25, description: 'sunny' });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getNextWorkdayEnd = () => {
    let nextWorkday = currentTime;
    while (nextWorkday.getDay() === 0 || nextWorkday.getDay() === 6) {
      nextWorkday = addDays(nextWorkday, 1);
    }
    return setHours(setMinutes(setSeconds(nextWorkday, 0), 0), 18);
  };

  const getNextPayday = () => {
    let nextPayday = setDate(currentTime, 15);
    if (isBefore(nextPayday, currentTime)) {
      nextPayday = addMonths(nextPayday, 1);
    }
    return nextPayday;
  };

  const formatCountdown = (targetDate: Date) => {
    const diff = differenceInSeconds(targetDate, currentTime);
    if (diff <= 0) return '00:00:00';
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const nextWorkdayEnd = getNextWorkdayEnd();
  const nextPayday = getNextPayday();
  const daysUntilWeekend = 6 - currentTime.getDay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
      <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-bold">
              {format(currentTime, 'yyyy年MM月dd日')}
            </h2>
            <p className="text-xl mt-2">
              距离周末还有 {daysUntilWeekend > 0 ? daysUntilWeekend : 0} 天
            </p>
            <p className="text-xl mt-2">
              距离发工资还有 {differenceInDays(nextPayday, currentTime)} 天
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end">
              {weather.description.includes('rain') ? (
                <CloudRain className="w-8 h-8 mr-2" />
              ) : weather.description.includes('cloud') ? (
                <Cloud className="w-8 h-8 mr-2" />
              ) : (
                <Sun className="w-8 h-8 mr-2" />
              )}
              <span className="text-2xl">{Math.round(weather.temp)}°C</span>
            </div>
            <p className="text-lg mt-1">广州市花都区</p>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">下班倒计时</h1>
          <div className="text-8xl font-mono">
            {formatCountdown(nextWorkdayEnd)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
