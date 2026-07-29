import * as types from '../types/weatherTypes';

const HISTORY_STORAGE_KEY = 'weather_search_history';

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
  }
};

const initialState = {
  loading: false,
  forecastLoading: false,
  weather: null,
  forecast: [],
  history: loadHistory(),
  error: null,
  unit: 'metric',
};

const weatherReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_WEATHER_REQUEST:
    case types.FETCH_BY_LOCATION_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_WEATHER_SUCCESS:
      return { ...state, loading: false, weather: action.payload, error: null };

    case types.FETCH_WEATHER_FAILURE:
      return { ...state, loading: false, weather: null, error: action.payload };

    case types.FETCH_FORECAST_REQUEST:
      return { ...state, forecastLoading: true };

    case types.FETCH_FORECAST_SUCCESS:
      return { ...state, forecastLoading: false, forecast: action.payload, error: null };

    case types.FETCH_FORECAST_FAILURE:
      return { ...state, forecastLoading: false, forecast: [], error: action.payload };

    case types.ADD_HISTORY: {
      const cityName = action.payload;
      const withoutDuplicate = state.history.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
      const updated = [cityName, ...withoutDuplicate].slice(0, 10);
      saveHistory(updated);
      return { ...state, history: updated };
    }

    case types.CLEAR_HISTORY:
      saveHistory([]);
      return { ...state, history: [] };

    case types.SET_UNIT:
      return { ...state, unit: action.payload };

    case types.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

export default weatherReducer;
