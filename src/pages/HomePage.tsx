import React from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to CryptoCorp</h1>
        <p>Your trusted platform for cryptocurrency insights and updates.</p>
      </header>
      <section className="currencies-preview">
        <h2>Top Cryptocurrencies</h2>
        <div className="currency-cards">
          <div className="currency-card">Bitcoin (BTC)</div>
          <div className="currency-card">Ethereum (ETH)</div>
          <div className="currency-card">Cardano (ADA)</div>
          <div className="currency-card">Solana (SOL)</div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
