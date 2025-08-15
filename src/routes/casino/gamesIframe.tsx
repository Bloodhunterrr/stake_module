import FullScreenIcon  from "@/assets/icons/fullscreen.svg?react";
import SearchIcon  from "@/assets/icons/search.svg?react";
import HeartIcon  from "@/assets/icons/heart.svg?react";
import CloseIcon  from "@/assets/icons/close.svg?react";
import GameBGImg from "./../../assets/images/game-bg.png";
import { useNavigate } from "react-router";
import Loader from "@/components/shared/Loader";
;
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import type { Game } from "@/types/game_list";
import type { User } from "@/types/auth";
import { useAppSelector } from "@/hooks/rtk";
import Modal from "@/components/shared/modal";
import Search from "@/components/casino/search";

function toggleFullScreen() {
  const iframe = document.getElementById("game-iframe") as any;

  if (
    !document.fullscreenElement &&
    !iframe.webkitFullscreenElement &&
    !iframe.mozFullScreenElement &&
    !iframe.msFullscreenElement
  ) {
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
      iframe.mozRequestFullScreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (iframe.webkitExitFullscreen) {
      iframe.webkitExitFullscreen();
    } else if (iframe.mozCancelFullScreen) {
      iframe.mozCancelFullScreen();
    } else if (iframe.msExitFullscreen) {
      iframe.msExitFullscreen();
    }
  }
}

const GameIframe = () => {
  const [searchModal, setSearchModal] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  

  const user: User = useAppSelector((state) => state.auth?.user);

  const { play_url, game } =
    location.state ||
    ({} as {
      play_url?: string;
      game?: Game;
    });

  useEffect(() => {
    if (!play_url || !game || !user) {
      navigate("/", { replace: true });
    }
  }, [play_url, game, user, navigate]);

  return (
    <div id="mf-gameview" className="gameview-wrapper">
      <div
        className={"game-page game-page__desktop " + "iframe-loading"}
        style={{ backgroundImage: `url(${GameBGImg})`, aspectRatio: "16 / 9" }}
      >
        <div className="game-mode game-mode--desktop game-mode--single">
          <div className="game-mode__multiple">
            <div className="game-item game-mode__game game-mode__game--screen-1">
              <div className="game-item__content">
                <div className="game-header game-header--logged-in">
                  <div className="gv-header">
                    <p className="m-text m-fs16 m-fw600 m-lh150 game-header__name">
                      {game?.name}
                    </p>
                    <button className="m-button m-gradient-border m-button--secondary m-button--s">
                      <div className="m-icon-container">
                        <SearchIcon />
                      </div>
                      <div
                        className="m-button-content"
                        onClick={() => setSearchModal(true)}
                      >
                        <div>Switch Game</div>
                      </div>
                    </button>
                    <button
                      onClick={toggleFullScreen}
                      className="m-button m-gradient-border m-button--secondary m-button--s game-favorite"
                    >
                      <div className="m-icon-container">
                        <FullScreenIcon />
                      </div>
                    </button>
                    <button className="m-button m-gradient-border m-button--secondary m-button--s game-favorite">
                      <div className="m-icon-container">
                        <HeartIcon
                          viewBox="0 0 24 24"
                          className="m-icon m-icon-loadable"
                        />
                      </div>
                    </button>
                    <button
                      onClick={() => navigate(-1)}
                      className="m-button m-gradient-border m-button--secondary m-button--s gv-close"
                    >
                      <div className="m-icon-container">
                        <CloseIcon className="m-icon m-icon-loadable" />
                      </div>
                    </button>
                  </div>
                </div>
                {!play_url || !game ? (
                  <div className="game-iframe game-iframe--desktop">
                    <Loader />
                  </div>
                ) : (
                  <iframe
                    id="game-iframe"
                    title={game?.name}
                    className="game-iframe game-iframe--desktop"
                    src={play_url}
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {searchModal && (
        <Modal
          width={700}
          title={`Search`}
          onClose={() => setSearchModal(false)}
          additionalClass="search-modal search-modal--search"
        >
          <Search onCloseSearchModal={() => setSearchModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default GameIframe;
