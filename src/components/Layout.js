import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Zap } from 'lucide-react';
import './Layout.css';

const NAV_ITEMS = [
  { path: '/', label: 'ANASAYFA', icon: '🏠' },
  { path: '/futbol', label: 'FUTBOL', icon: '⚽' },
  { path: '/basketbol', label: 'BASKETBOL', icon: '🏀' },
  { path: '/tenis', label: 'TENİS', icon: '🎾' },
  { path: '/formula1', label: 'FORMULA 1', icon: '🏎️' },
  { path: '/mma', label: 'MMA', icon: '🥊' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const padZ = n => String(n).padStart(2, '0');
  const timeStr = `${padZ(time.getHours())}:${padZ(time.getMinutes())}:${padZ(time.getSeconds())}`;

  return (
    <div className="layout">
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon"><Activity size={18} /></span>
            <span className="navbar__logo-text">SPORTS<strong>CANLI</strong></span>
          </Link>

          <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar__link ${location.pathname === item.path ? 'navbar__link--active' : ''}`}
              >
                <span className="navbar__link-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="navbar__right">
            <div className="navbar__live-badge">
              <span className="live-dot" />
              CANLI
            </div>
            <div className="navbar__time">
              <Zap size={11} />
              {timeStr}
            </div>
            <button
              className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menü"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <span>© 2026 SportsCanlı</span>
          <span className="footer__sep">·</span>
          <span>Veriler: API-Sports</span>
          <span className="footer__sep">·</span>
          <span>Tüm hakları saklıdır</span>
        </div>
      </footer>
    </div>
  );
}
