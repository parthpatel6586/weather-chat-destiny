import React from 'react';
import { useDispatch } from 'react-redux';
import { FiClock, FiTrash2 } from 'react-icons/fi';
import { fetchWeatherRequest, fetchForecastRequest, clearHistory } from '../redux/actions/weatherActions';
import styles from './HistoryList.module.css';

function HistoryList({ history, variant = 'chips' }) {
  const dispatch = useDispatch();

  const handleSelect = (city) => {
    dispatch(fetchWeatherRequest(city));
    dispatch(fetchForecastRequest(city));
  };

  if (!history.length) {
    return <p className={styles.empty}>No search history yet.</p>;
  }

  if (variant === 'chips') {
    return (
      <div className={styles.chipRow}>
        {history.map((city) => (
          <button key={city} className={styles.chip} onClick={() => handleSelect(city)}>
            <FiClock size={13} />
            {city}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className={styles.listHeader}>
        <h3>Recent searches</h3>
        <button className={styles.clearBtn} onClick={() => dispatch(clearHistory())}>
          <FiTrash2 size={14} /> Clear all
        </button>
      </div>
      <ul className={styles.list}>
        {history.map((city, idx) => (
          <li key={city} className={`card ${styles.listItem}`}>
            <span className={styles.rank}>{idx + 1}</span>
            <span className={styles.cityName}>{city}</span>
            <button className={styles.viewBtn} onClick={() => handleSelect(city)}>
              View weather
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryList;
