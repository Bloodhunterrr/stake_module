import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button.tsx";
import CloseIcon from "@/assets/icons/close.svg?react";
import logoMobileSportbook from "@/assets/images/logo-mobile.svg";
import { Maximize } from "lucide-react";
import { useRef } from "react";

interface WindowGameProps {
    title: string;
    url: string;
    provider: string;
    backBtn: () => void;
}

export default function WindowGame({ title, url, provider, backBtn }: WindowGameProps) {
    const windowState = {
        x: typeof window !== 'undefined' ? window.innerWidth - 435 : 100,
        y: typeof window !== 'undefined' ? window.innerHeight - 367 : 100,
        width: 400,
        height: 332,
    };

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleClose = () => {
        backBtn();
    };

    const toggleFullScreen = () => {
        if (!iframeRef.current) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            iframeRef.current.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        }
    };

    const handleButtonClick = (e: React.MouseEvent, handler: () => void) => {
        e.stopPropagation();
        handler();
    };

    return (
        <div className={'fixed inset-0 z-100 pointer-events-none'}>
            <div className={'relative size-full'}>
                <Rnd default={{
                        x: windowState.x,
                        y: windowState.y,
                        width: windowState.width,
                        height: windowState.height,
                    }} bounds='parent' enableUserSelectHack={false}
                    className="z-101 !fixed pointer-events-auto"
                    minWidth={400}
                    minHeight={332}
                    maxWidth={1160}
                    maxHeight={782}>
                    <div className="w-full h-full bg-[var(--grey-600)] text-lg font-bold rounded-lg flex flex-col shadow-[0_0_10px_0_rgba(0,0,0,0.5)]">
                        <div className="cursor-move flex whitespace-nowrap flex-row justify-start items-center select-none overscroll-none rounded-[8px_8px_0_0] h-11 overflow-hidden text-white">
                            <span className="pl-2 max-w-[calc(100%-150px)] truncate leading-11">{title}</span>
                            <div className="flex ml-auto h-full">
                                <Button onClick={(e) => handleButtonClick(e, handleClose)}
                                    aria-label="Go Back"
                                    className="bg-transparent text-[var(--grey-200)] h-full w-12.5 rounded-none lg:hover:bg-red-600/80 lg:hover:text-white cursor-pointer">
                                    <CloseIcon className="size-4"/>
                                </Button>
                            </div>
                        </div>
                        <iframe ref={iframeRef}
                            id="game-iframe"
                            title={title}
                            src={url}
                            allowFullScreen
                            className="h-[calc(100%-107px)] w-full"/>
                        <div className="h-[63px] bg-[var(--grey-700)] cursor-default flex whitespace-nowrap flex-row justify-start items-center text-sm rounded-[0_0_8px_8px] text-white">
                            <div className="w-[calc(50%-50px)] h-full flex whitespace-nowrap flex-row justify-start items-center">
                                <span className="pl-2">{provider}</span>
                            </div>
                            <img src={logoMobileSportbook} alt="logo" className="h-[36px] mr-auto"/>
                            <Button onClick={(e) => handleButtonClick(e, toggleFullScreen)}
                                aria-label="Toggle Fullscreen"
                                className="bg-transparent text-[var(--grey-200)] h-full w-12 p-0 cursor-pointer lg:hover:bg-transparent lg:hover:text-white">
                                <Maximize className="size-4" />
                            </Button>
                        </div>
                    </div>
                </Rnd>
            </div>
        </div>
    );
}