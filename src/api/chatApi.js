import axios from 'axios';

const chatAxios = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5000',
  timeout: 20000,
});

export const sendChatMessage = ({ message, history, weatherContext }) =>
  chatAxios
    .post('/api/chat', { message, history, weatherContext })
    .then((res) => res.data.reply)
    .catch((err) => {
      const serverMessage = err.response?.data?.error;
      throw new Error(serverMessage || 'Could not reach the weather assistant. Please try again.');
    });
