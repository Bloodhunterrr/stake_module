import type { Game } from "@/types/game_list.ts";
import { useIsDesktop } from "@/hooks/useIsDesktop.ts";
import { useLazyGetPlayQuery } from "@/services/authApi.ts";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks/rtk.ts";
import { useEffect, useState } from "react";
import type { User, Wallet } from "@/types/auth.ts";
import { setModal } from "@/slices/sharedSlice.ts";
import {ExternalLink, Info} from "lucide-react";
import Login from "@/components/shared/v2/login";
import Loading from "@/components/shared/v2/loading";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trans } from "@lingui/react/macro";
import {useGameWindowsManager} from "@/contexts/gameWindowsManagerContext.tsx";


export const ModalBalanceInfo = ({
                                     game,
                                     onClose,
                                 }: {
    game: Game | null;
    onClose: () => void;
}) => {
    const dispatch = useAppDispatch();
    const isDesktop = useIsDesktop();
    const navigate = useNavigate();

    return (
        <div className="flex items-center flex-col">
            <Info className="text-red-500 mb-4" size={50} />
            <h2 className="text-3xl font-semibold mb-4 text-white">
        <span>
          <Trans>Your balance is 0</Trans>
        </span>
            </h2>

            <p className="text-gray-400 mb-6 text-lg text-center">
                <Trans>Please top up your account to play for real money.</Trans>
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        dispatch(setModal({ modal: "deposit" }));
                    }}
                    className="px-6 py-2 bg-card rounded-lg lg:hover:bg-card/80 text-accent-foreground transition">
                    <Trans>Deposit now</Trans>
                </button>

                {game?.hasDemo && (
                    <button
                        onClick={() => {
                            if (!isDesktop) {
                                window.open(game?.demoURL, "_blank");
                            } else {
                                navigate(`/game/${game?.id}`, {
                                    state: { play_url: game?.demoURL, game },
                                });
                            }
                        }}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg lg:hover:bg-gray-300 transition"
                    >
                        <Trans>Or play demo</Trans>
                    </button>
                )}
            </div>
        </div>
    );
};

const GameSlot = ({
                      game,
                      isLoading,
                  }: {
    game: Game | null;
    isLoading: boolean;
}) => {
    const navigate = useNavigate();
    const isDesktop = useIsDesktop();
    const user: User = useAppSelector((state) => state.auth?.user);
    const [loginModal, setLoginModal] = useState(false);
    const [depositModal, setDepositModal] = useState(false);
    const [showWindowGame, setShowWindowGame] = useState(false);
    const [limitReachedModal, setLimitReachedModal] = useState(false);
    const isDesktopAtMinimum = useIsDesktop(1024);
    const { addGame, gameList } = useGameWindowsManager()


    const closeLogin = () => setLoginModal(false);

    const defaultWallet: Wallet | null =
        user?.wallets?.find((w: Wallet) => w.default) || null;

    useEffect(() => {
        if (loginModal && user) setLoginModal(false);
    }, [loginModal, user]);

    const [triggerGetPlay, { isLoading: playLoading }] = useLazyGetPlayQuery();

    const handleGameClick = async (popupActivate: boolean) => {
        if (!game?.id) return;
        if (!user) return setLoginModal(true);
        if (!defaultWallet)
            return toast.error(`Wallet not found! Please check your wallet`);
        if (Number(defaultWallet?.balance) < 1) return setDepositModal(true);

        try {
            const data = await triggerGetPlay({
                device: isDesktop ? "desktop" : "mobile",
                gameID: game.id,
                language: "en",
                exit: window.location.origin,
                currency: (defaultWallet?.slug || "eur")?.toUpperCase(),
            }).unwrap();

            if (!isDesktopAtMinimum) {
                window.location.href = data?.play_url;
            } else {
                if (popupActivate) {
                    if (gameList.length >= 3) {
                        setLimitReachedModal(true);
                        return;
                    }

                    addGame({
                        id: game.id,
                        title: game.name,
                        url: data?.play_url,
                        provider: (game as any).provider.name
                    });

                    setShowWindowGame(true);
                } else {
                    navigate(`/game/${game?.id}?previousPage=${window.location.pathname}`, {
                        state: { play_url: data?.play_url, game }
                    });
                }
            }
        } catch (error) {
            toast.error(`Failed to fetch play game url!`);
            console.error("Failed to fetch play URL:", error);
        }
    };

    const handleMainClick = () => handleGameClick(false);
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleGameClick(true);
    };

    if (isLoading) {
        return (
            <div className="aspect-[4496/6031] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                <div
                    className="w-full h-full bg-center bg-card/10"
                    style={{ backgroundImage: `url(${`images/logo-game-loader.svg`})` }}
                />
            </div>
        );
    }

    console.log(showWindowGame)

    return (
        <>
            <div className="flex flex-col">
                <div
                    className="relative aspect-[4496/6031] rounded-lg overflow-hidden lg:hover:lg:translate-y-[-4%] transition-transform duration-300 shadow-lg cursor-pointer group"
                    onClick={handleMainClick}>
                    <div
                        className="absolute inset-0 bg-center bg-cover opacity-40"
                        style={{ backgroundImage: `url(${`images/logo-game-loader.svg`})` }}/>
                    <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
                         src={game?.image}
                         loading="lazy"
                         alt={game?.name}/>
                    <button onClick={handleButtonClick}
                            className="w-10 h-10 rounded-md absolute bottom-2 right-2 opacity-0 bg-[var(--grey-400)] lg:group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center text-[var(--grey-100)]">
                        <ExternalLink className="size-5 ml-0.5 mb-1"/>
                    </button>
                    {playLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loading />
                        </div>
                    )}
                </div>
                <div className="relative bottom-0 w-full text-[12px] pt-1 px-1">
                    <p className="text-white font-semibold truncate">{game?.name}</p>
                    <p className="text-[var(--grey-400)] truncate">
                        {game?.provider_type}
                    </p>
                </div>
            </div>

            <Dialog open={limitReachedModal} onOpenChange={() => setLimitReachedModal(false)}>
                <DialogContent className="lg:w-[450px] rounded-lg z-100" overlayClassName={"z-100"} closeButtonClassName={"text-[var(--grey-100)]"}>
                    <div className="flex items-center flex-col">
                        <Info className="text-yellow-500 mb-4" size={50} />
                        <h2 className="text-2xl font-semibold mb-4 text-white text-center">
                            <Trans>Maximum windows reached</Trans>
                        </h2>
                        <p className="text-gray-400 mb-6 text-lg text-center">
                            <Trans>You can only open up to 3 game windows at a time. Please close one of the existing windows to open a new one.</Trans>
                        </p>
                        <button onClick={() => setLimitReachedModal(false)}
                                className="px-8 py-2 h-max bg-transparent rounded-lg text-md text-white border border-white lg:hover:text-white lg:hover:bg-popover/80 transition">
                            <Trans>OK</Trans>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={depositModal} onOpenChange={() => setDepositModal(false)}>
                <DialogContent className="lg:w-[450px] rounded-lg">
                    <ModalBalanceInfo
                        game={game}
                        onClose={() => setDepositModal(false)}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={loginModal} onOpenChange={closeLogin}>
                <DialogContent
                    showCloseButton={false}
                    className="p-0 lg:w-[450px] h-max min-h-[400px] rounded-none bg-transparent border-none"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}>
                    <Login setLoginModalOpen={closeLogin} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default GameSlot;