export const COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Cyan
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#82E0AA', // Green
    '#F1948A', // Pink
    '#85C1E9', // Blue
];

export const getSegmentColor = (index: number, customColor?: string) => {
    if (customColor) return customColor;
    return COLORS[index % COLORS.length];
};
