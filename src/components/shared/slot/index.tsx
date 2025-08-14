import type {Game} from "@/types/game_list";
;
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useLazyGetPlayQuery } from "@/services/authApi";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks/rtk";
import { useEffect, useState } from "react";
import Login from "../login";
import Modal from "../modal";
import type { User, Wallet } from "@/types/auth";
import { LoaderSpinner } from "@/components/shared/Loader";
import { setModal } from "@/slices/sharedSlice";

const ModalBalanceInfo = ({
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
      <div>
      </div>
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
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [depositModal, setDepositModal] = useState<boolean>(false);
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
        language: 'en',
        exit: window.location.origin,
        currency: (defaultWallet?.slug || "eur")?.toUpperCase(),
      }).unwrap();

      if (!isDesktop) {
        window.location.href = data?.play_url;
      } else {
        navigate(`/game/${game?.id}`, {
          state: {
            play_url: data?.play_url,
            game,
          },
        });
      }
    } catch (error) {
      toast.error(`Failed to fetch play game url!`);
      console.error("Failed to fetch play URL:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <>
      <div onClick={handleGameClick}>
        <p>{game?.name}</p>
      </div>
      {playLoading && <LoaderSpinner />}
      {depositModal && (
        <Modal title={null} onClose={() => setDepositModal(false)}>
          <ModalBalanceInfo game={game} onClose={() => setDepositModal(false)} />
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

export default GameSlot;
