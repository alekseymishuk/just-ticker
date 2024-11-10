import React, { useState, useEffect } from 'react';
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
    const [prices, setPrices] = useState<Record<string, CryptoPrice>>({});
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
    const [frequency, setFrequency] = useState(500);
    const [paused, setPaused] = useState(false);

    useCryptoPrices({ currencies, frequency, paused });

    useEffect(() => {
        const subscription: Subscription = currencyPricesObservable$.subscribe(updatedPrices => {
            setPrices(updatedPrices);
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
            .subscribe(updatedPrices => setPrices(updatedPrices));

        return () => subscription.unsubscribe();
    }, [frequency, paused]);

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
                        <CryptoRow
                            key={currency}
                            data={prices[currency]}
                            onCurrencySelect={setSelectedCurrency}
                        />
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

type CryptoRowProps = {
    data: CryptoPrice | undefined;
    onCurrencySelect: (currency: string) => void;
};

const CryptoRow: React.FC<CryptoRowProps> = React.memo(({ data, onCurrencySelect }) => {
    if (!data) return null;

    const { name, price, change } = data;
    const changeColor = change > 0 ? 'green' : 'red';

    return (
        <tr onClick={() => onCurrencySelect(name)}>
            <td>{name}</td>
            <td>{price}</td>
            <td style={{ color: changeColor }}>{change}</td>
        </tr>
    );
});
