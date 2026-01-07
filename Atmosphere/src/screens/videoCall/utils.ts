import { height } from './styles';

/**
 * Get number of columns for participant grid based on count
 */
export const getGridColumns = (participantCount: number): number => {
    if (participantCount === 1) return 1;
    if (participantCount === 2) return 2;
    if (participantCount <= 4) return 2;
    return 3;
};

/**
 * Get video height based on participant count
 */
export const getVideoHeight = (participantCount: number): number => {
    if (participantCount === 1) return height * 0.8;
    if (participantCount === 2) return height * 0.5;
    if (participantCount <= 4) return height * 0.4;
    return 200;
};
