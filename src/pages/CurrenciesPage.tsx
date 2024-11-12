import React from 'react';
import CurrencyTable from '../components/CurrencyTable';
import { Box } from '@mantine/core';
import './CurrenciesPage.css';

const CurrenciesPage: React.FC = () => {
    return (
        <Box
            style={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem',
            }}
        >
            <h1>Live Cryptocurrency Prices</h1>
            <CurrencyTable />
        </Box>
    );
};

export default CurrenciesPage;
