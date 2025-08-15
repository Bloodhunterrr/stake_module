import {useAnimation} from "@/hooks/useAnimation.ts";
import {DEFAULT_SLIDE_DIGIT_HEIGHT, SIMPLE_ANIMATION_DURATION_MS} from "@/components/shared/v2/jackpot/index.tsx";

interface SimpleSlideDigitProps {
    startChar: string;
    endChar: string;
    trigger: boolean;
}


/**
 * SimpleSlideDigit component for smaller, simple sliding numbers.
 * The size has been reduced for a more compact appearance.
 */
export default function SimpleSlideDigit({startChar, endChar, trigger}: SimpleSlideDigitProps) {
    const {transitionStyle, sequence} = useAnimation(
        trigger,
        startChar,
        endChar,
        SIMPLE_ANIMATION_DURATION_MS,
        DEFAULT_SLIDE_DIGIT_HEIGHT
    );

    if (startChar === endChar) {
        return (
            <div
                className="flex w-3 items-center justify-center text-sm font-semibold"
                style={{height: `${DEFAULT_SLIDE_DIGIT_HEIGHT}px`}}
            >
                {endChar}
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden text-center"
             style={{height: `${DEFAULT_SLIDE_DIGIT_HEIGHT}px`, width: '10px'}}>
            <div className="flex flex-col" style={transitionStyle}>
                {sequence.map((d, i) => (
                    <div key={i} className="flex w-3 items-center justify-center text-sm font-semibold"
                         style={{height: `${DEFAULT_SLIDE_DIGIT_HEIGHT}px`}}>
                        {d}
                    </div>
                ))}
            </div>
        </div>
    );
}