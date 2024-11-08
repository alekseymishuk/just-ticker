// src/stores/currencyStore.ts

import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

interface CurrencyPrice {
  [key: string]: {
    price: number;
    timestamp: number;
  };
}

const INITIAL_CURRENCIES = ['BTC', 'ETH', 'ADA', 'SOL'];

// BehaviorSubject to hold the latest prices
const currencyPrices$ = new BehaviorSubject<CurrencyPrice>({});

// Subscription to hold the current interval process
let intervalSubscription: Subscription | null = null;

// Initial frequency in milliseconds
let updateFrequency = 1000; // 1 second by default

// Mock function to simulate fetching new price data for a currency
const fetchPrice = async (crypto: string) => ({
  crypto,
  price: parseFloat((Math.random() * 50000).toFixed(2)),
  timestamp: Date.now(),
});

// Function to initialize and start price updates
const startPriceUpdates = (frequency: number) => {
  if (intervalSubscription) intervalSubscription.unsubscribe();

  intervalSubscription = interval(frequency)
    .pipe(
      switchMap(async () => {
        const prices = await Promise.all(
          INITIAL_CURRENCIES.map(async (crypto) => {
            const data = await fetchPrice(crypto);
            return { [crypto]: data };
          })
        );

        // Merge prices into a single object
        const pricesData = prices.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        return pricesData;
      }),
      tap((pricesData: CurrencyPrice) => currencyPrices$.next(pricesData))
    )
    .subscribe();
};

// Start with the default frequency
startPriceUpdates(updateFrequency);

// Function to change the update frequency
export const setUpdateFrequency = (frequency: number) => {
  updateFrequency = frequency;
  startPriceUpdates(updateFrequency);
};

// Export the observable for components to subscribe to
export const currencyStore$ = currencyPrices$.asObservable();
