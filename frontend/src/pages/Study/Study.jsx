import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { useApi, useMutation } from '../../hooks/useApi';
import * as studyApi from '../../api/study';
import Lumi from '../../components/Lumi/Lumi';
import styles from './Study.module.css';

export default function Study() {
  const [secs,    setSecs]    = useState(25*60);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions,setSessions]= useState(0);
  const [subject, setSubject] = useState('');
  const ref = useRef(null);

  const { data: totals, loading, refetch } = useApi(studyApi.getTotals);
  const { data: loggedToday }              = useApi(studyApi.getSessions);
  const { mutate: createSession }          = useMutation(studyApi.create);
  const { mutate: deleteSession }          = useMutation(studyApi.remove);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSecs(s => {
        if (s <= 1) { clearInterval(ref.current); setRunning(false); setSessions(n => n+1); handlePomoDone(); return 0; }
        return s-1;
      }), 1000);
    }
    return () => clearInterval(ref.current);
  }, [running]);

  const handlePomoDone = async () => {
    if (!isBreak && subject) {
      try { await createSession({ subject, durationMinutes: 25, type: 'focus' }); refetch(); }
      catch {}
    }
  };

  const reset = () => { clearInterval(ref.current); setRunning(false); setSecs(isBreak ? 5*60 : 25*60); };
  const switchMode = (brk) => { clearInterval(ref.current); setRunning(false); setIsBreak(brk); setSecs(brk ? 5*60 : 25*60); };

  const mm = String(Math.floor(secs/60)).padStart(2,'0');
  const ss = String(secs%60).padStart(2,'0');

  const logManual = async () => {
    if (!subject) return;
    try {
      await createSession({ subject, durationMinutes: 45, type: 'focus' });
      refetch(); setSubject('');
    } catch {}
  };

  const del = async (id) => { try { await deleteSession(id); refetch(); } catch {} };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Lumi size={44} direction="idle" expression={running ? 'excited' : 'happy'} />
        <div>
          <h1 className={styles.title}>study</h1>
          <p className={styles.sub}>stay focused, take real breaks</p>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Pomodoro */}
      <div className={styles.timerSection}>
        <div className={styles.modeTabs}>
          <button className={`${styles.modeTab} ${!isBreak?styles.modeActive:''}`} onClick={()=>switchMode(false)}>focus · 25m</button>
          <button className={`${styles.modeTab} ${isBreak?styles.modeActive:''}`}  onClick={()=>switchMode(true)}>break · 5m</button>
        </div>
        <div className={styles.timerDisplay}>{mm}:{ss}</div>
        <p className={styles.timerSub}>session {sessions+1}</p>
        <div className={styles.timerControls}>
          <button className={styles.playBtn} onClick={()=>setRunning(r=>!r)}>
            {running ? <><Pause size={16} strokeWidth={2.5}/> pause</> : <><Play size={16} strokeWidth={2.5}/> start</>}
          </button>
          <button className={styles.ghostBtn} onClick={reset} aria-label="Reset"><RotateCcw size={15} strokeWidth={2}/></button>
        </div>
        <div className={styles.subjectRow}>
          <input className={styles.subjectInput} placeholder="what are you studying?" value={subject}
            onChange={e=>setSubject(e.target.value)} onKeyDown={e=>e.key==='Enter'&&logManual()} />
          <button className={styles.logBtn} onClick={logManual} disabled={!subject}>
            <Plus size={14} strokeWidth={2.5}/>
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Subject totals */}
      <div className={styles.section}>
        <p className={styles.sectionLabel}>today's subjects</p>
        {loading ? <p className={styles.empty}>loading...</p>
        : !totals?.length ? <p className={styles.empty}>no sessions logged yet — start your first one above</p>
        : totals.map(t => {
          const goal = 120;
          const pct  = Math.min(Math.round((t.totalMins/goal)*100), 100);
          return (
            <div key={t._id} className={styles.subjectRow2}>
              <div className={styles.subjectName}>{t._id}</div>
              <div className={styles.subjectMeta}>{Math.floor(t.totalMins/60)}h {t.totalMins%60}m · {t.count} session{t.count!==1?'s':''}</div>
              <div className={styles.barTrack}><div style={{width:`${pct}%`,background:'var(--lumi-y)'}}/></div>
            </div>
          );
        })}
      </div>

      {/* Today's log */}
      {loggedToday?.length > 0 && (
        <>
          <div className={styles.divider} />
          <div className={styles.section}>
            <p className={styles.sectionLabel}>today's log</p>
            {loggedToday.map(s => (
              <div key={s._id} className={styles.logItem}>
                <div>
                  <div className={styles.logName}>{s.subject}</div>
                  <div className={styles.logMeta}>{s.durationMinutes} min · {s.type} · {new Date(s.date).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                </div>
                <button className={styles.delBtn} onClick={()=>del(s._id)} aria-label="Delete"><Trash2 size={13} strokeWidth={2}/></button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
