import React from 'react';
import Lottie from 'lottie-react';
import { WiRain, WiSnow, WiLightning, WiCloud, WiDaySunny } from 'react-icons/wi';
import { ANIMATION_SOURCES } from '../assets/lottie/animationSources';
import styles from './WeatherAnimation.module.css';

const FALLBACK_ICONS = {
  THUNDERSTORM: <WiLightning size={72} />,
  RAIN: <WiRain size={72} />,
  DRIZZLE: <WiRain size={72} />,
  SNOW: <WiSnow size={72} />,
  CLOUDS: <WiCloud size={72} />,
  DEFAULT: <WiDaySunny size={72} />,
};

function normalizeCondition(condition) {
  return (condition || '').toUpperCase();
}


const cache = new Map();

function WeatherAnimation({ condition, size = 140, className = '' }) {
  const key = normalizeCondition(condition);
  const source = ANIMATION_SOURCES[key];
  const [animationData, setAnimationData] = React.useState(source?.animationData || null);
  const [failed, setFailed] = React.useState(!source);

  React.useEffect(() => {
    let cancelled = false;

    if (!source) {
      setFailed(true);
      setAnimationData(null);
      return undefined;
    }

    if (source.animationData) {
      setAnimationData(source.animationData);
      setFailed(false);
      return undefined;
    }

    if (!source.path) {
      setFailed(true);
      return undefined;
    }

    if (cache.has(source.path)) {
      setAnimationData(cache.get(source.path));
      setFailed(false);
      return undefined;
    }

    setFailed(false);
    setAnimationData(null);

    fetch(source.path)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load animation');
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        cache.set(source.path, json);
        setAnimationData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [key, source]);

  const fallbackIcon = FALLBACK_ICONS[key] || FALLBACK_ICONS.DEFAULT;

  if (failed || !animationData) {
    return (
      <div className={`${styles.wrap} ${className}`} style={{ width: size, height: size }}>
        <div className={styles.fallback}>{fallbackIcon}</div>
      </div>
    );
  }

  return (
    <div className={`${styles.wrap} ${className}`} style={{ width: size, height: size }}>
      <Lottie animationData={animationData} loop autoplay style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default WeatherAnimation;
