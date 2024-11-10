import { BehaviorSubject } from 'rxjs';
import { CryptoPrice } from '../types';

const currencyPrices$ = new BehaviorSubject<{ [key: string]: CryptoPrice }>({});

const currencyHistory$ = new BehaviorSubject<{ [key: string]: number[] }>({});

export const currencyPricesObservable$ = currencyPrices$.asObservable();
export const currencyHistoryObservable$ = currencyHistory$.asObservable();

export const updateCurrencyPrices = (prices: { [key: string]: CryptoPrice }) => {
    currencyPrices$.next(prices);

    const currentHistory = currencyHistory$.getValue();
    const updatedHistory = { ...currentHistory };

    Object.entries(prices).forEach(([crypto, newPrice]) => {
        const history = currentHistory[crypto] || [];
        updatedHistory[crypto] = [...history, newPrice.price].slice(-50); // Keep last 50 entries
    });

    currencyHistory$.next(updatedHistory);
};
