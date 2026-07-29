import axiosInstance from './axios';

export const fetchCurrentWeather = (city, units = 'metric') =>
  axiosInstance.get('/weather', { params: { q: city, units } }).then((res) => res.data);

export const fetchForecast = (city, units = 'metric') =>
  axiosInstance.get('/forecast', { params: { q: city, units } }).then((res) => groupForecastByDay(res.data));

export const fetchCurrentWeatherByCoords = (lat, lon, units = 'metric') =>
  axiosInstance.get('/weather', { params: { lat, lon, units } }).then((res) => res.data);

export const fetchCitySuggestions = (query, limit = 5) =>
  axiosInstance
    .get('https://api.openweathermap.org/geo/1.0/direct', {
      params: { q: query, limit },
    })
    .then((res) =>
      res.data.map((city) => ({
        name: city.name,
        country: city.country,
        state: city.state || '',
        lat: city.lat,
        lon: city.lon,
        label: city.state
          ? `${city.name}, ${city.state}, ${city.country}`
          : `${city.name}, ${city.country}`,
      }))
    );

export const fetchReverseGeocode = (lat, lon, limit = 1) =>
  axiosInstance
    .get('https://api.openweathermap.org/geo/1.0/reverse', {
      params: { lat, lon, limit },
    })
    .then((res) => res.data);

function groupForecastByDay(data) {
  const byDate = {};
  // const byTime = {};    

  data.list.forEach((entry) => {
    const date = entry.dt_txt.split(' ')[0];
    if (!byDate[date]) {
      byDate[date] = { date, temps: [], entries: [] };
    }
    byDate[date].temps.push(entry.main.temp);
    byDate[date].entries.push(entry);
  });

  return Object.values(byDate)
    .slice(0, 5)
    .map((day) => {
      const middayEntry =
        day.entries.find((e) => e.dt_txt.includes('12:00:00')) || day.entries[Math.floor(day.entries.length / 2)];

      return {
        date: day.date,
        maxTemp: Math.max(...day.temps),
        minTemp: Math.min(...day.temps),
        condition: middayEntry.weather[0].main,
        description: middayEntry.weather[0].description,
        icon: middayEntry.weather[0].icon,
      };
    });
}
