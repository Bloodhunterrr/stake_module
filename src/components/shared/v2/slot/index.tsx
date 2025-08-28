import type { Game } from "@/types/game_list.ts";
import { useIsDesktop } from "@/hooks/useIsDesktop.ts";
import { useLazyGetPlayQuery } from "@/services/authApi.ts";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks/rtk.ts";
import { useEffect, useState } from "react";

import Login from "../login";
import Modal from "../../modal";
import type { User, Wallet } from "@/types/auth.ts";
import { LoaderSpinner } from "@/components/shared/Loader";
import { setModal } from "@/slices/sharedSlice.ts";
import { HeartIcon } from "lucide-react";

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
      <>
        <h2>
          <div>Your balance is </div> 0
        </h2>
        <p>
          <div>Please top up your account to play for real money.</div>
        </p>

        <div>
          <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                dispatch(setModal({ modal: "deposit" }));
              }}
          >
            <div>
              <div>Deposit now</div>
            </div>
          </button>
          {game?.hasDemo && (
              <button
                  onClick={() => {
                    if (!isDesktop) {
                      window.open(game?.demoURL, "_blank");
                    } else {
                      navigate(`/game/${game?.id}`, {
                        state: {
                          play_url: game?.demoURL,
                          game,
                        },
                      });
                    }
                  }}
              >
                <div>
                  <div>Or play demo</div>
                </div>
              </button>
          )}
        </div>
      </>
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
        navigate(`/game/${game?.id}?previousPage=${window.location.pathname}`, {
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
        <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
          <div
              className="w-full h-full bg-center bg-card/10"
              style={{ backgroundImage: `url(${`images/logo-game-loader.svg`})` }}
          />
        </div>
    );
  }

  return (
      <>
        <div
            className="relative aspect-square rounded-lg overflow-hidden hover:lg:scale-[1.02] transition-transform duration-300 shadow-lg cursor-pointer group"
            onClick={handleGameClick}
        >
          <div
              className="absolute inset-0 bg-center bg-cover opacity-40"
              style={{ backgroundImage: `url(${`images/logo-game-loader.svg`})` }}
          />

          <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 "
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
              <Login setLoginModalOpen={setLoginModal}/>
            </Modal>
        )}
      </>
  );
};

export default GameSlot;
