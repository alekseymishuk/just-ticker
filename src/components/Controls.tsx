import React from 'react';
import { Slider, Button, Box, Text } from '@mantine/core';
import './Controls.css';

type ControlsProps = {
    paused: boolean;
    togglePause: () => void;
    frequency: number;
    onFrequencyChange: (frequency: number) => void;
};

export const Controls: React.FC<ControlsProps> = ({
    paused,
    togglePause,
    frequency,
    onFrequencyChange,
}) => {
    return (
        <div className="controls">
            <div className="slider">
                <Text size="sm">Frequency: {frequency}ms</Text>
                <Box style={{ width: 300 }}>
                    <Slider
                        defaultValue={frequency}
                        label={value => `${value}ms`}
                        aria-labelledby="discrete-slider"
                        step={100}
                        min={0}
                        max={2000}
                        onChange={value => onFrequencyChange(value as number)}
                        value={frequency}
                    />
                </Box>
            </div>
            <Button className="button" onClick={togglePause}>
                {paused ? 'Resume' : 'Pause'}
            </Button>
        </div>
    );
};
