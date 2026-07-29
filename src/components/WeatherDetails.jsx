import React from 'react';
import { useSelector } from 'react-redux';
import { WiHumidity, WiBarometer, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';
import styles from './WeatherDetails.module.css';

function formatTime(unixSeconds, timezoneOffsetSeconds) {
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
}

function WeatherDetails({ weather }) {
  const unit = useSelector((state) => state.weather.unit);  
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  const items = [
    { icon: <WiHumidity size={28} />, label: 'Humidity', value: `${weather.main.humidity}%` },
    { icon: <WiBarometer size={28} />, label: 'Pressure', value: `${weather.main.pressure} hPa` },
    { icon: <WiStrongWind size={28} />, label: 'Wind Speed', value: `${weather.wind.speed} ${speedUnit}` },
    { icon: <WiSunrise size={28} />, label: 'Sunrise', value: formatTime(weather.sys.sunrise, weather.timezone) },
    { icon: <WiSunset size={28} />, label: 'Sunset', value: formatTime(weather.sys.sunset, weather.timezone) },
  ];

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.label} className={`card ${styles.item}`}>
          {item.icon}
          <div>
            <p className={styles.value}>{item.value}</p>
            <p className={styles.label}>{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WeatherDetails;
