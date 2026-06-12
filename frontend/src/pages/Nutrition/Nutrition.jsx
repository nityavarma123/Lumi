import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Search, X, Loader } from 'lucide-react';
import { useApi, useMutation }  from '../../hooks/useApi';
import * as nutritionApi        from '../../api/nutrition';
import { useApp }               from '../../context/AppContext';
import Lumi                     from '../../components/Lumi/Lumi';
import styles                   from './Nutrition.module.css';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const MACRO_CONFIG = [
  { key: 'calories', label: 'calories', unit: 'kcal', color: 'var(--accent)',  goalKey: 'calories'  },
  { key: 'protein',  label: 'protein',  unit: 'g',    color: 'var(--mint)',    goalKey: 'protein'   },
  { key: 'carbs',    label: 'carbs',    unit: 'g',    color: 'var(--sky)',     goalKey: 'carbs'     },
  { key: 'fat',      label: 'fat',      unit: 'g',    color: 'var(--peach)',   goalKey: 'fat'       },
];

const DEFAULT_GOALS = { calories: 2000, protein: 100, carbs: 250, fat: 65 };

const EMPTY_FORM = { name: '', mealType: 'snack', calories: '', protein: '', carbs: '', fat: '' };

export default function Nutrition() {
  const { user } = useApp();

  const { data: meals,  loading,  refetch } = useApi(nutritionApi.getMeals);
  const { data: totals }                    = useApi(nutritionApi.getTotals);
  const { mutate: createMeal }              = useMutation(nutritionApi.create);
  const { mutate: deleteMeal }              = useMutation(nutritionApi.remove);
  const { mutate: lookupFood }              = useMutation(nutritionApi.lookupFood);

  const [form,        setForm]        = useState(EMPTY_FORM);
  const [search,      setSearch]      = useState('');
  const [lookupQuery, setLookupQuery] = useState('');
  const [showForm,    setShowForm]    = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [looking,     setLooking]     = useState(false);
  const [lookupError, setLookupError] = useState('');

  const goals = { ...DEFAULT_GOALS, ...user?.goals };

  // ─── Lookup food via AI ────────────────────────────────────────────────────
  const handleLookup = useCallback(async () => {
    if (!lookupQuery.trim()) return;
    setLooking(true);
    setLookupError('');
    try {
      const result = await lookupFood(lookupQuery.trim());
      // Pre-fill the form with AI estimates — user can edit before saving
      setForm({
        name:     result.name     || lookupQuery,
        mealType: result.mealType || 'snack',
        calories: result.calories || '',
        protein:  result.protein  || '',
        carbs:    result.carbs    || '',
        fat:      result.fat      || '',
      });
      setShowForm(true);
      setLookupQuery('');
    } catch {
      setLookupError('Could not find that food. Try a more specific name.');
    } finally {
      setLooking(false);
    }
  }, [lookupQuery, lookupFood]);

  // ─── Submit new meal ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createMeal({
        ...form,
        calories: Number(form.calories) || 0,
        protein:  Number(form.protein)  || 0,
        carbs:    Number(form.carbs)    || 0,
        fat:      Number(form.fat)      || 0,
      });
      refetch();
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {}
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteMeal(id); refetch(); } catch {}
  };

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ─── Derived values ────────────────────────────────────────────────────────
  const t        = totals ?? {};
  const filtered = (meals ?? []).filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <Lumi size={44} direction="idle" expression="happy" />
        <div>
          <h1 className={styles.title}>nutrition</h1>
          <p className={styles.sub}>fuel your brain, feed your goals</p>
        </div>
      </div>

      <div className={styles.divider} />

      {/* ── Macro strip ── */}
      <div className={styles.macroStrip}>
        {MACRO_CONFIG.map(({ key, label, unit, color }) => {
          const val = t[key] ?? 0;
          const goal = goals[key] ?? DEFAULT_GOALS[key];
          const pct  = Math.min(Math.round((val / goal) * 100), 100);
          return (
            <div key={key} className={styles.macro}>
              <div className={styles.macroVal} style={{ color }}>
                {val}
                <span className={styles.macroUnit}>{unit}</span>
              </div>
              <div className={styles.macroLabel}>{label}</div>
              <div className={styles.macroBar}>
                <div style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className={styles.macroGoal}>of {goal} {unit}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.divider} />

      {/* ── AI Food Lookup ── */}
      <div className={styles.lookupSection}>
        <p className={styles.sectionLabel}>look up a food</p>
        <div className={styles.lookupRow}>
          <input
            className={styles.lookupInput}
            value={lookupQuery}
            onChange={e => setLookupQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder="e.g. chicken rice bowl, banana, protein shake..."
            disabled={looking}
          />
          <button
            className={styles.lookupBtn}
            onClick={handleLookup}
            disabled={!lookupQuery.trim() || looking}
            aria-label="Look up food"
          >
            {looking
              ? <><Loader size={13} strokeWidth={2} className={styles.spin} /> looking up…</>
              : <><Search size={13} strokeWidth={2} /> look up</>}
          </button>
        </div>
        {lookupError && <p className={styles.lookupError}>{lookupError}</p>}
        <p className={styles.lookupHint}>AI estimates nutrition — you can edit before saving</p>
      </div>

      <div className={styles.divider} />

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={13} strokeWidth={2} className={styles.searchIcon} aria-hidden="true" />
          <input
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="filter today's meals..."
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')} aria-label="Clear search">
              <X size={12} strokeWidth={2.5} />
            </button>
          )}
        </div>
        <button className={styles.addBtn} onClick={() => { setShowForm(v => !v); setForm(EMPTY_FORM); }}>
          {showForm
            ? <><X size={13} strokeWidth={2.5} /> cancel</>
            : <><Plus size={13} strokeWidth={2.5} /> add meal</>}
        </button>
      </div>

      {/* ── Add / edit form ── */}
      {showForm && (
        <form className={styles.addForm} onSubmit={handleSubmit} noValidate>
          <div className={styles.formRow}>
            <label className={styles.field}>
              <span>meal name</span>
              <input name="name" placeholder="e.g. oatmeal with berries" value={form.name}
                onChange={handleChange} required autoFocus />
            </label>
            <label className={styles.field}>
              <span>type</span>
              <select name="mealType" value={form.mealType} onChange={handleChange}>
                {MEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>

          <div className={styles.macroRow}>
            {[['calories','kcal'],['protein','g'],['carbs','g'],['fat','g']].map(([k, u]) => (
              <label key={k} className={styles.field}>
                <span>{k} <em>({u})</em></span>
                <input type="number" name={k} min="0" placeholder="0"
                  value={form[k]} onChange={handleChange} />
              </label>
            ))}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={saving || !form.name.trim()}>
            {saving ? 'saving…' : 'add meal'}
          </button>
        </form>
      )}

      {/* ── Meal list ── */}
      <div className={styles.mealList}>
        {loading
          ? <p className={styles.empty}>loading...</p>
          : filtered.length === 0
            ? <p className={styles.empty}>
                {search ? 'no meals match your search' : 'no meals logged today — look up a food above or add one manually'}
              </p>
            : filtered.map(m => (
                <div key={m._id} className={styles.mealItem}>
                  <div className={styles.mealInfo}>
                    <div className={styles.mealName}>{m.name}</div>
                    <div className={styles.mealMeta}>
                      {m.mealType} · {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className={styles.mealMacros}>
                    <span style={{ color: 'var(--accent)' }}>{m.calories} cal</span>
                    <span style={{ color: 'var(--mint)'   }}>P {m.protein}g</span>
                    <span style={{ color: 'var(--sky)'    }}>C {m.carbs}g</span>
                    <span style={{ color: 'var(--peach)'  }}>F {m.fat}g</span>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(m._id)}
                    aria-label={`Delete ${m.name}`}
                  >
                    <Trash2 size={13} strokeWidth={2} />
                  </button>
                </div>
              ))
        }
      </div>
    </div>
  );
}
