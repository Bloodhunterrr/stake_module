import { Rnd } from "react-rnd";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import CloseIcon from "@/assets/icons/close.svg?react";
import logoMobileSportbook from "@/assets/images/logo-mobile.svg";
import {useNavigate} from "react-router";

interface WindowGameProps {
    title: string;
    url: string;
    provider: string;
}

export default function WindowGame({ title, url, provider }: WindowGameProps) {
    const [windowState, setWindowState] = useState({
        x: typeof window !== 'undefined' ? window.innerWidth - 475 : 100,
        y: typeof window !== 'undefined' ? window.innerHeight - 407 : 100,
        width: 400,
        height: 332,
    });
    const navigate = useNavigate();
    const handleGoBack = () => {
        const searchParams = new URLSearchParams(location.search);
        const previousPage = searchParams.get("previousPage");
        if (previousPage) {
            navigate(previousPage);
        } else {
            navigate(-1);
        }
    };

    console.log(title, url, provider);

    return (
        <Rnd
            default={{
                x: windowState.x,
                y: windowState.y,
                width: windowState.width,
                height: windowState.height,
            }}
            size={{
                width: windowState.width,
                height: windowState.height
            }}
            position={{
                x: windowState.x,
                y: windowState.y
            }}
            onDragStop={(_e, d) => {
                setWindowState(prev => ({
                    ...prev,
                    x: d.x,
                    y: d.y
                }));
            }}
            onResizeStop={(_e, _direction, ref, _delta, position) => {
                setWindowState(prev => ({
                    ...prev,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: position.x,
                    y: position.y,
                }));
            }}
            bounds="window"
            minWidth={400}
            minHeight={332}
            maxWidth={800}
            maxHeight={600}
            className="z-150">
            <div className="w-full h-full bg-[var(--grey-600)] text-lg font-bold rounded-lg flex flex-col shadow-[0_0_10px_0_rgba(0,0,0,0.5)]">
                <div className="cursor-move flex whitespace-nowrap flex-row justify-start items-center select-none overscroll-none rounded-[8px_8px_0_0] h-11 overflow-hidden text-white">
                    <span className="pl-2 max-w-[calc(100%-150px)] truncate leading-11">{title}</span>
                    <div className="flex ml-auto h-full">
                        <Button onClick={handleGoBack}
                                aria-label="Go Back"
                                className="bg-transparent h-full w-12.5 rounded-none lg:hover:bg-red-600/80">
                            <CloseIcon className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
                <iframe id="game-iframe" title={title} src={url} allowFullScreen className="h-[calc(100%-107px)] w-full"/>
                <div className="h-[63px] bg-[var(--grey-700)] flex whitespace-nowrap flex-row justify-start items-center pointer-events-none text-sm rounded-[0_0_8px_8px] text-white">
                    <div className="w-[calc(50%-50px)] h-full flex whitespace-nowrap flex-row justify-start items-center">
                        <span className="pl-2">{provider}</span>
                    </div>
                    <img src={logoMobileSportbook} alt="logo" className="h-[36px] mr-auto"/>
                </div>
            </div>
        </Rnd>
    );
}