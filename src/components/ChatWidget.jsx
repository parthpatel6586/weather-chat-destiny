import React, { useEffect, useRef, useState } from 'react';
import { FiSend, FiX, FiCloudRain } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useChat } from '../context/ChatContext';
import { sendChatMessage } from '../api/chatApi';
import styles from './ChatWidget.module.css';

const WELCOME_MESSAGE = {
  role: 'model',
  text: "Hi! I'm your weather assistant. Ask me about the forecast, what to wear, or conditions in any city.",
};

const MODEL_OPTIONS = [
  { value: 'gemini', label: 'Gemini' },
  { value: 'chatgpt', label: 'ChatGPT' },
   { value: '', label: 'Cloude' },
  { value: '', label: 'Grok' },
];

function buildWeatherContext(weather, unit) {
  if (!weather) return null;

  return {
    city: weather.name,
    temp: weather.main?.temp,
    feelsLike: weather.main?.feels_like,
    humidity: weather.main?.humidity,
    description: weather.weather?.[0]?.description,
    unit,
  };
}

function ChatWidget() {
  const { isOpen, close } = useChat();
  const { weather, unit } = useSelector((state) => state.weather);

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState('gemini');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setIsSending(true);

    try {
      const reply = await sendChatMessage({
        message: trimmed,
        history: nextMessages,
        weatherContext: buildWeatherContext(weather, unit),
        provider,
      });
      setMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <FiCloudRain size={18} />
            <span>Weather Assistant</span>
          </div>
          <div className={styles.headerActions}>
            <select
              className={styles.modelSelect}
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              disabled={isSending}
              aria-label="Choose AI model"
            >
              {MODEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close chat">
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className={styles.messages}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.modelBubble}`}
            >
              {msg.text}
            </div>
          ))}

          {isSending && (
            <div className={`${styles.bubble} ${styles.modelBubble} ${styles.typing}`}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          )}

          {error && <div className={styles.errorBubble}>{error}</div>}

          <div ref={messagesEndRef} />
        </div>

        <form className={styles.inputRow} onSubmit={handleSend}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the weather..."
            className={styles.input}
            disabled={isSending}
          />
          <button type="submit" className={styles.sendBtn} disabled={isSending || !input.trim()} aria-label="Send">
            <FiSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatWidget;
