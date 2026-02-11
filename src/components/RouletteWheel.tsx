import React, { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { RouletteOption } from '../types';
import { getSegmentColor } from '../utils/colors';
import './RouletteWheel.css';

interface RouletteWheelProps {
    options: RouletteOption[];
    onSpinEnd: (selectedId: string) => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({ options, onSpinEnd }) => {
    const controls = useAnimation();
    const [isSpinning, setIsSpinning] = useState(false);
    const rotationRef = useRef(0);

    // If no options, render a placeholder
    if (options.length === 0) {
        return (
            <div className="wheel-placeholder">
                <p>Add options to start spinning!</p>
            </div>
        );
    }

    const segmentAngle = 360 / options.length;
    const radius = 150;
    const center = 160; // radius + padding

    // SVG Path for a segment
    const getSectorPath = (index: number) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;

        // Convert degrees to radians (startAngle 0 corresponds to -90deg/12 o'clock)
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);

        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        // SVG Path commands
        const largeArcFlag = segmentAngle > 180 ? 1 : 0;

        return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };

    const spin = async () => {
        if (isSpinning || options.length === 0) return;
        setIsSpinning(true);

        // Random rotation between 5 and 10 full spins + random offset
        const randomSpins = 5 + Math.random() * 5;
        const randomOffset = Math.random() * 360;
        const totalRotation = rotationRef.current + (randomSpins * 360) + randomOffset;

        await controls.start({
            rotate: totalRotation,
            transition: {
                duration: 4,
                ease: [0.2, 0.8, 0.2, 1],
                type: "tween"
            }
        });

        rotationRef.current = totalRotation;

        // Calculate winner
        const normalizedRotation = totalRotation % 360;
        const winningAngle = (360 - normalizedRotation) % 360;

        const winningIndex = Math.floor(winningAngle / segmentAngle);
        const clampedIndex = Math.min(winningIndex, options.length - 1);

        const winner = options[clampedIndex];
        if (winner) {
            onSpinEnd(winner.id);
        }

        setIsSpinning(false);
    };

    return (
        <div className="roulette-container">
            <div className="wheel-wrapper">
                <div className="pointer-container">
                    <div className="pointer-triangle" />
                </div>
                <motion.div
                    className="wheel-svg-container"
                    animate={controls}
                    initial={{ rotate: 0 }}
                    style={{ width: 320, height: 320 }}
                >
                    <svg width="320" height="320" viewBox="0 0 320 320">
                        {options.map((option, index) => {
                            // Calculate text rotation
                            // Midpoint of the sector in degrees (0 = 12 o'clock relative to sector start)
                            const midAngle = (index + 0.5) * segmentAngle;

                            // Convert to SVG rotation (SVG 0 is 3 o'clock, so we subtract 90 to match sector's -90 offset)
                            const rotationAngle = midAngle - 90;

                            // Calculate flip for readability
                            // We flip if the text is in the left half of the circle
                            // Normalize to 0-360
                            const normalizedAngle = (rotationAngle + 360) % 360;
                            // Left side is roughly 90 (6 o'clock) to 270 (12 o'clock)
                            const shouldFlip = normalizedAngle > 90 && normalizedAngle < 270;

                            return (
                                <g key={option.id}>
                                    <path
                                        d={getSectorPath(index)}
                                        fill={getSegmentColor(index, option.color)}
                                        stroke="#1a1a1a"
                                        strokeWidth="2"
                                    />
                                    <g transform={`
                    translate(${center}, ${center})
                    rotate(${rotationAngle}) 
                    translate(${radius * 0.6}, 0)
                  `}>
                                        <text
                                            x="0"
                                            y="0"
                                            fill="white"
                                            textAnchor="middle"
                                            alignmentBaseline="middle"
                                            fontWeight="bold"
                                            fontSize="14"
                                            transform={`rotate(${shouldFlip ? 180 : 0})`}
                                            style={{
                                                pointerEvents: 'none',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                                            }}
                                        >
                                            {option.label.length > 15 ? option.label.substring(0, 12) + '...' : option.label}
                                        </text>
                                    </g>
                                </g>
                            );
                        })}
                        <circle cx={center} cy={center} r="15" fill="#1a1a1a" stroke="#fff" strokeWidth="2" />
                    </svg>
                </motion.div>
            </div>

            <button
                className="spin-button"
                onClick={spin}
                disabled={isSpinning || options.length < 1}
            >
                {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
            </button>
        </div>
    );
};
