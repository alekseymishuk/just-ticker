import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

// Define the data structure for a crypto price update
export interface Price {
    name: string;
    price: number;
    change: string;
  }
  
  // Initial prices for cryptocurrencies
  const initialPrices: Record<string, number> = {
    BTC: 50000,
    ETH: 4000,
    ADA: 1.5,
    SOL: 200,
  };
  
  // Helper function to simulate an API response with random price changes
  const getRandomPriceChange = (): number => (Math.random() - 0.5) * 2; // Random change between -1 and 1
  
  // Simulate API response for getting crypto prices
  export const fetchPrice = async (item: string): Promise<Price> => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 10));
  
    // Generate a new price based on initial price and random change
    const priceChange = getRandomPriceChange();
    initialPrices[item] += priceChange;
  
    return {
      name: item,
      price: parseFloat(initialPrices[item].toFixed(2)),
      change: priceChange.toFixed(2),
    };
  };
  


// Helper to generate random price values with a slight trend
function generatePriceData(points: number, basePrice: number = 5000): number[] {
  return Array.from({ length: points }, (_, i) => 
    basePrice + Math.random() * 100 - 50 + i * 5
  );
}

// Fetch price history as an observable
export function fetchPriceHistory(currency: string) {
  // Generate a mock price history
  const points = 30; // Number of data points
  const priceData = generatePriceData(points);
  
  // Prepare data for Chart.js line chart
  const chartData = {
    labels: Array.from({ length: points }, (_, i) => `Point ${i + 1}`),
    datasets: [
      {
        label: `${currency} Price`,
        data: priceData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  // Return as observable to simulate async data fetching
  return of(chartData).pipe(
    delay(500), // Simulate network delay
    map(data => data) // Return data as-is
  );
}