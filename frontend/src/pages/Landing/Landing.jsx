import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import LandingSequence from '../../components/LandingSequence/LandingSequence';
import Lumi from '../../components/Lumi/Lumi';
import styles from './Landing.module.css';

export default function Landing() {
  const { hasSeenIntro, markIntroSeen, isLoggedIn, login, register, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(!hasSeenIntro);
  const [mode,    setMode]    = useState(null); // null | 'login' | 'signup'
  const [form,    setForm]    = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  if (isLoggedIn) { navigate('/dashboard'); return null; }
  if (showIntro)  return <LandingSequence onDone={() => { markIntroSeen(); setShowIntro(false); }} />;

  const change = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (mode === 'signup') await register(form);
      else                   await login(form);
      navigate('/dashboard');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.blob1}/><div className={styles.blob2}/>
      <button className={styles.themePill} onClick={toggleTheme}>
        {theme === 'dark' ? '☀️ light' : '🌙 dark'}
      </button>

      {!mode ? (
        <div className={styles.hero}>
          <Lumi size={108} direction="idle" expression="excited" />
          <h1 className={styles.name}>lumi</h1>
          <p className={styles.tag}>feel better. study better. live better.</p>
          <p className={styles.desc}>your cozy AI companion for college life — tracking sleep, study, nutrition and wellness in one warm space.</p>
          <div className={styles.btns}>
            <button className={styles.btnP} onClick={() => setMode('signup')}>get started — it's free</button>
            <button className={styles.btnS} onClick={() => setMode('login')}>log in</button>
          </div>
          <div className={styles.pills}>
            {['sleep','study','nutrition','activity','schedule','wellness'].map(p =>
              <span key={p} className={styles.pill}>{p}</span>)}
          </div>
        </div>
      ) : (
        <div className={styles.authWrap}>
          <div className={styles.card}>
            <Lumi size={50} direction="idle" expression="happy" />
            <h2 className={styles.cardTitle}>{mode === 'signup' ? "join lumi 🌿" : "welcome back ✨"}</h2>
            <p className={styles.cardSub}>{mode === 'signup' ? "let's set up your space" : "good to see you"}</p>
            {error && <div className={styles.err}>{error}</div>}
            <form onSubmit={submit} className={styles.form} noValidate>
              {mode === 'signup' && (
                <label className={styles.field}><span>name</span>
                  <input type="text" name="name" placeholder="alex" value={form.name} onChange={change} required autoFocus /></label>
              )}
              <label className={styles.field}><span>email</span>
                <input type="email" name="email" placeholder="you@uni.edu" value={form.email} onChange={change} required /></label>
              <label className={styles.field}><span>password</span>
                <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={change} required minLength={6} /></label>
              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? 'just a sec…' : mode === 'signup' ? 'create account' : 'log in'}
              </button>
            </form>
            <button className={styles.switchBtn} onClick={() => { setMode(m => m==='login'?'signup':'login'); setError(''); }}>
              {mode === 'signup' ? 'already have an account? log in' : "new here? sign up"}
            </button>
            <button className={styles.backBtn} onClick={() => { setMode(null); setError(''); }}>← back</button>
          </div>
        </div>
      )}
    </div>
  );
}
