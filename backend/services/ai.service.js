const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// Read .env file directly — no dotenv dependency
const loadEnv = () => {
  try {
    fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8')
      .split('\n')
      .forEach(line => {
        const idx = line.indexOf('=');
        if (idx === -1) return;
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        if (key) process.env[key] = val;   // always overwrite
      });
  } catch { }
};

loadEnv();

// ─── Groq client (free) ───────────────────────────────────────────────────────
let _client;

const getClient = () => {
  if (_client) return _client;

  const key = process.env.GROQ_API_KEY;

  if (!key || !key.startsWith('gsk_')) {
    console.warn('⚠️  GROQ_API_KEY missing or invalid in backend/.env');
    return null;
  }

  console.log('✅ AI ready — Groq (llama-3.1-8b-instant)');
  _client = new OpenAI({
    apiKey: key,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  return _client;
};

const MODEL = 'llama-3.1-8b-instant';
const NO_KEY = "AI isn't set up yet — add GROQ_API_KEY to backend/.env 🌿 (free at console.groq.com)";

// ─── Lumi's personality ───────────────────────────────────────────────────────
const LUMI_PERSONA = `
You are Lumi, a warm caring AI wellness companion for college students inside the Lumi app.
Personality: gentle, encouraging, slightly playful — like a caring older sibling.
Tone: conversational, short paragraphs, soft emoji sparingly (🌿 ✨ 💛).
Always give concrete actionable advice, never vague platitudes.
2–4 sentences unless the user needs more detail.
No toxic productivity, no diet culture. Plain text only, no markdown.
`.trim();

// ─── Build rich context from user's live data ─────────────────────────────────
const buildContext = ({ user, sleep, study, nutrition, activity, schedule }) => {
  const events = (schedule || []).map(e => {
    const s = new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const en = new Date(e.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${s}–${en} ${e.title} (${e.type})`;
  }).join(' | ') || 'nothing scheduled';
  const subjects = (study || []).map(s => `${s._id} ${s.totalMins}min`).join(', ') || 'none';
  const studyTotal = (study || []).reduce((n, s) => n + s.totalMins, 0);
  return [
    `TIME: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
    `USER: ${user.name} | GOALS: sleep ${user.goals?.sleepHours ?? 8}h, study ${user.goals?.studyHours ?? 4}h, ${user.goals?.calories ?? 2000} cal, ${user.goals?.activityMins ?? 60} active min`,
    `SLEEP: ${sleep?.logs?.[0]?.durationHours ?? 'not logged'}h last night | quality ${sleep?.logs?.[0]?.quality ?? '–'}/10 | 7-day avg ${sleep?.avgHours ?? 0}h`,
    `STUDY: ${studyTotal}min today | ${subjects}`,
    `NUTRITION: ${nutrition?.calories ?? 0} cal | ${nutrition?.protein ?? 0}g protein | ${nutrition?.carbs ?? 0}g carbs | ${nutrition?.fat ?? 0}g fat`,
    `ACTIVITY: ${activity?.totalMins ?? 0} active mins | ${activity?.totalSteps ?? 0} steps`,
    `TODAY'S SCHEDULE: ${events}`,
  ].join('\n');
};

// ─── Simple chat — ChatWidget ─────────────────────────────────────────────────
const chat = async (message, history = [], userContext = '') => {
  const client = getClient();
  if (!client) return NO_KEY;
  const res = await client.chat.completions.create({
    model: MODEL, max_tokens: 280, temperature: 0.75,
    messages: [
      { role: 'system', content: `${LUMI_PERSONA}\n\n${userContext}` },
      ...history.slice(-12),
      { role: 'user', content: message },
    ],
  });
  return res.choices[0].message.content.trim();
};

// ─── Contextual chat — full Chat page ────────────────────────────────────────
const contextualChat = async (message, history = [], dataContext) => {
  const client = getClient();
  if (!client) return NO_KEY;
  const res = await client.chat.completions.create({
    model: MODEL, max_tokens: 400, temperature: 0.75,
    messages: [
      { role: 'system', content: `${LUMI_PERSONA}\n\n--- LIVE USER DATA ---\n${buildContext(dataContext)}` },
      ...history.slice(-16),
      { role: 'user', content: message },
    ],
  });
  return res.choices[0].message.content.trim();
};

// ─── Food nutrition lookup ────────────────────────────────────────────────────
const lookupNutrition = async (query) => {
  const client = getClient();
  if (!client) throw new Error('GROQ_API_KEY not configured');
  const res = await client.chat.completions.create({
    model: MODEL, max_tokens: 150, temperature: 0.1,
    messages: [
      { role: 'system', content: 'Nutrition database API. Reply ONLY with valid JSON, nothing else.' },
      { role: 'user', content: `Standard serving nutrition for: "${query}". JSON only: {"name":string,"calories":number,"protein":number,"carbs":number,"fat":number,"mealType":"breakfast"|"lunch"|"dinner"|"snack"}` },
    ],
  });
  return JSON.parse(res.choices[0].message.content.trim().replace(/```json|```/g, ''));
};

// ─── Wellness insight ─────────────────────────────────────────────────────────
const getInsight = async (type, stats) => {
  const client = getClient();
  if (!client) return NO_KEY;
  const prompts = {
    sleep: `Sleep: ${JSON.stringify(stats)}. One warm personalised sleep insight, 1–2 sentences.`,
    study: `Study: ${JSON.stringify(stats)}. One concise focus tip, 1–2 sentences.`,
    nutrition: `Nutrition: ${JSON.stringify(stats)}. One gentle nutrition reminder, 1–2 sentences.`,
    activity: `Activity: ${JSON.stringify(stats)}. One encouraging movement tip, 1–2 sentences.`,
    wellness: `Wellness: ${JSON.stringify(stats)}. One warm overall wellbeing insight, 2–3 sentences.`,
  };
  const res = await client.chat.completions.create({
    model: MODEL, max_tokens: 140, temperature: 0.8,
    messages: [
      { role: 'system', content: LUMI_PERSONA },
      { role: 'user', content: prompts[type] || prompts.wellness },
    ],
  });
  return res.choices[0].message.content.trim();
};

module.exports = { chat, contextualChat, lookupNutrition, getInsight, buildContext };