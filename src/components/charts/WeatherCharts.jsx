import React from 'react';
import TemperatureChart from './TemperatureChart';
import HumidityChart from './HumidityChart';
import WindSpeedChart from './WindSpeedChart';
import RainProbabilityChart from './RainProbabilityChart';
import styles from './WeatherCharts.module.css';

// `data` is the hourlyForecast array from redux state: a list of 3-hour
// forecast points with temp, feelsLike, humidity, windSpeed and
// rainProbability, produced by src/api/weatherApi.js.
function WeatherCharts({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className={styles.grid}>
      <TemperatureChart data={data} />
      <HumidityChart data={data} />
      <WindSpeedChart data={data} />
      <RainProbabilityChart data={data} />
    </div>
  );
}

export default WeatherCharts;
