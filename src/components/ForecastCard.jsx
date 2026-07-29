import React from 'react';
import { useSelector } from 'react-redux';
import styles from './ForecastCard.module.css';

function formatDay(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function ForecastCard({ day }) {
  const unit = useSelector((state) => state.weather.unit);
  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  return (
    <div className={`card ${styles.card}`}>
      <p className={styles.day}>{formatDay(day.date)}</p>
      <img
        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
        alt={day.description}
        className={styles.icon}
      />
      <p className={styles.condition}>{day.condition}</p>
      <div className={styles.temps}>
        <span className={styles.max}>{Math.round(day.maxTemp)}°</span>
        <span className={styles.min}>{Math.round(day.minTemp)}°</span>
      </div>
      <span className={styles.unitTag}>{unitSymbol}</span>
    </div>
  );
}

export default ForecastCard;
