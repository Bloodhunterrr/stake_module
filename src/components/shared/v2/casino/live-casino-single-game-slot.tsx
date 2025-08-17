import type {Game} from "@/types/game_list.ts";
import {useNavigate} from "react-router";
import {useIsDesktop} from "@/hooks/useIsDesktop.ts";
import type {User, Wallet} from "@/types/auth.ts";
import {useAppSelector} from "@/hooks/rtk.ts";
import {useEffect, useState} from "react";
import {useLazyGetPlayQuery} from "@/services/authApi.ts";
import {toast} from "react-toastify";
import {HeartIcon} from "lucide-react";
import {LoaderSpinner} from "@/components/shared/Loader";
import Modal from "@/components/shared/modal";
import Login from "@/components/shared/v2/login";
import {ModalBalanceInfo} from "@/components/shared/v2/slot";

const LiveCasinoGameSlot = ({
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

    const closeLogin = () => setLoginModal(false);

    const defaultWallet: Wallet | null =
        user?.wallets?.find((w: Wallet) => w.default) || null;

    useEffect(() => {
        if (loginModal && user) setLoginModal(false);
    }, [loginModal, user]);

    const [triggerGetPlay, { isLoading: playLoading }] = useLazyGetPlayQuery();

    const handleGameClick = async () => {
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

            if (!isDesktop) {
                window.location.href = data?.play_url;
            } else {
                navigate(`/game/${game?.id}`, {
                    state: { play_url: data?.play_url, game },
                });
            }
        } catch (error) {
            toast.error(`Failed to fetch play game url!`);
            console.error("Failed to fetch play URL:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="lg:aspect-[10/6] aspect-square w-30 h-30 lg:w-full lg:h-full rounded-lg overflow-hidden flex items-center justify-center">
                <div
                    className="w-full h-full bg-card/10  bg-center bg-cover"
                    style={{ backgroundImage: `url(${`images/logo-game-loader.svg`})` }}
                />
            </div>
        );
    }

    return (
        <>
            <div
                className="relative lg:aspect-[10/6] aspect-square w-30 h-30 lg:w-full lg:h-full  rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                onClick={handleGameClick}
            >

                <div
                    className="absolute inset-0 bg-center bg-cover opacity-40"
                    style={{ backgroundImage: `url(${`images/logo-game-loader.svg`})`  }}
                />

                <img
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={game?.image}
                    loading="lazy"
                    alt={game?.name}
                />

                <HeartIcon className="absolute top-2 right-2 w-5 h-5 text-white opacity-80 hover:opacity-100" />

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-800 via-gray-800/80 to-transparent p-2 text-center">
                    <p className="text-white text-sm font-bold truncate">{game?.name}</p>
                    <p className="text-gray-300 text-xs truncate">
                        {game?.provider_type}
                    </p>
                </div>
                {playLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <LoaderSpinner />
                    </div>
                )}
            </div>

            {depositModal && (
                <Modal title={null} onClose={() => setDepositModal(false)}>
                    <ModalBalanceInfo
                        game={game}
                        onClose={() => setDepositModal(false)}
                    />
                </Modal>
            )}
            {loginModal && (
                <Modal title={`Login`} onClose={closeLogin}>
                    <Login />
                </Modal>
            )}
        </>
    );
};

export default LiveCasinoGameSlot;
