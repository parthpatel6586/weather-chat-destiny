import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import styles from './WeatherCharts.module.css';

function RainProbabilityChart({ data }) {
  return (
    <div className={`card ${styles.chartCard}`}>
      <h3 className={styles.chartTitle}>Rain Probability</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0eaf5" />
          <XAxis dataKey="fullLabel" tick={{ fontSize: 11 }} interval={1} />
          <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, 'Chance of rain']} />
          <Bar dataKey="rainProbability" radius={[4, 4, 0, 0]} name="Rain Probability">
            {data.map((entry) => (
              <Cell key={entry.dt} fill={entry.rainProbability >= 50 ? '#2a5298' : '#a8c6ec'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RainProbabilityChart;
