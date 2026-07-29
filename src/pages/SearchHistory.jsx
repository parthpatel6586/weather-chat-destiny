import React from 'react';
import { useSelector } from 'react-redux';
import HistoryList from '../components/HistoryList';
import styles from './SearchHistory.module.css';

function SearchHistory() {
  const history = useSelector((state) => state.weather.history);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Search History</h1>
      <p className={styles.subtitle}>
        Your last {history.length} searched {history.length === 1 ? 'city' : 'cities'}.
      </p>
      <HistoryList history={history} variant="list" />
    </div>
  );
}

export default SearchHistory;
