import React, { useEffect, useState } from 'react';
import MatchCard from '../components/MatchCard';

const API = 'https://sportscanli-backend.onrender.com/api/football/live';

export default function FootballPage() {
  const [matches, setMatches] = useState([]);

  const fetchData = async () => {
    const r = await fetch(API);
    const d = await r.json();
    setMatches(d.response || []);
  };

  useEffect(() => {
    fetchData(); // ✅ sayfa açılınca 1 kere
  }, []);

  return (
    <div>
      <h2>⚽ Canlı Futbol</h2>
      <button onClick={fetchData}>Yenile</button>

      {matches.length === 0
        ? <p>Canlı maç yok</p>
        : matches.map(m => (
            <MatchCard
              key={m.fixture.id}
              fixture={m}
              sport="football"
              showLeague
            />
          ))
      }
    </div>
  );
}
