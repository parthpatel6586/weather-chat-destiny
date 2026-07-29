# Weather Forecast App

A React weather app built with classic Redux (no Redux Toolkit), Redux Saga, React Router, Axios, and CSS Modules.

## Setup

```bash
npm install
cp .env.example .env
```

Add a free API key from OpenWeatherMap (https://openweathermap.org/api) to `.env`:

```
VITE_WEATHER_API_KEY=your_key_here
```

New keys can take up to 10 minutes to activate after signup.

## Run

```bash
npm run dev
```

## Live weather chat (Gemini)

The navbar "Chat" button opens a live assistant powered by the Gemini API. The Gemini key is
only ever used **server-side** — it's never sent to the browser — so a small proxy server in
`/server` is required alongside the frontend.

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Then, in two terminals:

```bash
# terminal 1 — chat proxy
cd server
npm run dev

# terminal 2 — frontend
npm run dev
```

The frontend calls the proxy at the URL in `VITE_CHAT_API_URL` (defaults to
`http://localhost:5000`). The chat widget also sends the currently viewed city/temperature/
conditions along with each message so Gemini can answer questions about "the weather right now".

> **Security note:** never put `GEMINI_API_KEY` in the frontend `.env` (anything prefixed
> `VITE_` is bundled into the client JavaScript and readable by anyone). Keep it only in
> `server/.env`, which is git-ignored.

## Build

```bash
npm run build
npm run preview
```

## Features

- Search weather by city (debounced)
- Current weather: temperature, feels-like, humidity, pressure, wind, sunrise/sunset, icon
- 5-day forecast (max/min temp per day, condition, icon)
- Search history (last 10 cities), saved in localStorage
- Refresh button
- Loading spinner
- Error handling (invalid city, no internet, API errors)
- Empty state
- °C / °F toggle
- Use my location (geolocation)

## Folder Structure

```
src/
  api/           axios.js, weatherApi.js, chatApi.js
  context/       ChatContext.jsx
  redux/
    types/       weatherTypes.js
    actions/     weatherActions.js
    reducers/    weatherReducer.js, rootReducer.js
    sagas/       weatherSaga.js, watcherSaga.js, rootSaga.js
    store.js
  components/    Navbar, SearchBar, WeatherCard, ForecastCard, WeatherDetails, HistoryList, Loader, ErrorMessage, ChatWidget
  pages/         Home, Forecast, SearchHistory

server/          Express proxy that holds GEMINI_API_KEY and calls the Gemini API
```

## Redux Saga flow

```
User searches a city
  -> dispatch(FETCH_WEATHER_REQUEST)
  -> takeLatest (watcherSaga.js)
  -> fetchWeatherSaga: select(unit) -> retry(call(api.fetchCurrentWeather))
  -> put(FETCH_WEATHER_SUCCESS) or put(FETCH_WEATHER_FAILURE)
  -> weatherReducer updates the store
  -> components re-render via useSelector
```

Concepts used: `takeLatest`, `call`, `put`, `select`, `all`, `fork`, `delay`, `retry`.

## Testing notes

- `npm run build` runs cleanly with no errors.
- The forecast-grouping logic (`groupForecastByDay` in `weatherApi.js`) was tested offline against a mock OpenWeatherMap-shaped response to confirm it returns exactly 5 days with correct max/min temps.
- Live API calls need a real OpenWeatherMap key in `.env` — without one, requests will fail with an "Invalid API key" error, which the app displays correctly.
