import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles/Table.css';
import '@mantine/core/styles.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CurrenciesPage from './pages/CurrenciesPage';
import ChartsPage from './pages/ChartsPage';
import ContactPage from './pages/ContactPage';

const App: React.FC = () => {
    return (
        <MantineProvider defaultColorScheme="dark">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/currencies" element={<CurrenciesPage />} />
                    <Route path="/charts" element={<ChartsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
                <Footer />
            </Router>
        </MantineProvider>
    );
};

export default App;
