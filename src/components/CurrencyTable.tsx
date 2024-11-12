import React, { useState, useEffect, useRef } from 'react';
import type { CryptoPrice } from '../types';
import CurrencyChartModal from './CurrencyChartModal';
import { Controls } from './Controls';
import { useCryptoPrices } from '../hooks/useCurrencyPrices';
import { currencies } from '../constants';
import { Table, Text, Box, useMantineTheme } from '@mantine/core';
import { currencyPricesObservable$ } from '../stores/currencyStore';
import styles from '../styles/Table.module.css';

const CurrencyTable: React.FC = () => {
    const theme = useMantineTheme();
    const prices = useRef<Record<string, CryptoPrice>>({});
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
    const [frequency, setFrequency] = useState(500);
    const [paused, setPaused] = useState(false);
    const priceRefs = useRef<Record<string, HTMLTableCellElement>>({});
    const changeRefs = useRef<Record<string, HTMLTableCellElement>>({});

    useCryptoPrices({ currencies, frequency, paused });

    useEffect(() => {
        const subscription = currencyPricesObservable$.subscribe(handleUpdatePrices);
        return () => subscription.unsubscribe();
    }, []);

    const handleUpdatePrices = (newPrices: Record<string, CryptoPrice>) => {
        Object.entries(newPrices).forEach(([currency, { price, change }]) => {
            if (priceRefs.current[currency] && changeRefs.current[currency]) {
                if (priceRefs.current[currency]) {
                    priceRefs.current[currency]!.textContent = `$${price.toFixed(2)}`;
                }
                if (changeRefs.current[currency]) {
                    changeRefs.current[currency]!.textContent = `${
                        change > 0 ? '+' : ''
                    }${change.toFixed(2)}`;
                    changeRefs.current[currency]!.style.color =
                        change > 0 ? theme.colors.green[5] : theme.colors.red[5];
                    changeRefs.current[currency]!.style.transition = 'color 0.5s ease';
                }
            }
        });

        prices.current = newPrices;
    };

    const togglePause = () => setPaused(prev => !prev);

    return (
        <Box
            style={{
                padding: '2rem',
            }}
        >
            <Controls
                paused={paused}
                togglePause={togglePause}
                frequency={frequency}
                onFrequencyChange={setFrequency}
            />

            <Box className={styles.tableContainer}>
                <Table highlightOnHover verticalSpacing="sm" miw={800}>
                    <Table.Thead className={styles.tableHeader}>
                        <Table.Tr>
                            <Table.Th>
                                <Text fw={700}>Currency</Text>
                            </Table.Th>
                            <Table.Th>
                                <Text fw={700}>Price</Text>
                            </Table.Th>
                            <Table.Th>
                                <Text fw={700}>Change</Text>
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {currencies.map(currency => (
                            <Table.Tr
                                onClick={() => setSelectedCurrency(currency)}
                                className={styles.tableRow}
                            >
                                <Table.Td key="name" className={styles.tableCell}>
                                    <Text fw={500}>{currency}</Text>
                                </Table.Td>
                                <Table.Td key="price" className={styles.tableCell}>
                                    <Text
                                        fw={500}
                                        ref={el =>
                                            (priceRefs.current[currency] =
                                                el as HTMLTableCellElement)
                                        }
                                    >
                                        Loading...
                                    </Text>
                                </Table.Td>
                                <Table.Td key="change" className={styles.tableCell}>
                                    <Text
                                        fw={500}
                                        ref={el =>
                                            (changeRefs.current[currency] =
                                                el as HTMLTableCellElement)
                                        }
                                    >
                                        Loading...
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Box>
            {selectedCurrency && (
                <CurrencyChartModal
                    currency={selectedCurrency}
                    onClose={() => setSelectedCurrency(null)}
                />
            )}
        </Box>
    );
};

export default CurrencyTable;
