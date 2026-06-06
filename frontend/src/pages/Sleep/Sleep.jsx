import React, { useState } from 'react';
import { Plus, Moon, Trash2 } from 'lucide-react';
import { useApi, useMutation } from '../../hooks/useApi';
import * as sleepApi from '../../api/sleep';
import Limu from '../../components/Limu/Limu';
import styles from './Sleep.module.css';

const hourColour = (h) => {
  if (h < 5) return 'var(--rose)';
  if (h < 6) return 'var(--peach)';
  if (h < 7) return 'var(--sky)';
  return 'var(--mint)';
};

const toDateStr = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const fmtTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export default function Sleep() {
  const { data, loading, refetch } = useApi(sleepApi.getStats);
  const { mutate: createLog } = useMutation(sleepApi.create);
  const { mutate: deleteLog } = useMutation(sleepApi.remove);

  const [bedDate, setBedDate] = useState(toDateStr(0));
  const [bedTime, setBedTime] = useState('22:30');
  const [wakeDate, setWakeDate] = useState(toDateStr(1));
  const [wakeStr, setWakeStr] = useState('07:00');
  const [quality, setQuality] = useState(7);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const logs = data?.logs ?? [];
  const latest = logs[0];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const bedDatetime = new Date(`${bedDate}T${bedTime}`);
    const wakeDatetime = new Date(`${wakeDate}T${wakeStr}`);

    if (isNaN(bedDatetime) || isNaN(wakeDatetime)) {
      setError('Please fill in both bedtime and wake time.'); return;
    }
    if (wakeDatetime <= bedDatetime) {
      setError('Wake time must be after bedtime.'); return;
    }
    setSaving(true);
    try {
      await createLog({ bedtime: bedDatetime.toISOString(), wakeTime: wakeDatetime.toISOString(), quality });
      refetch();
      setError('');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteLog(id); refetch(); }
    catch { }
  };

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <Limu size={44} direction="idle" expression="sleepy" />
        <div>
          <h1 className={styles.title}>sleep</h1>
          <p className={styles.sub}>rest is not a reward — it's a requirement</p>
        </div>
      </div>

      <div className={styles.divider} />

      {loading ? <p className={styles.empty}>loading...</p> : (
        <>
          {/* ── Hero ── */}
          {latest ? (
            <div className={styles.hero}>
              <div>
                <div className={styles.bigNum}>{latest.durationHours}h</div>
                <div className={styles.bigLabel}>last night</div>
                {latest.quality && <div className={styles.bigSub}>quality {latest.quality}/10</div>}
              </div>
              {data?.avgHours != null && (
                <div className={styles.avgBlock}>
                  <div className={styles.avgNum}>{data.avgHours}h</div>
                  <div className={styles.avgLabel}>7-day average</div>
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
                {logs.slice().reverse().map((log, i) => (
                  <div key={i} className={styles.bar}>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{
                        height: `${Math.min((log.durationHours / 9) * 100, 100)}%`,
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

          {/* ── Log list with delete ── */}
          {logs.length > 0 && (
            <>
              <div className={styles.divider} />
              <p className={styles.sectionLabel}>all logs</p>
              <div className={styles.logList}>
                {logs.map(log => (
                  <div key={log._id} className={styles.logItem}>
                    <div className={styles.logInfo}>
                      <div className={styles.logDate}>{fmtDate(log.date)}</div>
                      <div className={styles.logMeta}>
                        {fmtTime(log.bedtime)} → {fmtTime(log.wakeTime)} · {log.durationHours}h
                        {log.quality ? ` · quality ${log.quality}/10` : ''}
                      </div>
                    </div>
                    <div className={styles.logHours} style={{ color: hourColour(log.durationHours) }}>
                      {log.durationHours}h
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(log._id)}
                      aria-label="Delete sleep log"
                    >
                      <Trash2 size={13} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className={styles.divider} />

          {/* ── Log form ── */}
          <p className={styles.sectionLabel}>log last night</p>
          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={submit} noValidate>
            <div className={styles.timeRow}>
              <Moon size={14} strokeWidth={2} className={styles.timeIcon} />
              <span className={styles.timeTitle}>bedtime</span>
              <div className={styles.timePickers}>
                <label className={styles.field}>
                  <span>date</span>
                  <input type="date" value={bedDate} max={toDateStr(0)}
                    onChange={e => setBedDate(e.target.value)} required />
                </label>
                <label className={styles.field}>
                  <span>time</span>
                  <input type="time" value={bedTime}
                    onChange={e => setBedTime(e.target.value)} required />
                </label>
              </div>
            </div>

            <div className={styles.timeRow}>
              <span className={styles.timeIcon} style={{ fontSize: '0.85rem' }}>☀️</span>
              <span className={styles.timeTitle}>wake time</span>
              <div className={styles.timePickers}>
                <label className={styles.field}>
                  <span>date</span>
                  <input type="date" value={wakeDate}
                    onChange={e => setWakeDate(e.target.value)} required />
                </label>
                <label className={styles.field}>
                  <span>time</span>
                  <input type="time" value={wakeStr}
                    onChange={e => setWakeStr(e.target.value)} required />
                </label>
              </div>
            </div>

            <div className={styles.qualityRow}>
              <span className={styles.qualityLabel}>
                sleep quality: <strong style={{ color: 'var(--accent)' }}>{quality} / 10</strong>
              </span>
              <input type="range" min="1" max="10" value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                style={{ accentColor: 'var(--accent)', width: '100%' }} />
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
