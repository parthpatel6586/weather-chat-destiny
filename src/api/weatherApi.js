import axiosInstance from './axios';

export const fetchCurrentWeather = (city, units = 'metric') =>
  axiosInstance.get('/weather', { params: { q: city, units } }).then((res) => res.data);

export const fetchForecast = (city, units = 'metric') =>
  axiosInstance.get('/forecast', { params: { q: city, units } }).then((res) => buildForecastData(res.data));

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

// Flattens the raw 3-hour OpenWeather forecast entries into a chart-friendly
// array: temperature, humidity, wind speed and rain probability (pop) per slot.
function buildHourlySeries(data, limit = 16) {
  return data.list.slice(0, limit).map((entry) => {
    const date = new Date(entry.dt_txt.replace(' ', 'T'));
    return {
      dt: entry.dt,
      label: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      dayLabel: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fullLabel: date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', hour12: true }),
      temp: Math.round(entry.main.temp * 10) / 10,
      feelsLike: Math.round(entry.main.feels_like * 10) / 10,
      humidity: entry.main.humidity,
      windSpeed: Math.round(entry.wind.speed * 10) / 10,
      rainProbability: Math.round((entry.pop || 0) * 100),
      condition: entry.weather[0].main,
    };
  });
}

function buildForecastData(data) {
  const days = groupForecastByDay(data);
  const hourly = buildHourlySeries(data);
  return { days, hourly, city: data.city };
}
