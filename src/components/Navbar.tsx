import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Switch, useMantineColorScheme } from '@mantine/core';

const Navbar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('Home');
    const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });

    useEffect(() => {
        const currentPath = window.location.pathname;
        setActiveTab(currentPath === '/' ? 'Home' : currentPath.slice(1));
    }, []);

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setColorScheme('dark');
        } else {
            setColorScheme('light');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">CryptoCorp</div>
            <ul className="navbar-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/currencies">Currencies</Link>
                </li>
                <li>
                    <Link to="/charts">Charts</Link>
                </li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>
            <Switch defaultChecked label="Dark mode" color="blue" onChange={handleThemeChange} />
        </nav>
    );
};

export default Navbar;
