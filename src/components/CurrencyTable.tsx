// src/components/CurrencyTable.tsx
import React, { useState, useEffect } from 'react';
import { fetchPrice } from '../services/api';
import { interval, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import './CurrencyTable.css';

const currencies = ['BTC', 'ETH', 'ADA', 'SOL'] as const;

export interface Price {
  name: string;
  price: number;
  change: string;
}

const CurrencyTable: React.FC = () => {
  const [prices, setPrices] = useState<Record<string, Price>>({});

  useEffect(() => {
    const subscription = interval(1000).pipe(
      switchMap(() => Promise.all(currencies.map(async (crypto) => [crypto, await fetchPrice(crypto)]))),
      map((priceUpdates) => Object.fromEntries(priceUpdates as [string, Price][]))
    ).subscribe((updatedPrices) => setPrices(updatedPrices));

    return () => subscription.unsubscribe();
  }, []);

  return (
    <table className="currency-table">
      <thead>
        <tr>
          <th>Currency</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {currencies.map((currency) => (
          <Row key={currency} data={prices[currency]} onClick={() => console.log(`Clicked on ${crypto}`)} />
        ))}
      </tbody>
    </table>
  );
};

interface RowProps {
  data: Price | undefined;
  onClick: () => void;
}

const Row: React.FC<RowProps> = React.memo(({ data, onClick }) => {
  if (!data) return null;

  const { name, price, change } = data;
  const changeColor = parseFloat(change) > 0 ? 'green' : 'red';

  return (
    <tr onClick={onClick} style={{ cursor: 'pointer' }}>
      <td>{name}</td>
      <td>{price}</td>
      <td style={{ color: changeColor }}>{change}</td>
    </tr>
  );
});

export default CurrencyTable;
