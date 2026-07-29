import { all, fork } from 'redux-saga/effects';
import { watchWeather, watchForecast } from './watcherSaga';

export default function* rootSaga() {
  yield all([fork(watchWeather), fork(watchForecast)]);
}
