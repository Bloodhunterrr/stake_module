import React, {useState} from "react";
import {Portal} from "@/components/casino/portal.tsx";
import WindowGame from "@/components/casino/windowGame.tsx";

type GameWindowsManagerContextType = {
    addGame: (a: {
        id: number,
        title: string,
        url: string,
        provider: string
    }) => void;
    gameList: Array<{
        id: number,
        title: string,
        url: string,
        provider: string
    }>;
}

const GameWindowsManagerContext = React.createContext<GameWindowsManagerContextType | null>(null);


function GameWindowsManagerProvider({children}: { children: React.ReactNode }) {


    const [gameList, setGameList] = useState<Array<{
        id: number,
        title: string,
        url: string,
        provider: string
    }>>([]);

    const addGame = (a: {
        id: number,
        title: string,
        url: string,
        provider: string
    }) => {
        setGameList([...gameList, a]);
    }

    const removeGame = (gameId: number) => {
        setGameList(prevGameList => prevGameList.filter((g) => g.id !== gameId));
    }

    return (
        <GameWindowsManagerContext.Provider value={{
            addGame,
            gameList
        }}>
            {children}
            {
                gameList.map((game) => {
                    return (
                        <Portal key={game.id.toString()}>
                            <WindowGame
                                title={game.title}
                                url={game.url}
                                provider={game.provider}
                                backBtn={() => removeGame(game.id)}/>
                        </Portal>
                    )
                })
            }
        </GameWindowsManagerContext.Provider>
    )
}


function useGameWindowsManager() {
    const context = React.useContext(GameWindowsManagerContext);

    if (!context) {
        throw new Error('useGameWindowsManager must be used within a GameWindowsManagerProvider');
    }

    return context;
}

export {GameWindowsManagerProvider, useGameWindowsManager};