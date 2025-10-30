import {Heart} from "lucide-react";
import type {User} from "@/types/auth";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/hooks/rtk";
import type {Game} from "@/types/game_list";
import {Button} from "@/components/ui/button";
import Search from "@/components/casino/search";
import {useNavigate, useLocation} from "react-router";
import CloseIcon from "@/assets/icons/close.svg?react";
import SearchIcon from "@/assets/icons/search.svg?react";
import FullScreenIcon from "@/assets/icons/fullscreen.svg?react";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import Loading from "@/components/shared/v2/loading.tsx";
import {Trans} from "@lingui/react/macro";


export default function GamesIframe() {
    const navigate = useNavigate();
    const {gameData} = useGameLoader();
    const {play_url, game} = gameData;
    console.log(game);

    if (!play_url || !game) {
        return (
            <div
                className="gameview-wrapper relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-cover bg-center">
                <div className="flex h-full w-full items-center justify-center">
                    <Loading/>
                </div>
            </div>
        );
    }

    const handleGoBack = () => {
        const searchParams = new URLSearchParams(location.search);
        const previousPage = searchParams.get("previousPage");
        if (previousPage) {
            navigate(previousPage);
        } else {
            navigate(-1);
        }
    };

    console.log(game);

    return (
        <div className="bg-relative flex h-[calc(100vh-64px)] w-screen md:w-[calc(100svw-60px)] ml-auto flex-col items-center pt-10">
            <main className="mx-auto relative z-0 flex aspect-[1200/675] w-[calc(94svw-60px)] max-w-[1700px] items-center justify-center">
                <iframe id="game-iframe" title={game.name} src={play_url} allowFullScreen
                    className="h-full w-full rounded-t-lg rounded-b-none shadow-2xl"></iframe>
            </main>
            <footer className="mx-auto flex h-[63px] w-[calc(94svw-60px)] max-w-[1700px] items-center justify-between bg-[var(--grey-900)] px-3 py-2 rounded-b-lg">
                <nav className="flex items-center justify-center space-x-2 h-full">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-transparent">
                                <SearchIcon className="h-4 w-4"/>
                                <span className="hidden sm:inline">
                                    <Trans>Switch Game</Trans>
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] border-gray-700 bg-gray-900 text-white shadow-lg z-100 h-[calc(100svh_-_60px)]
                                                  top-[calc(50%+30px)] w-screen min-w-screen md:left-[calc(50%+30px)] md:w-[calc(100vw-60px)] md:min-w-[calc(100vw-60px)] rounded-none border-none"
                            closeButtonClassName="z-2">
                            <Search/>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={toggleFullScreen}
                        aria-label="Toggle Fullscreen"
                        className="bg-transparent">
                        <FullScreenIcon className="h-4 w-4 text-white"/>
                    </Button>
                    <Button
                        aria-label="Add to Favorites"
                        className="bg-transparent">
                        <Heart/>
                    </Button>
                    <Button
                        onClick={handleGoBack}
                        aria-label="Go Back"
                        className="bg-transparent">
                        <CloseIcon className="h-4 w-4 text-white"/>
                    </Button>
                </nav>
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-white md:text-2xl">{game.name}</h1>
                </div>
            </footer>
        </div>
    );
};

const useGameLoader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user: User = useAppSelector((state) => state.auth?.user);
    const [gameData, setGameData] = useState<{
        play_url?: string;
        game?: Game;
    }>({});

    useEffect(() => {
        if (!location.state || !location.state.play_url || !location.state.game || !user) {
            navigate("/", {replace: true});
        } else {
            setGameData(location.state);
        }
    }, [location.state, user, navigate]);

    return {gameData, user};
};

const toggleFullScreen = () => {
    const iframe = document.getElementById("game-iframe");
    if (!iframe) return;

    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        iframe.requestFullscreen();
    }
};
