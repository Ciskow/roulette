import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { RouletteOption } from '../types';
import './OptionInput.css';

interface OptionInputProps {
    options: RouletteOption[];
    onAdd: (label: string) => void;
    onRemove: (id: string) => void;
    onNavigate: (id: string) => void;
}

export const OptionInput: React.FC<OptionInputProps> = ({ options, onAdd, onRemove, onNavigate }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="option-input-container">
            <ul className="option-list">
                {options.map((option) => (
                    <li key={option.id} className="option-item">
                        <button
                            className="option-label-btn"
                            onClick={() => onNavigate(option.id)}
                            title="Click to edit this category"
                        >
                            <span className="option-label">{option.label}</span>
                        </button>
                        <button
                            className="remove-btn"
                            onClick={() => onRemove(option.id)}
                            aria-label={`Remove ${option.label}`}
                        >
                            <X size={16} />
                        </button>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit} className="add-option-form">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add option..."
                    className="option-input"
                />
                <button type="submit" className="add-btn" disabled={!inputValue.trim()}>
                    <Plus size={20} />
                </button>
            </form>
        </div>
    );
};
