import { useEffect } from 'react';
import { interval, switchMap, map } from 'rxjs';
import { updateCurrencyPrices } from '../stores/currencyStore';
import { fetchCryptoPrice } from '../services/api';
import { CryptoPrice } from '../types';

interface UseCryptoPricesProps {
    currencies: readonly string[];
    frequency: number;
    paused: boolean;
}

export const useCryptoPrices = ({ currencies, frequency, paused }: UseCryptoPricesProps) => {
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
            .subscribe(updatedPrices => updateCurrencyPrices(updatedPrices));

        return () => subscription.unsubscribe();
    }, [currencies, frequency, paused]);
};
