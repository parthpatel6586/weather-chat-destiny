import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiRefreshCw } from 'react-icons/fi';
import { fetchWeatherRequest, fetchForecastRequest } from '../redux/actions/weatherActions';
import styles from './WeatherCard.module.css';

function formatDate(unixSeconds, timezoneOffsetSeconds) {
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function WeatherCard({ weather }) {
  const unit = useSelector((state) => state.weather.unit);
  const loading = useSelector((state) => state.weather.loading);
  const dispatch = useDispatch();
  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  const handleRefresh = () => {
    dispatch(fetchWeatherRequest(weather.name));
    dispatch(fetchForecastRequest(weather.name));
  };

  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.topRow}>
        <div>
          <h2 className={styles.city}>
            {weather.name}
            {weather.sys?.country ? `, ${weather.sys.country}` : ''}
          </h2>
          <p className={styles.date}>{formatDate(weather.dt, weather.timezone)}</p>
        </div>
          <button className={styles.refreshBtn} onClick={handleRefresh} disabled={loading}>
            <FiRefreshCw size={18} />
          </button>
      </div>

      <div className={styles.main}>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
          alt={weather.weather[0].description}
          className={styles.icon}
        />
        <div>
          <p className={styles.temp}>
            {Math.round(weather.main.temp)}
            <span>{unitSymbol}</span>
          </p>
          <p className={styles.condition}>{weather.weather[0].description}</p>
        </div>
      </div>

      <p className={styles.feelsLike}>
        Feels like {Math.round(weather.main.feels_like)}
        {unitSymbol}
      </p>
    </div>
  );
}

export default WeatherCard;
