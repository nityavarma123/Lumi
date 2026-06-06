import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Moon, Apple,
  Activity, CalendarDays, MessageCircle,
  Sun, LogOut, Flame,
} from 'lucide-react';
import { useApp }  from '../../context/AppContext';
import Limu        from '../Limu/Limu';
import styles      from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', Icon: LayoutDashboard, label: 'home'      },
  { to: '/study',     Icon: BookOpen,        label: 'study'     },
  { to: '/sleep',     Icon: Moon,            label: 'sleep'     },
  { to: '/nutrition', Icon: Apple,           label: 'nutrition' },
  { to: '/activity',  Icon: Activity,        label: 'activity'  },
  { to: '/schedule',  Icon: CalendarDays,    label: 'schedule'  },
  { to: '/chat',      Icon: MessageCircle,   label: 'chat lumi' },
];

export default function Sidebar() {
  const { user, logout, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const initial = user?.name?.[0]?.toUpperCase() ?? 'A';

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className={styles.sidebar}>

        {/* Logo */}
        <button className={styles.logo} onClick={() => navigate('/dashboard')} aria-label="Go to dashboard">
          <Limu size={34} direction="idle" expression="happy" />
          <span className={styles.logoText}>limu</span>
        </button>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`
              }
            >
              <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark'
              ? <><Sun  size={13} strokeWidth={2} aria-hidden="true" /> light mode</>
              : <><Moon size={13} strokeWidth={2} aria-hidden="true" /> dark mode</>
            }
          </button>

          <div className={styles.userChip} aria-label={`Signed in as ${user?.name}`}>
            <div className={styles.avatar} aria-hidden="true">{initial}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.name ?? 'you'}</div>
              <div className={styles.userStreak}>
                <Flame size={10} strokeWidth={2.5} aria-hidden="true" />
                {user?.streak ?? 0} day streak
              </div>
            </div>
          </div>

          <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/'); }}>
            <LogOut size={13} strokeWidth={2} aria-hidden="true" /> log out
          </button>
        </div>
      </aside>

      {/* ── Mobile tab bar ── */}
      <nav className={styles.mobileBar} aria-label="Mobile navigation">
        {NAV_ITEMS.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
            }
          >
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
