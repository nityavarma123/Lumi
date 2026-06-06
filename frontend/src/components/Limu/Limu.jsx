import React from 'react';
import styles from './Limu.module.css';

/**
 * Limu ghost mascot — inspired by classic cute ghost shape
 * Props:
 *   size       — pixel width
 *   direction  — 'idle' | 'left' | 'right' | 'bounce'
 *   expression — 'happy' | 'excited' | 'sleepy' | 'thinking'
 *   className
 */
export default function Limu({ size = 80, direction = 'idle', expression = 'happy', className = '' }) {
  const isMoving = direction !== 'idle';
  const dirClass = isMoving ? styles[`dir_${direction}`] : '';

  return (
    <div
      className={`${styles.wrapper} ${dirClass} ${className}`}
      style={{ width: size, height: size * 1.12 }}
      role="img"
      aria-label="Lumi, your cozy companion"
    >
      <svg
        viewBox="0 0 100 112"
        width={size}
        height={size * 1.12}
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          {/* Warm yellow gradient for 3D look */}
          <radialGradient id="ghostGrad" cx="38%" cy="28%" r="60%" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%"   stopColor="#FFFEF8" />
            <stop offset="45%"  stopColor="#FFF6D0" />
            <stop offset="100%" stopColor="#F5DFA0" />
          </radialGradient>

          {/* Subtle drop shadow */}
          <filter id="ghostShadow" x="-15%" y="-8%" width="130%" height="130%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="rgba(160,110,40,0.22)" />
          </filter>
        </defs>

        {/* ── GHOST BODY ─────────────────────────────────────────
            Classic ghost shape:
            - Smooth dome on top
            - Sides flare gently
            - 3 scallop bumps at the bottom
        ──────────────────────────────────────────────────────── */}
        <path
          d="
            M 50,10
            C 78,10 90,30 90,56
            C 90,67 88,75 86,79
            Q 79,94 71,79
            Q 63,64 55,79
            Q 47,94 39,79
            Q 31,64 23,79
            Q 16,94 14,79
            C 12,75 10,67 10,56
            C 10,30 22,10 50,10
            Z
          "
          fill="url(#ghostGrad)"
          stroke="#C4A870"
          strokeWidth="1.8"
          strokeLinejoin="round"
          filter="url(#ghostShadow)"
        />

        {/* Soft top-left highlight for 3D feel */}
        <ellipse
          cx="34" cy="28"
          rx="14" ry="11"
          fill="white" opacity="0.30"
          transform="rotate(-22 34 28)"
        />

        {/* ── FACE ─────────────────────────────────────────────── */}

        {/* Cheeks */}
        <ellipse cx="24" cy="58" rx="9"  ry="6.5" fill="#F4A8A0" opacity="0.50" />
        <ellipse cx="76" cy="58" rx="9"  ry="6.5" fill="#F4A8A0" opacity="0.50" />

        {/* Eyes — small round dots matching image 1 */}
        {expression === 'sleepy' ? (
          <>
            <path d="M 32,48 Q 38,45 44,48" stroke="#2C1E10" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 56,48 Q 62,45 68,48" stroke="#2C1E10" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : expression === 'thinking' ? (
          <>
            <ellipse cx="38" cy="47" rx="5.5" ry="6" fill="#2C1E10" />
            <ellipse cx="62" cy="47" rx="5.5" ry="5" fill="#2C1E10" />
            <ellipse cx="36" cy="44.5" rx="2" ry="2" fill="white" />
            <ellipse cx="60" cy="44.5" rx="2" ry="2" fill="white" />
          </>
        ) : (
          <>
            <ellipse cx="38" cy="48" rx="5.5" ry={expression === 'excited' ? 7 : 6} fill="#2C1E10" />
            <ellipse cx="62" cy="48" rx="5.5" ry={expression === 'excited' ? 7 : 6} fill="#2C1E10" />
            <ellipse cx="36" cy="45.5" rx="2.2" ry="2.2" fill="white" />
            <ellipse cx="60" cy="45.5" rx="2.2" ry="2.2" fill="white" />
          </>
        )}

        {/* Smile */}
        {expression === 'excited' ? (
          <path d="M 40,64 Q 50,74 60,64" stroke="#C4A870" strokeWidth="2.2"
            fill="rgba(244,200,120,0.18)" strokeLinecap="round" />
        ) : expression === 'sleepy' ? (
          <path d="M 43,64 Q 50,68 57,64" stroke="#C4A870" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 40,63 Q 50,72 60,63" stroke="#C4A870" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Tiny sparkle near ghost (optional, matches kawaii style) */}
        {expression === 'excited' && (
          <g opacity="0.6">
            <path d="M 90,20 L 91,16 L 92,20 L 96,21 L 92,22 L 91,26 L 90,22 L 86,21 Z" fill="#F5C530" />
          </g>
        )}

        {/* Floor shadow */}
        <ellipse cx="50" cy="108" rx="24" ry="4" fill="rgba(140,100,40,0.15)" className={styles.shadow} />
      </svg>
    </div>
  );
}
