import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import type { CryptoPrice } from '../types';
import { prepareChartData } from '../utils/prepareChartData';

const initialPrices: Record<string, number> = {
    BTC: 50000,
    ETH: 4000,
    ADA: 1.5,
    SOL: 200,
};

const getRandomPriceChange = (): number => (Math.random() - 0.5) * 2;

export const fetchCryptoPrice = async (crypto: string): Promise<CryptoPrice> => {
    await new Promise(resolve => setTimeout(resolve, 10));

    const priceChange = getRandomPriceChange();
    initialPrices[crypto] += priceChange;

    return {
        name: crypto,
        price: parseFloat(initialPrices[crypto].toFixed(2)),
        change: parseFloat(priceChange.toFixed(2)),
    };
};

function generatePriceData(points: number, basePrice: number = 5000): number[] {
    return Array.from({ length: points }, (_, i) => basePrice + Math.random() * 100 - 50 + i * 5);
}

export function fetchPriceHistory(currency: string, points: number = 30) {
    const priceData = generatePriceData(points);

    return of(priceData).pipe(
        delay(500),
        map(data => prepareChartData(currency, data, points))
    );
}
