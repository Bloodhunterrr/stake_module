import {cn} from "@/lib/utils.ts";
import {useEffect, useState} from 'react';
import SimpleSlideDigit from "@/components/shared/v2/jackpot/simple-slide-digit.tsx";
import SlotMachineDigit from "@/components/shared/v2/jackpot/slot-machine-digit.tsx";


interface AnimatedNumberProps {
    startValue: string;
    endValue: string;
    className?: string;
    mode?: 'slot' | 'simple';
}

export default function AnimatedNumber({
                                           startValue,
                                           endValue,
                                           className = '',
                                           mode = 'slot',
                                       }: AnimatedNumberProps) {
    const [trigger, setTrigger] = useState<boolean>(false);
    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        setTrigger(false);
        setKey((prev) => prev + 1);
        const timeout = setTimeout(() => setTrigger(true), 50);
        return () => clearTimeout(timeout);
    }, [endValue]);

    const paddedStartValue = startValue.padStart(endValue.length, '0');
    const startChars = paddedStartValue.split('');
    const endChars = endValue.split('');
    const totalDigits = endChars.filter((c) => /\d/.test(c)).length;
    let digitCounter = 0;

    const renderedDigits = endChars.map((endChar, i) => {
        const startChar = startChars[i];

        if (/\d/.test(endChar)) {
            const digitOffset = digitCounter;
            digitCounter++;

            return mode === 'simple' ? (
                <SimpleSlideDigit key={`simple-${i}-${key}`} startChar={startChar} endChar={endChar} trigger={trigger}/>
            ) : (
                <SlotMachineDigit
                    key={`slot-${i}-${key}`}
                    startChar={startChar}
                    endChar={endChar}
                    index={digitOffset}
                    trigger={trigger}
                    totalDigits={totalDigits}
                />
            );
        }

        return (
            <div key={`char-${i}`} className="flex items-center justify-center font-bold">
                {endChar}
            </div>
        );
    });

    return <div className={cn('flex justify-center items-center', className)}>{renderedDigits}</div>;
};
