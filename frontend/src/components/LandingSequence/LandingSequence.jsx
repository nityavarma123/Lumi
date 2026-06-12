import React, { useState, useEffect, useRef } from 'react';
import { Moon, BookOpen, Apple, Activity, CalendarDays, Droplets } from 'lucide-react';
import Lumi from '../Lumi/Lumi';
import styles from './LandingSequence.module.css';

const FEATURES = [
  { Icon: Moon,         label: 'sleep',     desc: 'track rest & recovery',       color: '#88A8C4' },
  { Icon: BookOpen,     label: 'study',     desc: 'pomodoros & focus sessions',   color: '#F5C530' },
  { Icon: Apple,        label: 'nutrition', desc: 'gentle meal reminders',        color: '#88C4A0' },
  { Icon: Activity,     label: 'activity',  desc: 'movement & step goals',        color: '#E0A87A' },
  { Icon: CalendarDays, label: 'schedule',  desc: 'classes, gym & study blocks',  color: '#A898CC' },
  { Icon: Droplets,     label: 'wellness',  desc: 'mood & hydration check-ins',   color: '#90BC98' },
];

function Typewriter({ text, speed = 52 }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!text) return; setDisplayed(''); let i = 0;
    const id = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(id); }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <span>{displayed}<span className={styles.cursor} /></span>;
}

export default function LandingSequence({ onDone }) {
  const [phase,           setPhase]          = useState(0);
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [lumiDir,         setLumiDir]         = useState('idle');
  const [lumiPos,         setLumiPos]         = useState({ top: '44%', left: '50%' });
  const [showBubble,      setShowBubble]      = useState(false);
  const [hideFeatures,    setHideFeatures]    = useState(false);

  useEffect(() => {
    const ts = [];
    const t = (ms, fn) => { const id = setTimeout(fn, ms); ts.push(id); };

    t(200,  () => setShowBubble(true));
    t(3000, () => { setLumiDir('right'); setLumiPos({ top:'20%', left:'70%' }); });
    t(3500, () => { setLumiDir('idle'); setPhase(1); });
    t(5200, () => {
      setPhase(2);
      FEATURES.forEach((_, i) => t(5200 + i*900, () => setVisibleFeatures(p => [...p, i])));
    });
    t(13200, () => setHideFeatures(true));
    t(14000, () => { setLumiDir('left'); setLumiPos({ top:'44%', left:'50%' }); });
    t(14500, () => { setLumiDir('idle'); setPhase(3); });
    t(19000, () => { setPhase(4); onDone?.(); });

    return () => ts.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bubbleText = {
    0: "hi, i'm lumi ✨",
    1: "here are 6 things i help with 🌟",
    2: null,
    3: "i'm your friend & companion\nwho helps you get stuff done 🌿",
    4: null,
  }[phase];

  const inCorner = phase === 1 || phase === 2;

  return (
    <div className={styles.stage}>
      <div className={styles.blob1} /><div className={styles.blob2} /><div className={styles.blob3} />

      <div className={styles.lumiAnchor} style={{
        top: lumiPos.top, left: lumiPos.left,
        transition: 'top .5s cubic-bezier(.34,1.2,.64,1), left .5s cubic-bezier(.34,1.2,.64,1)',
      }}>
        <Lumi size={phase < 1 ? 100 : 76} direction={lumiDir} expression={phase === 0 ? 'excited' : 'happy'} />
        {showBubble && bubbleText && (
          <div className={`${styles.bubble} ${inCorner ? styles.bubbleCorner : ''}`} key={phase}>
            <Typewriter text={bubbleText} speed={phase === 3 ? 42 : 52} />
          </div>
        )}
      </div>

      {phase >= 2 && !hideFeatures && (
        <div className={styles.featuresWrap}>
          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <div key={f.label} className={`${styles.featureCard} ${visibleFeatures.includes(i) ? styles.featureIn : ''}`}>
                <f.Icon size={20} strokeWidth={1.8} color={f.color} aria-hidden="true" />
                <div>
                  <div className={styles.featureName}>{f.label}</div>
                  <div className={styles.featureSub}>{f.desc}</div>
                </div>
                <div className={styles.featureDot} style={{ background: f.color }} />
              </div>
            ))}
          </div>
        </div>
      )}

      <button className={styles.skipBtn} onClick={onDone}>skip</button>
    </div>
  );
}
