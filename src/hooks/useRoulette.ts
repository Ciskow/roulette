import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_ROOT_ID } from '../types';
import type { RouletteState, RouletteOption } from '../types';
import { loadState, saveState } from '../utils/persistence';

export const useRoulette = () => {
    const [state, setState] = useState<RouletteState>(() => loadState());
    const [currentId, setCurrentId] = useState<string>(INITIAL_ROOT_ID);

    // Persist state changes
    useEffect(() => {
        saveState(state);
    }, [state]);

    const currentNode = state.options[currentId];

    // Resolve children objects for the UI
    const childrenOptions = useMemo(() => {
        if (!currentNode) return [];
        return currentNode.childrenIds
            .map(id => state.options[id])
            .filter((opt): opt is RouletteOption => !!opt);
    }, [currentNode, state.options]);

    // Compute breadcrumbs path
    const getPath = useCallback(() => {
        const path: RouletteOption[] = [];
        let curr: string | null = currentId;
        while (curr && state.options[curr]) {
            path.unshift(state.options[curr]);
            curr = state.options[curr].parentId;
        }
        return path;
    }, [state.options, currentId]);

    const addOption = useCallback((label: string, color?: string) => {
        const newId = uuidv4();
        const newOption: RouletteOption = {
            id: newId,
            label,
            color,
            childrenIds: [],
            parentId: currentId,
        };

        setState(prev => {
            const parent = prev.options[currentId];
            if (!parent) return prev;

            return {
                ...prev,
                options: {
                    ...prev.options,
                    [newId]: newOption,
                    [currentId]: {
                        ...parent,
                        childrenIds: [...parent.childrenIds, newId],
                    },
                },
            };
        });
    }, [currentId]);

    const removeOption = useCallback((optionId: string) => {
        setState(prev => {
            const option = prev.options[optionId];
            if (!option) return prev; // Option doesn't exist

            const parentId = option.parentId;
            if (!parentId || !prev.options[parentId]) return prev; // Should not delete root or orphaned nodes without parent

            const parent = prev.options[parentId];

            const newOptions = { ...prev.options };
            delete newOptions[optionId];

            return {
                ...prev,
                options: {
                    ...newOptions,
                    [parentId]: {
                        ...parent,
                        childrenIds: parent.childrenIds.filter(id => id !== optionId),
                    },
                },
            };
        });
    }, []);

    const navigateTo = useCallback((id: string) => {
        if (state.options[id]) {
            setCurrentId(id);
        }
    }, [state.options]);

    const navigateUp = useCallback(() => {
        if (currentNode && currentNode.parentId) {
            setCurrentId(currentNode.parentId);
        }
    }, [currentNode]);

    const updateOption = useCallback((id: string, newLabel: string) => {
        setState(prev => {
            if (!prev.options[id]) return prev;
            return {
                ...prev,
                options: {
                    ...prev.options,
                    [id]: {
                        ...prev.options[id],
                        label: newLabel,
                    },
                },
            };
        });
    }, []);

    return {
        currentNode,
        childrenOptions,
        path: getPath(),
        addOption,
        removeOption,
        updateOption,
        navigateTo,
        navigateUp,
    };
};
