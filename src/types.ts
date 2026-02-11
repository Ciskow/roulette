export interface RouletteOption {
    id: string;
    label: string;
    color?: string; // Hex code or CSS color
    childrenIds: string[]; // IDs of child options (options this one leads to)
    parentId: string | null;
}

export interface RouletteState {
    options: Record<string, RouletteOption>; // Normalized state
    rootId: string;
}

// Initial state helpful for reset
export const INITIAL_ROOT_ID = 'root';

export const DEFAULT_STATE: RouletteState = {
    options: {
        [INITIAL_ROOT_ID]: {
            id: INITIAL_ROOT_ID,
            label: 'Start',
            childrenIds: [],
            parentId: null,
        },
    },
    rootId: INITIAL_ROOT_ID,
};
