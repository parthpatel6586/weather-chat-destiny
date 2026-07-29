import React from 'react';
import { useSelector } from 'react-redux';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from './WeatherCharts.module.css';

function WindSpeedChart({ data }) {
  const unit = useSelector((state) => state.weather.unit);
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className={`card ${styles.chartCard}`}>
      <h3 className={styles.chartTitle}>Wind Speed</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0eaf5" />
          <XAxis dataKey="fullLabel" tick={{ fontSize: 11 }} interval={1} />
          <YAxis tick={{ fontSize: 11 }} unit={speedUnit} />
          <Tooltip formatter={(value) => [`${value} ${speedUnit}`, 'Wind']} />
          <Line type="monotone" dataKey="windSpeed" stroke="#5aa469" strokeWidth={2} dot={{ r: 3 }} name="Wind Speed" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WindSpeedChart;
