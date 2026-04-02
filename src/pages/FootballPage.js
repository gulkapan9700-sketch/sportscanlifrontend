import React, { useEffect, useState } from 'react';
import MatchCard from '../components/MatchCard';

const LIVE_API =
  'https://sportscanli-backend.onrender.com/api/football/live';
const TODAY_API =
  'https://sportscanli-backend.onrender.com/api/football/today';

// ----- Yardımcı Fonksiyonlar -----

// Bugünkü maçları SAATE göre sırala
function sortByMatchTime(matches) {
  return [...matches].sort((a, b) => {
    const tA = a.fixture?.date ? new Date(a.fixture.date).getTime() : Infinity;
    const tB = b.fixture?.date ? new Date(b.fixture.date).getTime() : Infinity;
    return tA - tB;
  });
}

// Maç 1 saat içinde mi?
function isSoon(match) {
  if (!match.fixture?.date) return false;
  const diff = new Date(match.fixture.date).getTime() - Date.now();
  return diff > 0 && diff <= 60 * 60 * 1000;
}

export default function FootballPage() {
  const [matches, setMatches] = useState([]);
  const [mode, setMode] = useState('loading'); 
  // loading | live | today

  const fetchData = async () => {
    try {
      // 1️⃣ LIVE dene
      const liveRes = await fetch(LIVE_API);
      const liveData = await liveRes.json();

      if (liveData.response && liveData.response.length > 0) {
        setMatches(liveData.response);
        setMode('live');
        return;
      }

      // 2️⃣ LIVE yoksa TODAY
      const todayRes = await fetch(TODAY_API);
      const todayData = await todayRes.json();

      const sortedToday = sortByMatchTime(todayData.response || []);
      setMatches(sortedToday);
      setMode('today');

    } catch (e) {
      console.error(e);
      setMode('today');
    }
  };

  // Sayfa açılınca 1 kere
  useEffect(() => {
    fetchData();
  }, []);

  // Akşama doğru kullanıcıyı bilgilendir
  const nowHour = new Date().getHours();
  const showEveningHint = mode === 'today' && matches.length > 0 && nowHour < 18;

  return (
    <div className="football-page">
      <h2>⚽ Futbol</h2>

      <button onClick={fetchData}>Yenile</button>

      {/* DURUM MESAJLARI */}
      {mode === 'live' && (
        <p style={{ color: '#ff4d4f', fontWeight: 500 }}>
          🔴 Şu anda oynanan canlı maçlar
        </p>
      )}

      {mode === 'today' && (
        <p style={{ color: '#999' }}>
          ℹ️ Şu anda canlı maç yok, bugünün maçları gösteriliyor
        </p>
      )}

      {showEveningHint && (
        <p style={{ color: '#00c896' }}>
          ⏳ Akşam saatlerinde canlı maçlar başlayacaktır
        </p>
      )}

      {/* MAÇ LİSTESİ */}
      {matches.length === 0 ? (
        <p>Bugün maç bulunamadı.</p>
      ) : (
        matches.map(m => (
          <div key={m.fixture.id} style={{ position: 'relative' }}>
            {/* ⏰ Yaklaşan Maç Etiketi */}
            {mode === 'today' && isSoon(m) && (
              <span
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  fontSize: 11,
                  color: '#ffa940'
                }}
              >
                ⏰ Yaklaşıyor
              </span>
            )}

            <MatchCard
              fixture={m}
              sport="football"
              showLeague
            />
          </div>
        ))
      )}
    </div>
  );
}
