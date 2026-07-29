import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from './WeatherCharts.module.css';

function HumidityChart({ data }) {
  return (
    <div className={`card ${styles.chartCard}`}>
      <h3 className={styles.chartTitle}>Humidity</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="humidityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3fa9f5" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#3fa9f5" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0eaf5" />
          <XAxis dataKey="fullLabel" tick={{ fontSize: 11 }} interval={1} />
          <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, 'Humidity']} />
          <Area type="monotone" dataKey="humidity" stroke="#3fa9f5" fill="url(#humidityFill)" strokeWidth={2} name="Humidity" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HumidityChart;
