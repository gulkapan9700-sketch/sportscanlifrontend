import React, { useEffect, useState } from 'react';

const LIVE_API =
  'https://sportscanli-backend.onrender.com/api/tennis/live';
const TODAY_API =
  'https://sportscanli-backend.onrender.com/api/tennis/today';

// ---------- Yardımcı Fonksiyonlar ----------

// Maçları saate göre sırala
function sortByMatchTime(matches) {
  return [...matches].sort((a, b) => {
    const tA = a.date ? new Date(a.date).getTime() : Infinity;
    const tB = b.date ? new Date(b.date).getTime() : Infinity;
    return tA - tB;
  });
}

// Maç 1 saat içinde mi?
function isSoon(match) {
  if (!match.date) return false;
  const diff = new Date(match.date).getTime() - Date.now();
  return diff > 0 && diff <= 60 * 60 * 1000;
}

export default function TennisPage() {
  const [matches, setMatches] = useState([]);
  const [mode, setMode] = useState('loading'); 
  // loading | live | today

  const fetchData = async () => {
    try {
      // 1️⃣ Önce LIVE dene
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

  // Akşam canlı hatırlatması
  const nowHour = new Date().getHours();
  const showEveningHint = mode === 'today' && matches.length > 0 && nowHour < 18;

  return (
    <div className="tennis-page">
      <h2>🎾 Tenis</h2>

      <button onClick={fetchData}>Yenile</button>

      {/* Durum mesajları */}
      {mode === 'live' && (
        <p style={{ color: '#ff4d4f', fontWeight: 500 }}>
          🔴 Şu anda oynanan canlı tenis maçları
        </p>
      )}

      {mode === 'today' && (
        <p style={{ color: '#999' }}>
          ℹ️ Şu anda canlı tenis maçı yok, bugünkü maçlar gösteriliyor
        </p>
      )}

      {showEveningHint && (
        <p style={{ color: '#00c896' }}>
          ⏳ Akşam saatlerinde canlı tenis maçları başlayacaktır
        </p>
      )}

      {/* Maç listesi */}
      {matches.length === 0 ? (
        <p>Bugün tenis maçı bulunamadı.</p>
      ) : (
        matches.map(m => (
          <div
            key={m.id}
            style={{
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
              background: '#0f172a',
              position: 'relative'
            }}
          >
            {/* Yaklaşan etiketi */}
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

            <div style={{ fontSize: 14 }}>
              <strong>{m.players?.home?.name}</strong>
              {' vs '}
              <strong>{m.players?.away?.name}</strong>
            </div>

            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {m.tournament?.name}
            </div>

            <div style={{ fontSize: 12, marginTop: 4 }}>
              ⏱ {m.date ? new Date(m.date).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
              }) : '--:--'}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
``
