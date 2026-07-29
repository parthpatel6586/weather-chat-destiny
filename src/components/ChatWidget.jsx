import React, { useEffect, useRef, useState } from "react";
import { FiSend, FiX, FiCloudRain } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useChat } from "../context/ChatContext";
import { sendChatMessage } from "../api/chatApi";
import styles from "./ChatWidget.module.css";

const AI_MODELS = [
  {
    value: "gemini",
    label: " Gemini",
  },
  {
    value: "openai",
    label: " ChatGPT",
  },
  {
    value: "claude",
    label: " Claude",
  },
  {
    value: "deepseek",
    label: " DeepSeek",
  },
  {
    value: "grok",
    label: " Grok",
  },
];

const WELCOME_MESSAGE = {
  role: "model",
  text: "👋 Hi! I'm your AI Weather Assistant. Ask me anything about the weather, forecasts, clothing suggestions, travel, or climate.",
};

function buildWeatherContext(weather, unit) {
  if (!weather) return null;

  return {
    city: weather.name,
    temp: weather.main?.temp,
    feelsLike: weather.main?.feels_like,
    humidity: weather.main?.humidity,
    pressure: weather.main?.pressure,
    description: weather.weather?.[0]?.description,
    wind: weather.wind?.speed,
    unit,
  };
}

function ChatWidget() {
  const { isOpen, close } = useChat();

  const { weather, unit } = useSelector((state) => state.weather);

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);

  const [input, setInput] = useState("");

  const [selectedModel, setSelectedModel] = useState("gemini");

  const [isSending, setIsSending] = useState(false);

  const [error, setError] = useState("");

  const inputRef = useRef(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isSending]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();

    const trimmed = input.trim();

    if (!trimmed || isSending) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        text: trimmed,
      },
    ];

    setMessages(updatedMessages);

    setInput("");

    setError("");

    setIsSending(true);

    try {
      const reply = await sendChatMessage({
        provider: selectedModel,
        message: trimmed,
        history: updatedMessages,
        weatherContext: buildWeatherContext(weather, unit),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: reply,
        },
      ]);
    } catch (err) {
      setError(err.message || "Unable to contact AI.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={close}>
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <FiCloudRain size={18} />
            <span>Weather Assistant</span>
          </div>

          <div className={styles.headerRight}>
            <select
              className={styles.modelSelect}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {AI_MODELS.map((model) => (
                <option
                  key={model.value}
                  value={model.value}
                >
                  {model.label}
                </option>
              ))}
            </select>

            {/* <button
              className={styles.closeBtn}
              onClick={close}
            >
              <FiX size={18} />
            </button> */}
          </div>
        </div>

        {/* Messages */}

        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.bubble} ${
                msg.role === "user"
                  ? styles.userBubble
                  : styles.modelBubble
              }`}
            >
              {msg.text}
            </div>
          ))}

          {isSending && (
            <div
              className={`${styles.bubble} ${styles.modelBubble}`}
            >
              Thinking...
            </div>
          )}

          {error && (
            <div className={styles.errorBubble}>
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}

        <form
          className={styles.inputRow}
          onSubmit={handleSend}
        >
          <input
            ref={inputRef}
            className={styles.input}
            placeholder={`Ask ${AI_MODELS.find(
              (m) => m.value === selectedModel
            )?.label} anything...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
          />

          <button
            className={styles.sendBtn}
            disabled={!input.trim() || isSending}
          >
            <FiSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatWidget;