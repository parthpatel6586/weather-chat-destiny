import React from 'react';
import { NavLink } from 'react-router-dom';
import { WiDaySunny } from 'react-icons/wi';
import { useSelector, useDispatch } from 'react-redux';
import { setUnit } from '../redux/actions/weatherActions';
import styles from './Navbar.module.css';

function Navbar() {
  const unit = useSelector((state) => state.weather.unit);
  const dispatch = useDispatch();

  const toggleUnit = () => {
    dispatch(setUnit(unit === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.brand}>
          <WiDaySunny size={28} />
          <span>Weather App Destiny</span>
        </NavLink>

        <nav className={styles.links}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            Home
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            Map
          </NavLink>
          <NavLink to="/forecast" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            Forecast
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            History
          </NavLink>
        </nav>

        {/* <button className={styles.unitToggle} onClick={toggleUnit}>
          °{unit === 'metric' ? 'C' : 'F'}
        </button> */}
      </div>
    </header>
  );
}

export default Navbar;