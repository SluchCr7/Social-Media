'use client'
import React, { useEffect, useState } from 'react';

const Adahn = () => {
  const [adahnData, setAdahnData] = useState(null);
  const [nextAdhan, setNextAdhan] = useState({ name: '', time: '', timeDiff: '' });

  useEffect(() => {
    const fetchAdahnData = async () => {
      try {
        const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=2');
        const data = await response.json();
        setAdahnData(data.data);
      } catch (error) {
        console.error('Error fetching adhan data:', error);
      }
    };
    fetchAdahnData();
  }, []);

  useEffect(() => {
    if (adahnData) {
      const { timings, date } = adahnData;
      const now = new Date();
      const todayDate = date.gregorian.date; // Format: DD-MM-YYYY

      const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      const upcoming = prayerNames
        .map((name) => {
          const timeString = timings[name]; // "HH:MM"
          const [hours, minutes] = timeString.split(':');
          const [day, month, year] = todayDate.split('-');

          const prayerDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
          return { name, time: prayerDate };
        })
        .filter(({ time }) => time > now) // keep only future prayers
        .sort((a, b) => a.time - b.time); // sort to get the nearest one

      if (upcoming.length > 0) {
        const next = upcoming[0];
        const diffMs = next.time - now;
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;

        setNextAdhan({
          name: next.name,
          time: next.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timeDiff: `${hours}h ${minutes}m`,
        });
      } else {
        setNextAdhan({
          name: 'That is the last prayer of the day',
        });
      }
    }
  }, [adahnData]);

  return (
    <div className="w-full bg-lightMode-menu dark:bg-darkMode-menu rounded-xl shadow-lg flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-lightMode-fg/40 dark:border-darkMode-fg/40">
        <h2 className="text-lightMode-fg dark:text-darkMode-fg text-lg font-semibold">Next Prayer</h2>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center py-6">
        <h3 className="text-xl font-bold text-lightMode-fg dark:text-darkMode-fg">
          {nextAdhan.name}
        </h3>
        <p className="text-3xl mt-2 text-lightMode-fg dark:text-darkMode-fg">{nextAdhan.time}</p>
        <p className="text-sm mt-1 text-lightMode-fg/60 dark:text-darkMode-fg/60">
          in {nextAdhan.timeDiff}
        </p>
      </div>
    </div>
  );
};

export default Adahn;
