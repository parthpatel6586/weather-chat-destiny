import * as types from '../types/weatherTypes';

export const fetchWeatherRequest = (city) => ({
  type: types.FETCH_WEATHER_REQUEST,
  payload: { city },
});

export const fetchWeatherSuccess = (weather) => ({
  type: types.FETCH_WEATHER_SUCCESS,
  payload: weather,
});

export const fetchWeatherFailure = (error) => ({
  type: types.FETCH_WEATHER_FAILURE,
  payload: error,
});

export const fetchByLocationRequest = (lat, lon) => ({
  type: types.FETCH_BY_LOCATION_REQUEST,
  payload: { lat, lon },
});

export const fetchForecastRequest = (city) => ({
  type: types.FETCH_FORECAST_REQUEST,
  payload: { city },
});

export const fetchForecastSuccess = (forecast) => ({
  type: types.FETCH_FORECAST_SUCCESS,
  payload: forecast,
});

export const fetchForecastFailure = (error) => ({
  type: types.FETCH_FORECAST_FAILURE,
  payload: error,
});

export const addHistory = (city) => ({
  type: types.ADD_HISTORY,
  payload: city,
});

export const clearHistory = () => ({
  type: types.CLEAR_HISTORY,
});

export const setUnit = (unit) => ({
  type: types.SET_UNIT,
  payload: unit,
});

export const clearError = () => ({
  type: types.CLEAR_ERROR,
});
