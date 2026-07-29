import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiMapPin, FiMic } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchWeatherRequest,
  fetchForecastRequest,
  fetchByLocationRequest,
  fetchWeatherFailure,
  fetchSuggestionsRequest,
  clearSuggestions,
} from "../redux/actions/weatherActions";

import styles from "./SearchBar.module.css";

const DEBOUNCE_MS = 500;

function SearchBar() {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dispatch = useDispatch();
  const debounceTimer = useRef(null);
  const suggestionsTimer = useRef(null);
  const wrapperRef = useRef(null);

  const suggestions = useSelector((state) => state.weather.suggestions);

  const runSearch = (city) => {
    const trimmed = city.trim();

    if (!trimmed) return;

    dispatch(fetchWeatherRequest(trimmed));
    dispatch(fetchForecastRequest(trimmed));
    dispatch(clearSuggestions());
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    const next = e.target.value;

    setValue(next);
    setActiveIndex(-1);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounced weather search
    debounceTimer.current = setTimeout(() => {
      if (next.trim().length > 1) {
        runSearch(next);
      }
    }, DEBOUNCE_MS);

    // Fetch suggestions
    if (suggestionsTimer.current) {
      clearTimeout(suggestionsTimer.current);
    }

    if (next.trim().length >= 2) {
      dispatch(fetchSuggestionsRequest(next.trim()));
      setShowSuggestions(true);
    } else {
      dispatch(clearSuggestions());
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      selectSuggestion(suggestions[activeIndex]);
    } else {
      runSearch(value);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      dispatch(
        fetchWeatherFailure(
          "Geolocation is not supported by your browser."
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        dispatch(fetchByLocationRequest(latitude, longitude));
      },
      () => {
        dispatch(fetchWeatherFailure("Location access was denied."));
      }
    );
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      dispatch(
        fetchWeatherFailure(
          "Voice search is not supported in this browser."
        )
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const city = event.results[0][0].transcript;

      setValue(city);
      setShowSuggestions(false);
      dispatch(clearSuggestions());

      runSearch(city);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      dispatch(
        fetchWeatherFailure(
          event.error === "no-speech"
            ? "No speech detected."
            : "Voice recognition failed."
        )
      );
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const selectSuggestion = (suggestion) => {
    setValue(suggestion.name);
    setShowSuggestions(false);
    dispatch(clearSuggestions());
    runSearch(suggestion.name);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        dispatch(clearSuggestions());
        break;
      default:
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (suggestionsTimer.current) {
        clearTimeout(suggestionsTimer.current);
      }
    };
  }, []);

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <form
        className={styles.searchForm}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Search for a city..."
          className={styles.input}
          autoComplete="off"
        />

        {/* Current Location */}

        <button
          type="button"
          className={styles.locateBtn}
          onClick={handleLocate}
          title="Use My Location"
        >
          <FiMapPin size={18} />
        </button>

        {/* Voice Search */}

        <button
          type="button"
          className={`${styles.voiceBtn} ${
            isListening ? styles.listening : ""
          }`}
          onClick={handleVoiceSearch}
          title="Voice Search"
        >
          <FiMic
            size={18}
            color={isListening ? "#ff3b30" : "#333"}
          />
        </button>

        {/* Search */}

        <button
          type="submit"
          className={styles.searchBtn}
        >
          <FiSearch size={16} />
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.lat}-${suggestion.lon}`}
              className={`${styles.suggestionItem} ${
                index === activeIndex ? styles.active : ""
              }`}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <FiMapPin size={14} className={styles.pinIcon} />
              <span>{suggestion.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
