import {
    DEFAULT_SLOT_DIGIT_HEIGHT,
    SLOT_ANIMATION_DURATION_MS,
    SLOT_DELAY_PER_DIGIT_MS
} from "@/components/shared/v2/jackpot/index.tsx";

import {useAnimation} from "@/hooks/useAnimation.ts";


interface SlotMachineDigitProps {
    startChar: string;
    endChar: string;
    index: number;
    totalDigits: number;
    trigger: boolean;
}


export default function SlotMachineDigit({
                                             startChar,
                                             endChar,
                                             index,
                                             totalDigits,
                                             trigger,
                                         }: SlotMachineDigitProps) {
    const duration = SLOT_ANIMATION_DURATION_MS + (totalDigits - index) * SLOT_DELAY_PER_DIGIT_MS;
    const delay = (totalDigits - 1 - index) * SLOT_DELAY_PER_DIGIT_MS;

    const {transitionStyle, sequence} = useAnimation(
        trigger,
        startChar,
        endChar,
        duration,
        DEFAULT_SLOT_DIGIT_HEIGHT,
        delay
    );

    if (!/^\d/.test(endChar)) {
        return (
            <div className="flex items-center justify-center font-bold"
                 style={{height: `${DEFAULT_SLOT_DIGIT_HEIGHT}px`, minWidth: '32px'}}>
                {endChar}
            </div>
        );
    }

    return (
        <div
            className="relative overflow-hidden rounded-lg text-center"
            style={{
                height: `${DEFAULT_SLOT_DIGIT_HEIGHT}px`,
                minWidth: '32px',
            }}
        >
            <div
                className="flex flex-col justify-start"
                style={transitionStyle}
            >
                {sequence.map((d, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-center text-5xl sm:text-6xl md:text-7xl font-bold leading-none"
                        style={{height: `${DEFAULT_SLOT_DIGIT_HEIGHT}px`}}
                    >
                        {d}
                    </div>
                ))}
            </div>
        </div>
    );
}

