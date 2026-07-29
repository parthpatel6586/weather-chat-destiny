import React from 'react';
import styles from './ErrorMessage.module.css';

function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className={styles.wrap}>
      <span>{message}</span>
      {onDismiss && (
        <button className={styles.dismiss} onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
