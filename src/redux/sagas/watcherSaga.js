import { takeLatest } from 'redux-saga/effects';
import * as types from '../types/weatherTypes';
import { fetchWeatherSaga, fetchForecastSaga, fetchByLocationSaga } from './weatherSaga';

export function* watchWeather() {
  yield takeLatest(types.FETCH_WEATHER_REQUEST, fetchWeatherSaga);
  yield takeLatest(types.FETCH_BY_LOCATION_REQUEST, fetchByLocationSaga);
}

export function* watchForecast() {
  yield takeLatest(types.FETCH_FORECAST_REQUEST, fetchForecastSaga);
}
