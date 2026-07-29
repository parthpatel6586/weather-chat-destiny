import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WiCloudRefresh } from 'react-icons/wi';
import { FiMessageCircle } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import WeatherDetails from '../components/WeatherDetails';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import HistoryList from '../components/HistoryList';
import { clearError } from '../redux/actions/weatherActions';
import { useChat } from '../context/ChatContext';
import styles from './Home.module.css';

function Home() {
  const { weather, loading, error, history } = useSelector((state) => state.weather);
  const dispatch = useDispatch();
  const { toggle: toggleChat, isOpen: isChatOpen } = useChat();

  return (
    <div>
      <div className={styles.hero}>
        <h1 className={styles.title}>Check the Weather</h1>
        <p className={styles.subtitle}>Search any city to see the current weather</p>
        <SearchBar />

        <button
          type="button"
          className={`${styles.chatBtn} ${isChatOpen ? styles.chatBtnActive : ''}`}
          onClick={toggleChat}
        >
          <FiMessageCircle size={18} />
          <span>Ask the Weather Assistant</span>
        </button>
      </div>

      <ErrorMessage message={error} onDismiss={() => dispatch(clearError())} />

      {loading && <Loader />}

      {!loading && !weather && !error && (
        <div className={styles.emptyState}>
          {/* <WiCloudRefresh size={60} /> */}
          {/* <p>Search city to see the current weather.</p> */}
        </div>
      )}

      {!loading && weather && (
        <>
          <WeatherCard weather={weather} />
          <WeatherDetails weather={weather} />
        </>
      )}
    </div>
  );
}

export default Home;