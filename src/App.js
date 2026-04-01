import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FootballPage from './pages/FootballPage';
import BasketballPage from './pages/BasketballPage';
import TennisPage from './pages/TennisPage';
import Formula1Page from './pages/Formula1Page';
import MMAPage from './pages/MMAPage';
import FixtureDetailPage from './pages/FixtureDetailPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/football" element={<FootballPage />} />
        <Route path="/futbol/mac/:id" element={<FixtureDetailPage />} />
        <Route path="/basketbol" element={<BasketballPage />} />
        <Route path="/tenis" element={<TennisPage />} />
        <Route path="/formula1" element={<Formula1Page />} />
        <Route path="/mma" element={<MMAPage />} />
      </Routes>
    </Layout>
  );
}
``
