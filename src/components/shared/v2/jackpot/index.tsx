import {Crown, Diamond, Gem} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card.tsx";
import AnimatedNumber from "@/components/shared/v2/jackpot/animated-number.tsx";
import {type JSX, useCallback, useEffect, useRef, useState} from "react";

interface JackpotItem {
    id: 'major' | 'minor' | 'mini';
    title: string;
    icon: JSX.Element;
}

interface JackpotValues {
    main: string;
    major: string;
    minor: string;
    mini: string;
}

const API_FETCH_INTERVAL_MS = 5000;
const MOCK_API_DELAY_MS = 500;
export const DEFAULT_SLIDE_DIGIT_HEIGHT = 16;
export const SIMPLE_ANIMATION_DURATION_MS = 500;
export const DEFAULT_SLOT_DIGIT_HEIGHT = 72;
export const SLOT_ANIMATION_DURATION_MS = 2000;
export const SLOT_DELAY_PER_DIGIT_MS = 100;

/**
 * Manages the jackpot values and updates them.
 */
export default function Jackpot() {
    const jackpotData: JackpotItem[] = [
        {id: 'major', title: 'Major', icon: <Crown/>},
        {id: 'minor', title: 'Minor', icon: <Diamond/>},
        {id: 'mini', title: 'Mini', icon: <Gem/>},
    ];

    const [jackpotValues, setJackpotValues] = useState<JackpotValues>({
        main: '0.00€',
        major: '0€',
        minor: '0€',
        mini: '0€',
    });
    const [isLoading, setIsLoading] = useState(true);
    const prevJackpotValuesRef = useRef<JackpotValues>(jackpotValues);

    useEffect(() => {
        prevJackpotValuesRef.current = jackpotValues;
    }, [jackpotValues]);

    // Prevent unnecessary re-creation.
    const fetchJackpotData = useCallback(async () => {
            setIsLoading(true);
            try {
                const mockApiResponse = {
                    main: (Math.random() * 100000 + 20000).toFixed(2) + '€',
                    major: (Math.random() * 50000 + 15000).toFixed(0) + '€',
                    minor: (Math.random() * 10000 + 5000).toFixed(0) + '€',
                    mini: (Math.random() * 3000 + 1000).toFixed(0) + '€',
                };

                await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY_MS));
                setJackpotValues(mockApiResponse);
            } catch (error) {
                console.error("Failed to fetch jackpot data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        , []);

    useEffect(() => {
        fetchJackpotData();
        const intervalId = setInterval(fetchJackpotData, API_FETCH_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, [fetchJackpotData]);

    return (
        <>
            <style>
                {`
                @keyframes jackpot-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                }
                @keyframes number-glow {
                    0%, 100% { text-shadow: 0 0 5px rgba(255, 204, 0, 0.6), 0 0 10px rgba(255, 204, 0, 0.4); }
                    50% { text-shadow: 0 0 15px rgba(255, 204, 0, 1), 0 0 25px rgba(255, 204, 0, 0.8); }
                }
                @keyframes shimmer {
                  0% { background-position: -200% 0; }
                  100% { background-position: 200% 0; }
                }
                .shimmer-bg {
                  background: #4a4a4a;
                  background: linear-gradient(90deg, #4a4a4a 0%, #636363 50%, #4a4a4a 100%);
                  background-size: 200% 100%;
                  animation: shimmer 1.5s infinite;
                }
                `}
            </style>
            <Card
                className="relative w-full  overflow-hidden rounded-[2rem] border-none bg-zinc-900 lg:p-6 px-6 pt-3  md:p-8">
                <div
                    className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle,rgba(255,193,7,0.15)_0%,rgba(255,193,7,0)_70%)] animate-[jackpot-pulse_4s_infinite_ease-in-out]"></div>
                <div className="relative z-10 flex flex-col items-center gap-2 lg:gap-6">
                    <div className="text-center">
                        <h1 className="font-extrabold uppercase leading-none tracking-tight">
                            <span className="block text-amber-400 text-3xl sm:text-4xl md:text-5xl">Mega</span>
                            <span className="block text-white text-2xl sm:text-3xl md:text-4xl">Jackpot</span>
                        </h1>
                    </div>

                    <div className="animate-[number-glow_3s_infinite_ease-in-out] will-change-[text-shadow]">
                        {isLoading ? (
                            <div className="shimmer-bg h-18 w-80 rounded-lg"/>
                        ) : (
                            <AnimatedNumber
                                startValue={prevJackpotValuesRef.current.main}
                                endValue={jackpotValues.main}
                                className="flex items-center justify-center text-amber-400 text-3xl sm:text-4xl md:text-5xl"
                                mode="slot"
                            />
                        )}
                    </div>

                    <div className="flex w-full  justify-around gap-4 flex-row sm:gap-6 lg:gap-8">
                        {jackpotData.map((jackpot) => (
                            <Card
                                key={jackpot.id}
                                className="group flex flex-1 flex-col items-center gap-3 rounded-xl border-2 border-zinc-700 bg-zinc-800/50 p-3 sm:p-4 lg:flex-row backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-white/20">
                                <div
                                    className="flex w-7 h-7 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-amber-400 p-1.5 shadow-lg transition-all duration-300 lg:group-hover:translate-y-[-4%]">
                                    {jackpot.icon}
                                </div>
                                <CardContent className="p-0 text-center lg:text-left">
                                    <span className="block text-xs font-medium uppercase text-zinc-400">
                                        {jackpot.title}
                                    </span>
                                    {isLoading ? (
                                        <div className="shimmer-bg mt-1 h-6 lg:w-24 rounded"/>
                                    ) : (
                                        <AnimatedNumber
                                            startValue={prevJackpotValuesRef.current[jackpot.id]}
                                            endValue={jackpotValues[jackpot.id]}
                                            mode="simple"
                                            className="mt-0.5 text-lg font-bold text-white sm:text-xl"
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/*<button*/}
                    {/*    onClick={fetchJackpotData}*/}
                    {/*    disabled={isLoading}*/}
                    {/*    className="mt-6 rounded-full bg-amber-400 px-5 py-2 text-base font-bold uppercase tracking-wide text-zinc-900 shadow-xl transition-transform hover:scale-105 active:scale-95 disabled:bg-zinc-500 disabled:cursor-not-allowed"*/}
                    {/*>*/}
                    {/*    {isLoading ? 'Fetching...' : 'Update Jackpot'}*/}
                    {/*</button>*/}
                </div>
            </Card>
        </>
    );
}