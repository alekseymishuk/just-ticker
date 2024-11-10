export const prepareChartData = (currency: string, data: number[], points: number) => {
    return {
        labels: Array.from({ length: points }, (_, i) => `Point ${i + 1}`),
        datasets: [
            {
                label: `${currency} Price`,
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
            },
        ],
    };
};
