// src/components/CurrencyChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { useObservable } from 'rxjs-hooks';
import { fetchPriceHistory } from '../services/api';
import './CurrencyChart.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface CurrencyChartProps {
  currency: string;
}

const CurrencyChart: React.FC<CurrencyChartProps> = ({ currency }) => {
  const data = useObservable(() => fetchPriceHistory(currency), { labels: [], datasets: [] });

  return (
    <div className="currency-chart">
      <h2>{currency} Price History</h2>
      <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
  );
};

export default CurrencyChart;
