import React from 'react';
import { useSelector } from 'react-redux';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from './WeatherCharts.module.css';

function TemperatureChart({ data }) {
  const unit = useSelector((state) => state.weather.unit);
  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  return (
    <div className={`card ${styles.chartCard}`}>
      <h3 className={styles.chartTitle}>Temperature</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0eaf5" />
          <XAxis dataKey="fullLabel" tick={{ fontSize: 11 }} interval={1} />
          <YAxis tick={{ fontSize: 11 }} unit={unitSymbol} />
          <Tooltip formatter={(value) => [`${value}${unitSymbol}`, 'Temp']} />
          <Line type="monotone" dataKey="temp" stroke="#2a5298" strokeWidth={2} dot={{ r: 3 }} name="Temperature" />
          <Line
            type="monotone"
            dataKey="feelsLike"
            stroke="#7ea6d8"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            name="Feels like"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TemperatureChart;
