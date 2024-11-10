import React from 'react';
import { Slider, Button } from '@mui/material';
import Box from '@mui/material/Box';
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
                <label>Frequency: {frequency}ms</label>
                <Box sx={{ width: 300 }}>
                    <Slider
                        defaultValue={frequency}
                        getAriaValueText={value => `${value}ms`}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={100}
                        min={0}
                        max={2000}
                        onChange={(_, value) => onFrequencyChange(value as number)}
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
