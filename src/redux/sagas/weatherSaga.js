import { call, put, select, delay, retry } from 'redux-saga/effects';
import * as api from '../../api/weatherApi';
import * as actions from '../actions/weatherActions';

const getUnit = (state) => state.weather.unit;

export function* fetchWeatherSaga(action) {
  const { city } = action.payload;
  try {
    yield delay(300);
    const unit = yield select(getUnit);

    const data = yield retry(3, 1000, api.fetchCurrentWeather, city, unit);

    yield put(actions.fetchWeatherSuccess(data));
    yield put(actions.addHistory(data.name));
  } catch (error) {
    yield put(actions.fetchWeatherFailure(error.message));
  }
}

export function* fetchByLocationSaga(action) {
  const { lat, lon } = action.payload;
  try {
    const unit = yield select(getUnit);
    const data = yield retry(3, 1000, api.fetchCurrentWeatherByCoords, lat, lon, unit);
    yield put(actions.fetchWeatherSuccess(data));
    yield put(actions.addHistory(data.name));
    yield put(actions.fetchForecastRequest(data.name));
  } catch (error) {
    yield put(actions.fetchWeatherFailure(error.message));
  }
}

export function* fetchForecastSaga(action) {
  const { city } = action.payload;
  try {
    const unit = yield select(getUnit);
    const data = yield call(api.fetchForecast, city, unit);
    yield put(actions.fetchForecastSuccess(data));
  } catch (error) {
    yield put(actions.fetchForecastFailure(error.message));
  }
}
