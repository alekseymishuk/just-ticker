// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CurrenciesPage from './pages/CurrenciesPage';
import ChartsPage from './pages/ChartsPage';
import ContactPage from './pages/ContactPage';
import './styles/dark-theme.css';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/currencies" element={<CurrenciesPage />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
