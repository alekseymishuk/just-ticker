import React from 'react';
import CurrencyChart from '../components/CurrencyChart';
import './ChartsPage.css';
import { useCryptoPrices } from '../hooks/useCurrencyPrices';
import { currencies } from '../constants';

const ChartsPage: React.FC = () => {
    useCryptoPrices({ currencies, frequency: 1000, paused: false });
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
