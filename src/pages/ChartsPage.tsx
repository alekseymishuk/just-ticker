import React from 'react';
import CurrencyChart from '../components/CurrencyChart';
import './ChartsPage.css';

const ChartsPage: React.FC = () => {
    return (
        <div className="charts-page">
            <h1>Currency Charts</h1>
            <CurrencyChart currency="BTC" />
            <CurrencyChart currency="ETH" />
            <CurrencyChart currency="ADA" />
            <CurrencyChart currency="SOL" />
        </div>
    );
};

export default ChartsPage;
