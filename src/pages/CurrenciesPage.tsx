import React from 'react';
import CurrencyTable from '../components/CurrencyTable';
import './CurrenciesPage.css';

const CurrenciesPage: React.FC = () => {
    return (
        <div className="currencies-page">
            <h1>Live Cryptocurrency Prices</h1>
            <CurrencyTable />
        </div>
    );
};

export default CurrenciesPage;
