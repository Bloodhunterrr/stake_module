import {useEffect, useState} from "react";

const DEFAULT_SLOT_DIGIT_HEIGHT = 72;

/**
 * A custom hook to handle the animation state.
 * Reduces code duplication and centralizes animation logic.
 */
export const useAnimation = (trigger: boolean, startChar: string, endChar: string, duration: number, height: number, delay = 0) => {
    const [transitionStyle, setTransitionStyle] = useState<React.CSSProperties>({});
    const [sequence, setSequence] = useState<string[]>([endChar]);

    useEffect(() => {
        if (startChar === endChar || !trigger) {
            setTransitionStyle({transform: 'translateY(0px)'});
            setSequence([endChar]);
            return;
        }

        if (!/^\d$/.test(endChar)) {
            // Handle non-digit characters without animation.
            setTransitionStyle({transform: 'translateY(0px)'});
            setSequence([endChar]);
            return;
        }

        let totalDistance = 0;
        let generatedSequence: string[] = [endChar];
        let transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

        if (height === DEFAULT_SLOT_DIGIT_HEIGHT) {
            // Slot machine animation logic.
            const startDigit = parseInt(startChar, 10);
            const endDigit = parseInt(endChar, 10);
            const cycles = 2;
            const digits = Array.from({length: 10}, (_, i) => i.toString());
            generatedSequence = [
                ...Array(cycles).fill(digits).flat(),
                ...Array.from({length: (endDigit - startDigit + 10) % 10 + 1}, (_, i) => ((startDigit + i) % 10).toString()),
            ];
            totalDistance = (generatedSequence.length - 1) * height;
            transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        } else {
            // Simple slide animation logic.
            generatedSequence = [startChar, endChar];
            totalDistance = height;
            transition = `transform ${duration}ms ease-in-out`;
        }

        setSequence(generatedSequence);

        const timeoutId = setTimeout(() => {
            setTransitionStyle({
                transition,
                transform: `translateY(-${totalDistance}px)`,
            });
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [trigger, startChar, endChar, duration, height, delay]);

    return {transitionStyle, sequence};
};

