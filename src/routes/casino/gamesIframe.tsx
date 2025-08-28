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
import GameBGImg from "./../../assets/images/game-bg.png";
import FullScreenIcon from "@/assets/icons/fullscreen.svg?react";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import Loading from "@/components/shared/v2/loading.tsx";


export default function GamesIframe() {
    const navigate = useNavigate();
    const {gameData} = useGameLoader();
    const {play_url, game} = gameData;

    if (!play_url || !game) {
        return (
            <div
                className="gameview-wrapper relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-cover bg-center"
                style={{backgroundImage: `url(${GameBGImg})`}}
            >
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

    return (
        <div
            className="bg-relative flex h-[calc(100vh-64px)] w-screen flex-col items-center justify-center gap-4"
            style={{backgroundImage: `url(${GameBGImg})`}}
        >
            <header className="container mx-auto flex w-full items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-white md:text-2xl">{game.name}</h1>
                </div>
                <nav className="flex items-center space-x-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                            >
                                <SearchIcon className="h-4 w-4"/>
                                <span className="hidden sm:inline">Switch Game</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            className="sm:max-w-[700px] rounded-lg border-gray-700 bg-gray-900 text-white shadow-lg">
                            <Search/>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={toggleFullScreen}
                        aria-label="Toggle Fullscreen"
                    >
                        <FullScreenIcon className="h-4 w-4 text-white"/>
                    </Button>
                    <Button
                        aria-label="Add to Favorites"
                    >
                        <Heart/>
                    </Button>
                    <Button
                        onClick={handleGoBack}
                        aria-label="Go Back"
                    >
                        <CloseIcon className="h-4 w-4 text-white"/>
                    </Button>
                </nav>
            </header>
            <main className="container mx-auto relative z-0 flex h-9/10 w-full items-center justify-center ">
                <iframe
                    id="game-iframe"
                    title={game.name}
                    src={play_url}
                    allowFullScreen
                    className="h-full w-full rounded-lg shadow-2xl"
                ></iframe>
            </main>
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
