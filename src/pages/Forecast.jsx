import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WiCloudRefresh } from 'react-icons/wi';
import SearchBar from '../components/SearchBar';
import ForecastCard from '../components/ForecastCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { clearError } from '../redux/actions/weatherActions';
import styles from './Forecast.module.css';

function Forecast() {
  const { weather, forecast, forecastLoading, error } = useSelector((state) => state.weather);
  const dispatch = useDispatch();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>5-Day Forecast</h1>
        {weather && <p className={styles.subtitle}>Showing for {weather.name}</p>}
        <SearchBar />
      </div>

      <ErrorMessage message={error} onDismiss={() => dispatch(clearError())} />

      {forecastLoading && <Loader label="Loading forecast..." />}

      {!forecastLoading && forecast.length === 0 && !error && (
        <div className={styles.emptyState}>
          <WiCloudRefresh size={60} />
          <p>Search your city to see the 5-day forecast.</p>
        </div>
      )}

      {!forecastLoading && forecast.length > 0 && (
        <div className={styles.grid}>
          {forecast.map((day) => (
            <ForecastCard key={day.date} day={day} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Forecast;
