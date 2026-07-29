import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiMapPin, FiMic } from "react-icons/fi";
import { useDispatch } from "react-redux";

import {
  fetchWeatherRequest,
  fetchForecastRequest,
  fetchByLocationRequest,
  fetchWeatherFailure,
} from "../redux/actions/weatherActions";
import { fetchCitySuggestions } from "../api/weatherApi";

import styles from "./SearchBar.module.css";

const DEBOUNCE_MS = 500;
const SUGGESTION_DEBOUNCE_MS = 300;
  
function SearchBar() {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const dispatch = useDispatch();
  const debounceTimer = useRef(null);
  const suggestionTimer = useRef(null);
  const wrapperRef = useRef(null);
  const suggestionsRequestId = useRef(0);

  const runSearch = (city) => {
    const trimmed = city.trim();

    if (!trimmed) return;

    dispatch(fetchWeatherRequest(trimmed));
    dispatch(fetchForecastRequest(trimmed));

    setShowSuggestions(false);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const loadSuggestions = (query) => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoadingSuggestions(false);
      return;
    }

    const requestId = ++suggestionsRequestId.current;

    setLoadingSuggestions(true);

    fetchCitySuggestions(trimmed)
      .then((results) => {
        if (requestId !== suggestionsRequestId.current) return;

        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setActiveIndex(-1);
      })
      .catch(() => {
        if (requestId !== suggestionsRequestId.current) return;

        setSuggestions([]);
        setShowSuggestions(false);
      })
      .finally(() => {
        if (requestId !== suggestionsRequestId.current) return;

        setLoadingSuggestions(false);
      });
  };

  const handleChange = (e) => {
    const next = e.target.value;

    setValue(next);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (suggestionTimer.current) {
      clearTimeout(suggestionTimer.current);
    }

    // debounceTimer.current = setTimeout(() => {
    //   if (next.trim().length > 1) {
    //     runSearch(next);
    //   }
    // }, DEBOUNCE_MS);
    if (suggestionTimer.current) {
  clearTimeout(suggestionTimer.current);
}

suggestionTimer.current = setTimeout(() => {
  loadSuggestions(next);
}, 300);

    suggestionTimer.current = setTimeout(() => {
      loadSuggestions(next);
    }, SUGGESTION_DEBOUNCE_MS);
  };

  const handleSelectSuggestion = (suggestion) => {
    setValue(suggestion.label);
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveIndex(-1);

    if(debounceTimer){
      clearTimeout.current(debouncerTimer.current);

    }
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (suggestionTimer.current) {
      clearTimeout(suggestionTimer.current);
    }

    runSearch(suggestion.name);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (suggestionTimer.current) {
      clearTimeout(suggestionTimer.current);
    }

    runSearch(value);
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
        dispatch(fetchWeatherFailureFailure("Location access was denied."));
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

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (suggestionTimer.current) {
        clearTimeout(suggestionTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <form
      className={styles.searchForm}
      onSubmit={handleSubmit}
      ref={wrapperRef}
    >
      <div className={styles.inputWrapper}>
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

        {showSuggestions && (
          <ul className={styles.suggestionsList}>
            {loadingSuggestions && (
              <li className={styles.suggestionLoading}>Searching...</li>
            )}
            {!loadingSuggestions &&
              suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.label}-${suggestion.lat}-${suggestion.lon}`}
                  className={`${styles.suggestionItem} ${
                    index === activeIndex ? styles.suggestionItemActive : ""
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(suggestion);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <FiMapPin size={14} className={styles.suggestionIcon} />
                  <span>{suggestion.label}</span>
                </li>
              ))}
          </ul>
        )}
      </div>


      <button
        type="button"
        className={styles.locateBtn}
        onClick={handleLocate}
        title="Use My Location"
      >
        <FiMapPin size={18} />
      </button>


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


      <button
        type="submit"
        className={styles.searchBtn}
      >
        <FiSearch size={16} />
        Search
      </button>
    </form>
  );
}

export default SearchBar;