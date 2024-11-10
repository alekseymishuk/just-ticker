import React, { useState, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './CurrencyChartModal.css';
import { currencyHistoryObservable$ } from '../stores/currencyStore';
import { Subscription } from 'rxjs';
import { prepareChartData } from '../utils/prepareChartData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface CurrencyChartModalProps {
    currency: string;
    onClose: () => void;
}

const CurrencyChartModal: React.FC<CurrencyChartModalProps> = ({ currency, onClose }) => {
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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content currency-chart" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    X
                </button>
                <h2>{currency} Price History</h2>
                {data && (
                    <Line
                        data={data}
                        options={{ responsive: true, plugins: { legend: { display: false } } }}
                    />
                )}
                {!data && <div>Loading...</div>}
            </div>
        </div>
    );
};

export default CurrencyChartModal;
