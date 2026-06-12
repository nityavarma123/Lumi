import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApi, useMutation } from '../../hooks/useApi';
import * as activityApi from '../../api/activity';
import Lumi from '../../components/Lumi/Lumi';
import styles from './Activity.module.css';

const TYPES = ['walking','running','gym','cycling','yoga','stretching','swimming','other'];
const circ   = 2 * Math.PI * 38;

export default function Activity() {
  const { data, loading, refetch } = useApi(activityApi.getStats);
  const { mutate: createLog }      = useMutation(activityApi.create);
  const [form, setForm] = useState({ type:'walking', durationMinutes:30, caloriesBurned:'', steps:'', intensity:'medium' });
  const [saving, setSaving] = useState(false);

  const change = e => setForm(p => ({ ...p, [e.target.name]: e.target.type === 'range' || e.target.type === 'number' ? +e.target.value : e.target.value }));

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      await createLog({ ...form, caloriesBurned: form.caloriesBurned || Math.round(form.durationMinutes * 5.5) });
      refetch(); setForm({ type:'walking', durationMinutes:30, caloriesBurned:'', steps:'', intensity:'medium' });
    } catch {} finally { setSaving(false); }
  };

  const stats = data ?? { totalCal: 0, totalMins: 0, totalSteps: 0, logs: [] };
  const calPct = Math.min(Math.round((stats.totalCal / 500) * 100), 100);
  const minPct = Math.min(Math.round((stats.totalMins / 60) * 100), 100);

  const ring = (pct, color) => ({
    strokeDasharray: circ,
    strokeDashoffset: circ - (pct / 100) * circ,
    stroke: color,
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Lumi size={44} direction="idle" expression="excited" />
        <div>
          <h1 className={styles.title}>activity</h1>
          <p className={styles.sub}>every move counts — even the small ones</p>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Progress rings */}
      <div className={styles.ringRow}>
        {[
          { label:'calories burned', val:stats.totalCal, goal:500,  unit:'kcal', pct:calPct, color:'var(--accent)' },
          { label:'active minutes',  val:stats.totalMins, goal:60,  unit:'min',  pct:minPct, color:'var(--mint)'   },
          { label:'steps',           val:stats.totalSteps,goal:8000,unit:'',     pct:Math.min(Math.round((stats.totalSteps/8000)*100),100), color:'var(--sky)' },
        ].map(r => (
          <div key={r.label} className={styles.ringItem}>
            <svg width="100" height="100" viewBox="0 0 90 90" aria-hidden="true">
              <circle cx="45" cy="45" r="38" fill="none" stroke="var(--bg-3)" strokeWidth="7"/>
              <circle cx="45" cy="45" r="38" fill="none" strokeWidth="7"
                {...ring(r.pct, r.color)} strokeLinecap="round" transform="rotate(-90 45 45)"/>
              <text x="45" y="41" textAnchor="middle" fill={r.color}
                style={{fontSize:13,fontFamily:'var(--font-display)',fontWeight:800}}>{r.val.toLocaleString()}</text>
              <text x="45" y="54" textAnchor="middle" fill="var(--text-3)"
                style={{fontSize:8,fontFamily:'var(--font-body)',fontWeight:600}}>{r.unit || 'steps'}</text>
            </svg>
            <div className={styles.ringLabel}>{r.label}</div>
            <div className={styles.ringGoal}>of {r.goal.toLocaleString()} {r.unit}</div>
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      {/* Log form */}
      <form className={styles.logForm} onSubmit={submit}>
        <p className={styles.sectionLabel}>log activity</p>
        <div className={styles.typeGrid}>
          {TYPES.map(t => (
            <button key={t} type="button"
              className={`${styles.typeBtn} ${form.type===t?styles.typeActive:''}`}
              onClick={()=>setForm(p=>({...p,type:t}))}>{t}</button>
          ))}
        </div>
        <div className={styles.formRow}>
          <label className={styles.durLabel}>
            duration: <strong style={{color:'var(--accent)'}}>{form.durationMinutes} min</strong>
            <input type="range" name="durationMinutes" min="5" max="120" step="5" value={form.durationMinutes} onChange={change} style={{accentColor:'var(--accent)',marginTop:'.4rem',width:'100%'}}/>
          </label>
          <label className={styles.field}><span>intensity</span>
            <select name="intensity" value={form.intensity} onChange={change}>
              <option value="low">low</option><option value="medium">medium</option><option value="high">high</option>
            </select>
          </label>
        </div>
        <button type="submit" className={styles.submitBtn} disabled={saving}>
          <Plus size={14} strokeWidth={2.5}/> {saving?'saving…':`log ${form.type} · ${form.durationMinutes} min`}
        </button>
      </form>

      {/* Log list */}
      {stats.logs?.length > 0 && (
        <>
          <div className={styles.divider}/>
          <p className={styles.sectionLabel}>today's log</p>
          <div className={styles.logList}>
            {stats.logs.map(a => (
              <div key={a._id} className={styles.logItem}>
                <span className={styles.logType}>{a.type}</span>
                <span className={styles.logTime}>{new Date(a.date).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                <span className={styles.logDur}>{a.durationMinutes} min</span>
                <span className={styles.logCal} style={{color:'var(--peach)'}}>{a.caloriesBurned} kcal</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
