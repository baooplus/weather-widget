"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  temperature: number;
  weatherCode: number;
}

function isRaining(code: number): boolean {
  return code >= 51 && code <= 84;
}

function getTime(): { day: string; time: string } {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return { day, time };
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [clock, setClock] = useState(getTime());

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=68.2&longitude=14.4&current=temperature_2m,weather_code&timezone=Europe%2FOslo"
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
        });
      })
      .catch(() => setError(true));

    const timer = setInterval(() => setClock(getTime()), 60000);
    return () => clearInterval(timer);
  }, []);

  const raining = weather ? isRaining(weather.weatherCode) : false;

  return (
    <div style={{
      position: 'relative',
      width: '400px',
      height: '400px',
      borderRadius: '16px',
      overflow: 'hidden',
      flexShrink: 0,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* 背景图 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/lofoten-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      {/* 雨滴 */}
      {raining && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '-10px',
              left: `${Math.random() * 100}%`,
              width: '1px',
              height: '14px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '1px',
              animation: `fall ${0.6 + Math.random() * 0.6}s linear ${Math.random() * 2}s infinite`,
            }} />
          ))}
        </div>
      )}

      {/* 内容 */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '32px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* 顶部：左边日期时间，右边温度 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.3 }}>
              {clock.day}
            </span>
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.3 }}>
              {clock.time}
            </span>
          </div>
          <span style={{
            fontSize: '72px',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1,
            color: '#FFFFFF',
          }}>
            {error ? "—" : weather ? `${weather.temperature}°` : "…"}
          </span>
        </div>

        {/* 底部：地名 */}
        <div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.3 }}>Lofoten</div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.3 }}>Norway</div>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to { transform: translateY(430px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
