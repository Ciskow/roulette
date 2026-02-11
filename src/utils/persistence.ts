import { DEFAULT_STATE } from '../types';
import type { RouletteState } from '../types';

const STORAGE_KEY = 'infinite-roulette-data';

export const loadState = (): RouletteState => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState === null) {
            return DEFAULT_STATE;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Failed to load state from localStorage:', err);
        return DEFAULT_STATE;
    }
};

export const saveState = (state: RouletteState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (err) {
        console.error('Failed to save state to localStorage:', err);
    }
};
