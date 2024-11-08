import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './ChartModal.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartModalProps {
  currency: string;
  history: number[];
  onClose: () => void;
}

const ChartModal: React.FC<ChartModalProps> = ({ currency, history, onClose }) => {
  const data = {
    labels: Array.from({ length: history.length }, (_, i) => i + 1),
    datasets: [
      {
        label: `${currency} Price`,
        data: history,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{currency} Price History</h2>
        <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
};

export default ChartModal;
