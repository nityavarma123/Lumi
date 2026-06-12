import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Moon, Clock } from 'lucide-react';
import { useApi, useMutation } from '../../hooks/useApi';
import * as sleepApi from '../../api/sleep';
import Lumi from '../../components/Lumi/Lumi';
import styles from './Sleep.module.css';

/* ── helpers ── */
const hourColour = (h) => {
  if (h == null) return 'var(--text-3)';
  if (h < 5) return 'var(--rose)';
  if (h < 6) return 'var(--peach)';
  if (h < 7) return 'var(--sky)';
  return 'var(--mint)';
};

const qualityColor = (q) => {
  if (!q) return 'var(--text-3)';
  if (q <= 3) return 'var(--rose)';
  if (q <= 5) return 'var(--peach)';
  if (q <= 7) return 'var(--sky)';
  return 'var(--mint)';
};

const toDateStr = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const fmtTime = (iso) => {
  if (!iso) return '--:--';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const fmtLogDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'today';
  if (d.toDateString() === yesterday.toDateString()) return 'yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const chipLabel = (dateStr) => {
  if (dateStr === toDateStr(0)) return 'tonight';
  if (dateStr === toDateStr(-1)) return 'last night';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/* ── Custom TimePicker ── */
const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function TimePicker({ value, onChange, label, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const [rawH, rawM] = value.split(':').map(Number);
  const isPM = rawH >= 12;
  const h12 = rawH % 12 || 12;

  const apply = (newH12, newMin, newIsPM) => {
    const h24 = newIsPM ? (newH12 === 12 ? 12 : newH12 + 12) : (newH12 === 12 ? 0 : newH12);
    onChange(`${String(h24).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const display = `${h12}:${String(rawM).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;

  return (
    <div className={styles.tpWrap} ref={wrapRef}>
      <span className={styles.timeFieldLabel}>
        {Icon && <Icon size={11} strokeWidth={2.5} />} {label}
      </span>
      <button
        type="button"
        className={`${styles.tpDisplay} ${open ? styles.tpDisplayOpen : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <span>{display}</span>
        <Clock size={13} className={styles.tpClockIcon} strokeWidth={2} />
      </button>

      {open && (
        <div className={styles.tpDropdown}>
          <div className={styles.tpSection}>
            <span className={styles.tpSectionLabel}>hour</span>
            <div className={styles.tpGrid6}>
              {HOURS.map(h => (
                <button key={h} type="button"
                  className={`${styles.tpBtn} ${h12 === h ? styles.tpBtnActive : ''}`}
                  onClick={() => apply(h, rawM, isPM)}>
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tpSection}>
            <span className={styles.tpSectionLabel}>minute</span>
            <div className={styles.tpGrid6}>
              {MINUTES.map(m => (
                <button key={m} type="button"
                  className={`${styles.tpBtn} ${rawM === m ? styles.tpBtnActive : ''}`}
                  onClick={() => apply(h12, m, isPM)}>
                  {String(m).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tpAmpm}>
            {['AM', 'PM'].map(p => (
              <button key={p} type="button"
                className={`${styles.tpAmpmBtn} ${(isPM ? 'PM' : 'AM') === p ? styles.tpAmpmActive : ''}`}
                onClick={() => apply(h12, rawM, p === 'PM')}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main page ── */
export default function Sleep() {
  const { data, loading, refetch } = useApi(sleepApi.getStats);
  const { mutate: createLog } = useMutation(sleepApi.create);
  const { mutate: deleteLog } = useMutation(sleepApi.remove);

  const [sleepDate, setSleepDate] = useState(toDateStr(0));
  const [bedTime, setBedTime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(7);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const logs = data?.logs ?? [];
  const latest = logs[0] ?? null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const bedDatetime = new Date(`${sleepDate}T${bedTime}`);
    let wakeDatetime = new Date(`${sleepDate}T${wakeTime}`);
    if (wakeDatetime <= bedDatetime) wakeDatetime.setDate(wakeDatetime.getDate() + 1);

    if (isNaN(bedDatetime.getTime()) || isNaN(wakeDatetime.getTime())) {
      setError('Please fill in all fields.'); return;
    }
    setSaving(true);
    try {
      await createLog({ bedtime: bedDatetime.toISOString(), wakeTime: wakeDatetime.toISOString(), quality });
      refetch();
      setShowDatePicker(false);
      setError('');
    } catch (err) {
      setError(err?.message || 'Something went wrong.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteLog(id); refetch(); } catch { }
  };

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <Lumi size={44} direction="idle" expression="sleepy" />
        <div>
          <h1 className={styles.title}>sleep</h1>
          <p className={styles.sub}>rest is not a reward — it's a requirement</p>
        </div>
      </div>

      <div className={styles.divider} />

      {loading ? <p className={styles.empty}>loading...</p> : (
        <>
          {/* ── Stats ── */}
          {latest ? (
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={styles.statNum} style={{ color: hourColour(latest.durationHours) }}>
                  {latest.durationHours ?? '—'}<span className={styles.statUnit}>h</span>
                </div>
                <div className={styles.statLabel}>last night</div>
                <div className={styles.statSub}>{fmtTime(latest.bedtime)} → {fmtTime(latest.wakeTime)}</div>
              </div>

              {data?.avgHours != null && (
                <div className={styles.statCard}>
                  <div className={styles.statNum} style={{ color: 'var(--lav)' }}>
                    {data.avgHours}<span className={styles.statUnit}>h</span>
                  </div>
                  <div className={styles.statLabel}>7-day avg</div>
                  <div className={styles.statSub}>
                    {data.avgHours >= 7 ? 'on track ✓' : data.avgHours >= 6 ? 'almost there' : 'needs work'}
                  </div>
                </div>
              )}

              {latest.quality != null && (
                <div className={styles.statCard}>
                  <div className={styles.statNum} style={{ color: qualityColor(latest.quality) }}>
                    {latest.quality}<span className={styles.statUnit}>/10</span>
                  </div>
                  <div className={styles.statLabel}>quality</div>
                  <div className={styles.qualityDots}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <span key={i} className={styles.dot}
                        style={{ background: i < latest.quality ? qualityColor(latest.quality) : 'var(--bg-3)' }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className={styles.empty}>no sleep logged yet — add your first entry below</p>
          )}

          {/* ── Weekly chart ── */}
          {logs.length > 0 && (
            <>
              <div className={styles.divider} />
              <p className={styles.sectionLabel}>this week</p>
              <div className={styles.chart}>
                {logs.slice(0, 7).slice().reverse().map((log, i) => (
                  <div key={i} className={styles.bar}>
                    <div className={styles.barHours}>{log.durationHours}h</div>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{
                        height: `${Math.min(((log.durationHours ?? 0) / 9) * 100, 100)}%`,
                        background: hourColour(log.durationHours),
                      }} />
                    </div>
                    <span className={styles.barLabel}>
                      {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Log list ── */}
          {logs.length > 0 && (
            <>
              <div className={styles.divider} />
              <p className={styles.sectionLabel}>all logs</p>
              <div className={styles.logList}>
                {logs.map(log => (
                  <div key={log._id} className={styles.logItem}>
                    <div className={styles.logLeft}>
                      <div className={styles.logHours} style={{ color: hourColour(log.durationHours) }}>
                        {log.durationHours ?? '—'}h
                      </div>
                    </div>
                    <div className={styles.logInfo}>
                      <div className={styles.logDate}>{fmtLogDate(log.date)}</div>
                      <div className={styles.logMeta}>
                        {fmtTime(log.bedtime)} → {fmtTime(log.wakeTime)}
                        {log.quality ? ` · quality ${log.quality}/10` : ''}
                      </div>
                    </div>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(log._id)} aria-label="Delete">
                      <Trash2 size={13} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className={styles.divider} />

          {/* ── Log form ── */}
          <div className={styles.formHeader}>
            <p className={styles.sectionLabel} style={{ margin: 0 }}>log sleep</p>
            <button type="button" className={styles.dateChip} onClick={() => setShowDatePicker(v => !v)}>
              <Moon size={11} strokeWidth={2.5} />
              {chipLabel(sleepDate)}
            </button>
          </div>

          {showDatePicker && (
            <div className={styles.datePicker}>
              <input type="date" value={sleepDate} max={toDateStr(0)}
                onChange={e => setSleepDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={submit} noValidate>
            <div className={styles.timeRow}>
              <TimePicker value={bedTime} onChange={setBedTime} label="bedtime" icon={Moon} />
              <div className={styles.timeArrow}>→</div>
              <TimePicker value={wakeTime} onChange={setWakeTime} label="wake up" />
            </div>

            <div className={styles.qualityRow}>
              <div className={styles.qualityTop}>
                <span className={styles.qualityLabel}>sleep quality</span>
                <strong className={styles.qualityVal} style={{ color: qualityColor(quality) }}>{quality} / 10</strong>
              </div>
              <input type="range" min="1" max="10" value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                className={styles.slider}
                style={{ '--thumb-color': qualityColor(quality) }}
              />
              <div className={styles.qualityHints}><span>rough</span><span>great</span></div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={saving}>
              <Plus size={14} strokeWidth={2.5} />
              {saving ? 'saving…' : 'log sleep'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
