import React from 'react';
import styles from './Loader.module.css';

function Loader({ label = 'Loading...' }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner}></div>
      <p>{label}</p>
    </div>
  );
}

export default Loader;
