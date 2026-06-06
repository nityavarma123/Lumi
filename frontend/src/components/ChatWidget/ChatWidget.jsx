import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import Limu from '../Limu/Limu';
import { sendMessage } from '../../api/chat';
import { useApp } from '../../context/AppContext';
import styles from './ChatWidget.module.css';

export default function ChatWidget() {
  const { isLoggedIn } = useApp();
  const [open,     setOpen]    = useState(false);
  const [messages, setMessages]= useState([
    { role: 'assistant', content: "hey! i'm lumi 🌿 how can i help you today?" }
  ]);
  const [input,    setInput]   = useState('');
  const [loading,  setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  if (!isLoggedIn) return null;

  const submit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(p => [...p, userMsg]);
    setInput(''); setLoading(true);
    try {
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const { reply } = await sendMessage(userMsg.content, history);
      setMessages(p => [...p, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: "sorry, i'm having trouble connecting right now 🌿" }]);
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.wrap}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Limu size={36} direction="idle" expression="happy" />
              <div>
                <div className={styles.headerName}>lumi</div>
                <div className={styles.headerSub}>your wellness companion</div>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.msgUser : styles.msgBot}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className={`${styles.msg} ${styles.msgBot}`}>
                <span className={styles.typing}><span/><span/><span/></span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form className={styles.inputRow} onSubmit={submit}>
            <input
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="ask lumi anything..."
              disabled={loading}
              autoFocus
            />
            <button className={styles.sendBtn} type="submit" disabled={!input.trim() || loading} aria-label="Send">
              <Send size={15} strokeWidth={2} />
            </button>
          </form>
        </div>
      )}

      <button className={styles.fab} onClick={() => setOpen(o => !o)} aria-label="Open chat">
        {open ? <X size={20} strokeWidth={2} /> : <MessageCircle size={20} strokeWidth={2} />}
      </button>
    </div>
  );
}
