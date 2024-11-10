import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { currencyHistoryObservable$ } from '../stores/currencyStore';
import './CurrencyChart.css';
import { Subscription } from 'rxjs';
import { prepareChartData } from '../utils/prepareChartData';

interface CurrencyChartProps {
    currency: string;
}

const CurrencyChart: React.FC<CurrencyChartProps> = ({ currency }) => {
    const [priceHistory, setPriceHistory] = useState<number[]>([]);

    useEffect(() => {
        const subscription: Subscription = currencyHistoryObservable$.subscribe(historyData => {
            setPriceHistory(historyData[currency] || []);
        });

        return () => subscription.unsubscribe();
    }, [currency]);

    const data = useMemo(
        () => prepareChartData(currency, priceHistory, 50),
        [currency, priceHistory]
    );

    if (!priceHistory) {
        return <div>Loading...</div>;
    }

    return (
        <div className="currency-chart">
            <h2>{currency} Price History</h2>
            <Line data={data} options={chartOptions} />
        </div>
    );
};

export default CurrencyChart;

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
            labels: {
                color: '#e0e0e0',
            },
        },
    },
    scales: {
        x: {
            ticks: { color: '#e0e0e0' },
        },
        y: {
            ticks: { color: '#e0e0e0' },
        },
    },
};
