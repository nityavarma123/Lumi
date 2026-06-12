import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useApi, useMutation } from '../../hooks/useApi';
import * as scheduleApi from '../../api/schedule';
import Lumi from '../../components/Lumi/Lumi';
import styles from './Schedule.module.css';

const EC = { class:'var(--sky)', study:'var(--lumi-y)', gym:'var(--peach)', meal:'var(--mint)', sleep:'var(--lav)', other:'var(--text-3)' };

const toLocalISOStr = (d = new Date()) => {
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const DAYS = ['Today','Tomorrow','Wednesday','Thursday','Friday'];
const dayDate = (label) => {
  const d = new Date();
  const offset = DAYS.indexOf(label);
  d.setDate(d.getDate() + (offset >= 0 ? offset : 0));
  return d.toISOString().split('T')[0];
};

export default function Schedule() {
  const [activeDay, setActiveDay] = useState('Today');
  const dateStr = dayDate(activeDay);
  const { data: events, loading, refetch } = useApi(() => scheduleApi.getEvents(dateStr), [dateStr]);
  const { mutate: createEvent } = useMutation(scheduleApi.create);
  const { mutate: deleteEvent } = useMutation(scheduleApi.remove);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form, setForm] = useState({ title:'', type:'class', start: toLocalISOStr(), end: toLocalISOStr(new Date(Date.now()+3600000)), notes:'' });

  const change = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try { await createEvent(form); refetch(); setShowForm(false); setForm({ title:'', type:'class', start:toLocalISOStr(), end:toLocalISOStr(new Date(Date.now()+3600000)), notes:'' }); }
    catch {} finally { setSaving(false); }
  };

  const del = async (id) => { try { await deleteEvent(id); refetch(); } catch {} };

  const fmt = (iso) => new Date(iso).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Lumi size={44} direction="idle" expression="thinking" />
        <div>
          <h1 className={styles.title}>schedule</h1>
          <p className={styles.sub}>your life, organised</p>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Day tabs */}
      <div className={styles.dayTabs}>
        {DAYS.map(d => (
          <button key={d} className={`${styles.dayTab} ${activeDay===d?styles.dayActive:''}`}
            onClick={()=>setActiveDay(d)}>{d}</button>
        ))}
      </div>

      {/* Add button */}
      <div className={styles.timelineHead}>
        <span className={styles.sectionLabel}>{activeDay}'s timeline</span>
        <button className={styles.addBtn} onClick={()=>setShowForm(v=>!v)}>
          {showForm ? <><X size={12} strokeWidth={2.5}/> cancel</> : <><Plus size={12} strokeWidth={2.5}/> add event</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form className={styles.addForm} onSubmit={submit}>
          <div className={styles.formRow}>
            <label className={styles.field}><span>title</span>
              <input name="title" placeholder="e.g. DBMS lecture" value={form.title} onChange={change} required autoFocus/></label>
            <label className={styles.field}><span>type</span>
              <select name="type" value={form.type} onChange={change}>
                {Object.keys(EC).map(t=><option key={t} value={t}>{t}</option>)}
              </select></label>
          </div>
          <div className={styles.formRow}>
            <label className={styles.field}><span>start</span>
              <input type="datetime-local" name="start" value={form.start} onChange={change} required/></label>
            <label className={styles.field}><span>end</span>
              <input type="datetime-local" name="end" value={form.end} onChange={change} required/></label>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving?'saving…':'add event'}
          </button>
        </form>
      )}

      {/* Timeline */}
      <div className={styles.timeline}>
        {loading ? <p className={styles.empty}>loading...</p>
        : !events?.length ? <p className={styles.empty}>nothing scheduled for {activeDay.toLowerCase()} — add something!</p>
        : events.map(e => (
          <div key={e._id} className={styles.event} style={{'--c': EC[e.type] || EC.other}}>
            <div className={styles.evtTime}>{fmt(e.start)}</div>
            <div className={styles.evtDot}/>
            <div className={styles.evtCard}>
              <div className={styles.evtTitle}>{e.title}</div>
              <div className={styles.evtMeta}>
                <span className={styles.evtType}>{e.type}</span>
                <span>{fmt(e.start)} – {fmt(e.end)}</span>
              </div>
            </div>
            <button className={styles.delBtn} onClick={()=>del(e._id)} aria-label="Delete"><X size={12} strokeWidth={2.5}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}
