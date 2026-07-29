import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiMapPin } from 'react-icons/fi';
import WeatherCard from '../components/WeatherCard';
import WeatherDetails from '../components/WeatherDetails';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { fetchByLocationRequest, clearError } from '../redux/actions/weatherActions';
import { fetchReverseGeocode } from '../api/weatherApi';
import styles from './MapView.module.css';
import SearchBar from '../components/SearchBar';


const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

let leafletLoadPromise = null;

// Loads Leaflet from a CDN on demand, so the map library is only
// fetched when someone actually visits the map page.
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve, reject) => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS_URL;
      document.head.appendChild(link);
    }

    const existingScript = document.getElementById('leaflet-js');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.L));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load the map library.')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = LEAFLET_JS_URL;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('Failed to load the map library.'));
    document.body.appendChild(script);
  });

  return leafletLoadPromise;
}

function MapView() {
  const { weather, loading, error } = useSelector((state) => state.weather);
  const dispatch = useDispatch();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapContainerRef.current || mapRef.current) return;

        const markerIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const map = L.map(mapContainerRef.current).setView([20, 0], 2);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
          }

          setSelectedPlace(null);
          dispatch(fetchByLocationRequest(lat, lng));

          fetchReverseGeocode(lat, lng)
            .then((results) => {
              if (results && results[0]) {
                const place = results[0];
                setSelectedPlace(place.state ? `${place.name}, ${place.state}, ${place.country}` : `${place.name}, ${place.country}`);
              }
            })
            .catch(() => {});
        });

        setMapLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setMapError(err.message);
          setMapLoading(false);
        }
      });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.title}>Weather by Map</h1>
        {/* <p className={styles.subtitle}>Click anywhere on the map to see the weather there</p> */}



   
      </div>
      <div className="searchbar">      
          <SearchBar/>
    </div>

      <div className={`card ${styles.mapCard}`}>
        <div ref={mapContainerRef} className={styles.mapContainer} />
        {mapLoading && (
          <div className={styles.mapOverlay}>
            <Loader label="Loading map..." />
          </div>
        )}
        {selectedPlace && (
          <div className={styles.selectedPlace}>
            <FiMapPin size={16} />
            <span>{selectedPlace}</span>
          </div>
        )}
      </div>

      {mapError && <ErrorMessage message={mapError} />}

      <ErrorMessage message={error} onDismiss={() => dispatch(clearError())} />

      {loading && <Loader />}

      {!loading && weather && (
        <>
          <WeatherCard weather={weather} />
          <WeatherDetails weather={weather} />
        </>
      )}

      {!loading && !weather && !error && !mapError && (
        <p className={styles.hint}></p>
      )}
    </div>
  );
}

export default MapView;
