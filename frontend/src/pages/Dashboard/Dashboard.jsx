import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { getDashboard } from '../../api/dashboard';
import Limu from '../../components/Limu/Limu';
import styles from './Dashboard.module.css';

const MOODS = ['😊','😌','😤','😴','😰'];
const DAYS  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function Dashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);
  const { data, loading } = useApi(getDashboard);

  const h = new Date().getHours();
  const greet = h < 12 ? 'good morning' : h < 17 ? 'good afternoon' : 'good evening';
  const today = `${DAYS[new Date().getDay()]}, ${new Date().toLocaleDateString('en-US', { month:'long', day:'numeric' })}`;

  const stats = data?.stats;
  const goals = user?.goals ?? {};

  const pct = (v, g) => g ? Math.min(Math.round((v/g)*100), 100) : 0;

  const STAT_ITEMS = stats ? [
    { label:'sleep',     value:`${stats.sleep.hours}h`,     sub:`/ ${goals.sleepHours ?? 8}h goal`,    pct: pct(stats.sleep.hours, goals.sleepHours ?? 8),    color:'var(--sky)',  to:'/sleep'     },
    { label:'study',     value:`${Math.floor(stats.study.mins/60)}h ${stats.study.mins%60}m`, sub:`/ ${goals.studyHours ?? 4}h goal`, pct: pct(stats.study.mins, (goals.studyHours ?? 4)*60), color:'var(--limu-y)', to:'/study' },
    { label:'nutrition', value:`${stats.nutrition.calories} cal`, sub:`/ ${goals.calories ?? 2000} goal`, pct: pct(stats.nutrition.calories, goals.calories ?? 2000), color:'var(--mint)', to:'/nutrition'},
    { label:'activity',  value:`${stats.activity.mins} min`, sub:`/ ${goals.activityMins ?? 60}m goal`, pct: pct(stats.activity.mins, goals.activityMins ?? 60),  color:'var(--peach)', to:'/activity' },
  ] : [];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.greetSub}>{greet} · {today}</p>
          <h1 className={styles.greetName}>hey, {user?.name?.toLowerCase() ?? 'you'}</h1>
        </div>
        <div className={styles.limuWrap}>
          <Limu size={52} direction="idle" expression="happy" />
          {(user?.streak ?? 0) > 0 && <span className={styles.streak}>🔥 {user.streak}</span>}
        </div>
      </div>

      <div className={styles.divider} />

      {loading ? (
        <div className={styles.skeleton}>
          <div className={styles.skeletonLine} style={{ width:'120px', height:'60px' }} />
          <div className={styles.skeletonLine} style={{ width:'80%', height:'16px', marginTop:'8px' }} />
        </div>
      ) : (
        <>
          {/* Wellness headline */}
          <div className={styles.wellnessRow}>
            <div className={styles.scoreBlock}>
              <div className={styles.scoreNum}>–</div>
              <div className={styles.scoreLabel}>today's score</div>
            </div>
            <div className={styles.insightBlock}>
              <p className={styles.insightText}>{data?.insight ?? "how are you doing today? 🌿"}</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Stats strip */}
          {STAT_ITEMS.length > 0 && (
            <div className={styles.statsStrip}>
              {STAT_ITEMS.map(s => (
                <button key={s.label} className={styles.stat} onClick={() => navigate(s.to)}>
                  <div className={styles.statVal}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                  <div className={styles.statSub}>{s.sub}</div>
                  <div className={styles.statBar}>
                    <div style={{ width:`${s.pct}%`, background: s.color }} />
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className={styles.divider} />

          {/* Mood */}
          <div className={styles.moodSection}>
            <p className={styles.moodLabel}>how are you feeling right now?</p>
            <div className={styles.moodRow}>
              {MOODS.map(m => (
                <button key={m} className={`${styles.moodBtn} ${mood===m?styles.moodActive:''}`}
                  onClick={() => setMood(m)}>{m}</button>
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          {/* Quote */}
          <p className={styles.quote}>"small consistent steps lead to extraordinary results. you're already doing great." ✨</p>
        </>
      )}
    </div>
  );
}
