import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY. Add it to server/.env before starting the server.');
  process.exit(1);
}

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json({ limit: '1mb' }));

const requestLog = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function buildSystemPrompt(weatherContext) {
  const base =
    "You are the weather assistant built into the Weather App Destiny navbar chat. " +
    'Answer questions about weather, forecasts, and what to wear/plan for based on conditions. ' +
    'Keep replies short and conversational (2-4 sentences unless the user asks for detail). ' +
    "If you don't have live data for something, say so instead of guessing exact numbers.";

  if (!weatherContext) return base;

  const { city, temp, unit, description, feelsLike, humidity } = weatherContext;
  const unitLabel = unit === 'imperial' ? '°F' : '°C';

  const contextLines = [
    city ? `The user is currently viewing weather for ${city}.` : null,
    typeof temp === 'number' ? `Current temperature: ${Math.round(temp)}${unitLabel}.` : null,
    typeof feelsLike === 'number' ? `Feels like: ${Math.round(feelsLike)}${unitLabel}.` : null,
    description ? `Conditions: ${description}.` : null,
    typeof humidity === 'number' ? `Humidity: ${humidity}%.` : null,
  ].filter(Boolean);

  if (contextLines.length === 0) return base;

  return `${base}\n\nCurrent app context:\n${contextLines.join('\n')}`;
}

app.post('/api/chat', async (req, res) => {
  try {
    const ip = req.ip || 'unknown';
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many messages, please wait a moment and try again.' });
    }

    const { message, history, weatherContext } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A non-empty "message" string is required.' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message is too long.' });
    }

    const safeHistory = Array.isArray(history) ? history.slice(-10) : [];
    const contents = safeHistory
      .filter((turn) => turn && typeof turn.text === 'string' && (turn.role === 'user' || turn.role === 'model'))
      .map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] }));

    contents.push({ role: 'user', parts: [{ text: message }] });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: buildSystemPrompt(weatherContext) }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
      }),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', data);
      return res.status(502).json({ error: data?.error?.message || 'The chat service is unavailable right now.' });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';

    if (!reply) {
      return res.status(502).json({ error: "The assistant didn't return a response. Please try again." });
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chat proxy error:', err);
    res.status(500).json({ error: 'Something went wrong talking to the chat service.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Weather chat server listening on http://localhost:${PORT}`);
});
