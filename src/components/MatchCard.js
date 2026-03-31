import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import './MatchCard.css';

const STATUS_MAP = {
  '1H': { label: '1.DEV', cls: 'live' },
  '2H': { label: '2.DEV', cls: 'live' },
  'HT': { label: 'DEV. A.', cls: 'halftime' },
  'ET': { label: 'UZ.D.', cls: 'live' },
  'BT': { label: 'UZ.A.', cls: 'halftime' },
  'P':  { label: 'PEN.', cls: 'live' },
  'FT': { label: 'MS', cls: 'finished' },
  'AET':{ label: 'MS(U)', cls: 'finished' },
  'PEN':{ label: 'MS(P)', cls: 'finished' },
  'NS': { label: 'BŞLMDI', cls: 'upcoming' },
  'TBD':{ label: 'TBD', cls: 'upcoming' },
  'PST':{ label: 'ERT.', cls: 'postponed' },
  'CANC':{ label: 'İPTAL', cls: 'postponed' },
  'SUSP':{ label: 'ASKIYA', cls: 'postponed' },
};

function formatTime(dateStr) {
  if (!dateStr) return '--:--';
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function MatchCard({ fixture, sport = 'football', showLeague = false }) {
  // Normalize different API response structures
  let home, away, score, status, time, id, league;

  if (sport === 'football') {
    const f = fixture;
    home = { name: f.teams?.home?.name, logo: f.teams?.home?.logo };
    away = { name: f.teams?.away?.name, logo: f.teams?.away?.logo };
    score = { home: f.goals?.home ?? '-', away: f.goals?.away ?? '-' };
    status = f.fixture?.status?.short || 'NS';
    time = formatTime(f.fixture?.date);
    id = f.fixture?.id;
    league = f.league?.name;
  } else if (sport === 'basketball') {
    const g = fixture;
    home = { name: g.teams?.home?.name, logo: g.teams?.home?.logo };
    away = { name: g.teams?.visitors?.name, logo: g.teams?.visitors?.logo };
    score = { home: g.scores?.home?.total ?? '-', away: g.scores?.visitors?.total ?? '-' };
    status = g.status?.short || 'NS';
    time = formatTime(g.date);
    id = g.id;
    league = g.league?.name;
  }

  const statusInfo = STATUS_MAP[status] || { label: status, cls: 'upcoming' };
  const isLive = statusInfo.cls === 'live';
  const linkPath = sport === 'football' ? `/futbol/mac/${id}` : null;

  const content = (
    <div className={`match-card ${isLive ? 'match-card--live' : ''}`}>
      {showLeague && league && (
        <div className="match-card__league">{league}</div>
      )}
      <div className="match-card__body">
        <div className="match-card__team match-card__team--home">
          {home?.logo && <img src={home.logo} alt={home.name} className="match-card__logo" />}
          <span className="match-card__team-name">{home?.name || '—'}</span>
        </div>

        <div className="match-card__center">
          <div className={`match-card__status match-card__status--${statusInfo.cls}`}>
            {isLive && <span className="live-dot" style={{width:6,height:6}} />}
            {status === 'NS' ? <><Clock size={11} />{time}</> : statusInfo.label}
          </div>
          <div className="match-card__score">
            <span className="match-card__score-num">{score.home}</span>
            <span className="match-card__score-sep">:</span>
            <span className="match-card__score-num">{score.away}</span>
          </div>
        </div>

        <div className="match-card__team match-card__team--away">
          <span className="match-card__team-name">{away?.name || '—'}</span>
          {away?.logo && <img src={away.logo} alt={away.name} className="match-card__logo" />}
        </div>
      </div>

      {linkPath && (
        <div className="match-card__detail-btn">
          <ChevronRight size={14} />
        </div>
      )}
    </div>
  );

  if (linkPath) return <Link to={linkPath} className="match-card-link">{content}</Link>;
  return content;
}
