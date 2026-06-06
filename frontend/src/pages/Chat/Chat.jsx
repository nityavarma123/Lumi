import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Moon, BookOpen, Apple, Activity } from 'lucide-react';
import { useApi }                from '../../hooks/useApi';
import { getDashboard }          from '../../api/dashboard';
import { sendContextualMessage } from '../../api/chat';
import { useApp }                from '../../context/AppContext';
import Limu                      from '../../components/Limu/Limu';
import styles                    from './Chat.module.css';

// ─── Suggested prompts ───────────────────────────────────────────────────────
const SUGGESTIONS = [
  { emoji: '📊', text: 'How am I doing this week overall?' },
  { emoji: '🥩', text: 'How can I get more protein today?'  },
  { emoji: '💪', text: 'Find a gap in my schedule for a workout' },
  { emoji: '🌙', text: "My sleep has been rough — what should I do?" },
  { emoji: '🎯', text: "I can't focus. Help me structure my study session" },
  { emoji: '🥗', text: 'What should I eat for my next meal?' },
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "hey! I'm Lumi 🌿 I can see your schedule, sleep, nutrition, and activity data — ask me anything and I'll give you real, personalised advice.",
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function Chat() {
  const { user }                    = useApp();
  const { data: dashboard, loading: dataLoading } = useApi(getDashboard);

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input,    setInput]    = useState('');
  const [sending,  setSending]  = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = useCallback(async (text) => {
    const content = (text || input).trim();
    if (!content || sending) return;

    setMessages(prev => [...prev, { role: 'user', content }]);
    setInput('');
    setSending(true);

    try {
      const history = messages
        .slice(-16)
        .map(({ role, content: c }) => ({ role, content: c }));

      const { reply } = await sendContextualMessage(content, history);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Try again in a moment 🌿",
      }]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [input, messages, sending]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // ─── Data for context panel ────────────────────────────────────────────────
  const stats = dashboard?.stats;
  const goals = user?.goals ?? {};

  const dataPoints = stats
    ? [
        {
          Icon: Moon,
          label: 'sleep',
          value: `${stats.sleep.hours}h`,
          pct: Math.min(Math.round((stats.sleep.hours / (goals.sleepHours ?? 8)) * 100), 100),
          color: 'var(--sky)',
        },
        {
          Icon: BookOpen,
          label: 'study',
          value: `${Math.floor(stats.study.mins / 60)}h ${stats.study.mins % 60}m`,
          pct: Math.min(Math.round((stats.study.mins / ((goals.studyHours ?? 4) * 60)) * 100), 100),
          color: 'var(--limu-y)',
        },
        {
          Icon: Apple,
          label: 'nutrition',
          value: `${stats.nutrition.calories} cal`,
          pct: Math.min(Math.round((stats.nutrition.calories / (goals.calories ?? 2000)) * 100), 100),
          color: 'var(--mint)',
        },
        {
          Icon: Activity,
          label: 'activity',
          value: `${stats.activity.mins} min`,
          pct: Math.min(Math.round((stats.activity.mins / (goals.activityMins ?? 60)) * 100), 100),
          color: 'var(--peach)',
        },
      ]
    : [];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <Limu size={48} direction="idle" expression="happy" />
          <div>
            <h1 className={styles.title}>chat with lumi</h1>
            <p className={styles.subtitle}>your personal wellness AI — asks me anything about your day</p>
          </div>
        </div>
        <span className={styles.contextBadge}>
          <Sparkles size={11} strokeWidth={2.5} aria-hidden="true" />
          sees your real data
        </span>
      </div>

      <div className={styles.divider} />

      {/* ── Two-column layout ── */}
      <div className={styles.layout}>

        {/* ── Chat pane ── */}
        <section className={styles.chatPane} aria-label="Chat with Lumi">
          <div className={styles.messages} role="log" aria-live="polite">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.row} ${m.role === 'user' ? styles.rowUser : styles.rowBot}`}
              >
                {m.role === 'assistant' && (
                  <div className={styles.botAvatar} aria-hidden="true">
                    <Limu size={26} direction="idle" expression="happy" />
                  </div>
                )}
                <div className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                  {m.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className={`${styles.row} ${styles.rowBot}`}>
                <div className={styles.botAvatar} aria-hidden="true">
                  <Limu size={26} direction="idle" expression="thinking" />
                </div>
                <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                  <span className={styles.typing} aria-label="Lumi is typing">
                    <span /><span /><span />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={styles.inputBar}>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ask lumi anything about your wellness..."
              disabled={sending}
              autoFocus
              aria-label="Message input"
            />
            <button
              className={styles.sendBtn}
              onClick={() => send()}
              disabled={!input.trim() || sending}
              aria-label="Send message"
            >
              <Send size={15} strokeWidth={2.2} />
            </button>
          </div>
        </section>

        {/* ── Context panel ── */}
        <aside className={styles.contextPane} aria-label="Your wellness data">

          <p className={styles.panelLabel}>your data today</p>

          {dataLoading ? (
            <div className={styles.dataLoading}>loading your data...</div>
          ) : dataPoints.length > 0 ? (
            <div className={styles.dataList}>
              {dataPoints.map(({ Icon, label, value, pct, color }) => (
                <div key={label} className={styles.dataItem}>
                  <Icon size={13} strokeWidth={2} style={{ color }} aria-hidden="true" />
                  <div className={styles.dataInfo}>
                    <span className={styles.dataLabel}>{label}</span>
                    <span className={styles.dataValue}>{value}</span>
                  </div>
                  <div className={styles.dataBar} aria-label={`${pct}% of goal`}>
                    <div style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.dataEmpty}>log some data to see your stats here</p>
          )}

          <div className={styles.panelDivider} />

          <p className={styles.panelLabel}>ask lumi</p>
          <div className={styles.suggestions}>
            {SUGGESTIONS.map(({ emoji, text }) => (
              <button
                key={text}
                className={styles.suggestion}
                onClick={() => send(text)}
                disabled={sending}
              >
                <span aria-hidden="true">{emoji}</span>
                {text}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
