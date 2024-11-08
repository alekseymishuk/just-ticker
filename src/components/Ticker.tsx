// src/components/Ticker.tsx
import React, { useState, useEffect } from 'react';
import { fetchPrice, Price } from '../services';
import './Ticker.css';
import { currencies } from '../constants';
import ChartModal from './charts/ChartModal';


const Ticker: React.FC = () => {
    const [prices, setPrices] = useState<Record<string, Price | undefined>>({});
    const [frequency, setFrequency] = useState<number>(50); // Update frequency in ms
    const [paused, setPaused] = useState<boolean>(false);
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
    const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>(
        currencies.reduce((acc, currency) => {
            acc[currency] = [];
            return acc;
          }, {} as Record<string, number[]>)
    );
  
    useEffect(() => {
      const intervals =  currencies.map((crypto) =>
        setInterval(async () => {
          if (!paused) {
            const data = await fetchPrice(crypto);
            setPrices((prevPrices) => ({
              ...prevPrices,
              [crypto]: data,
            }));
            setPriceHistory((prevHistory) => ({
              ...prevHistory,
              [crypto]: [...prevHistory[crypto], data.price].slice(-50), // Keep only the latest 50 entries
            }));
          }
        }, frequency)
      );
  
      return () => intervals.forEach((id) => clearInterval(id));
    }, [frequency, paused]);
  
    const togglePause = () => setPaused(!paused);
  
    const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFrequency(Number(event.target.value));
    };
  
    return (
      <div className="crypto-ticker">
        <h1>Ticker</h1>
        <div className="controls">
          <label>
            Update Frequency: {frequency}ms
            <input
              type="range"
              min="10"
              max="1000"
              value={frequency}
              onChange={handleFrequencyChange}
            />
          </label>
          <button onClick={togglePause}>{paused ? 'Resume' : 'Pause'}</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Current Price</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((item) => (
              <Row
                key={item}
                data={prices[item]}
                onClick={() => setSelectedCurrency(item)}
              />
            ))}
          </tbody>
        </table>
  
        {selectedCurrency && (
          <ChartModal
            currency={selectedCurrency}
            history={priceHistory[selectedCurrency]}
            onClose={() => setSelectedCurrency(null)}
          />
        )}
      </div>
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
  
  export default Ticker;