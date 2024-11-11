import React, { useState, useEffect, useRef } from 'react';
import { fetchCryptoPrice } from '../services/api';
import { interval, switchMap, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CryptoPrice } from '../types';
import './CurrencyTable.css';
import CurrencyChartModal from './CurrencyChartModal';
import { Controls } from './Controls';
import { useCryptoPrices } from '../hooks/useCurrencyPrices';
import { currencyPricesObservable$ } from '../stores/currencyStore';

const currencies = ['BTC', 'ETH', 'ADA', 'SOL'] as const;

const CurrencyTable: React.FC = () => {
    const prices = useRef<Record<string, CryptoPrice>>({});
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
    const [frequency, setFrequency] = useState(500);
    const [paused, setPaused] = useState(false);
    const rowRefs = React.useRef<Record<string, HTMLTableRowElement | null>>({});

    useCryptoPrices({ currencies, frequency, paused });

    useEffect(() => {
        const subscription: Subscription = currencyPricesObservable$.subscribe(updatedPrices => {
            prices.current = updatedPrices;
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const subscription = interval(frequency)
            .pipe(
                switchMap(() => {
                    if (paused) return [];
                    return Promise.all(
                        currencies.map(async crypto => [crypto, await fetchCryptoPrice(crypto)])
                    );
                }),
                map(priceUpdates => Object.fromEntries(priceUpdates as [string, CryptoPrice][]))
            )
            .subscribe(updatedPrices => handleUpdatePrices(updatedPrices));

        return () => subscription.unsubscribe();
    }, [frequency, paused]);

    const handleUpdatePrices = (newPrices: Record<string, CryptoPrice>) => {
        Object.entries(newPrices).forEach(([currency, { price, change }]) => {
            const row = rowRefs.current[currency];
            if (row) {
                const [_, priceCell, changeCell] = Array.from(row.children);
                priceCell.textContent = `${price.toFixed(2)}`;
                const diff = change - (prices.current[currency]?.change || 0);
                changeCell.textContent = `${diff.toFixed(2)}`;
                (changeCell as HTMLElement).style.color = diff > 0 ? 'green' : 'red';
            }
        });

        prices.current = newPrices;
    };

    const togglePause = () => setPaused(prev => !prev);

    return (
        <>
            <Controls
                paused={paused}
                togglePause={togglePause}
                frequency={frequency}
                onFrequencyChange={setFrequency}
            />
            <table className="currency-table">
                <thead>
                    <tr>
                        <th>Currency</th>
                        <th>Price</th>
                        <th>Change</th>
                    </tr>
                </thead>
                <tbody>
                    {currencies.map(currency => (
                        <tr
                            ref={element => (rowRefs.current[currency] = element)}
                            onClick={() => setSelectedCurrency(currency)}
                        >
                            <td key="name">{currency}</td>
                            <td key="price">0.00</td>
                            <td key="change">0.00</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedCurrency && (
                <CurrencyChartModal
                    currency={selectedCurrency}
                    onClose={() => setSelectedCurrency(null)}
                />
            )}
        </>
    );
};

export default CurrencyTable;
