import SearchIcon  from "@/assets/icons/search.svg?react";
import HamburgerIcon  from "@/assets/icons/hamburger.svg?react";
import WalletIcon  from "@/assets/icons/wallet.svg?react";
import HistoryIcon  from "@/assets/icons/clock.svg?react";
import ExitIcon  from "@/assets/icons/exit.svg?react";
import CloseIcon  from "@/assets/icons/close.svg?react";
import Avatar  from "@/assets/icons/avatar.svg?react";
import UserIcon  from "@/assets/icons/user.svg?react";
import NotificationIcon  from "@/assets/icons/notification.svg?react";

import { currencyList } from "@/utils/currencyList";


import { loadAsset } from "@/utils/loadAsset";
import { useGetMainQuery } from "@/services/mainApi";
import config from "@/config";
import { useEffect, useRef, useState } from "react";
import Modal from "../modal";
;
import Login from "../login";
import { useAppSelector } from "@/hooks/rtk";
import type { Wallet } from "@/types/auth";
import { useNavigate } from "react-router";
import "./styles.css";
import { useLogoutMutation } from "@/services/authApi";
import Search from "@/components/casino/search";
import SignUp from "../signup";
import { useTheme } from "@/hooks/useTheme";

const logo = loadAsset("images/logo.svg?react");

const ProfileDropdown = () => {
  const [logout] = useLogoutMutation();
  const user = useAppSelector((state) => state.auth?.user);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div ref={dropdownRef} className="m-dropdown auth-section__avatar">
      <div
        className="m-dropdown-activator"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="auth-section__avatar auth-section-avatar">
          <div className="m-avatar">
            <div className="m-avatar__image">
              {dropdownOpen ? <CloseIcon /> : <Avatar />}
            </div>
          </div>
        </div>
      </div>

      {dropdownOpen && (
        <div className="m-dropdown-content auth-section-avatar-dropdown">
          <nav className="nav-dropdown">
            <div className="nav-dropdown__content hideScrollbar">
              <div className="nav-dropdown__user">
                <div className="nav-dropdown-user nav-dropdown-user--bg">
                  <div
                    className="nav-dropdown-user__profile"
                    onClick={() => {
                      navigate("/profile/general");
                      setDropdownOpen(false);
                    }}
                  >
                    <div className="m-avatar">
                      <div className="m-avatar__image">
                        <Avatar />
                      </div>
                    </div>
                    <div className="nav-dropdown-user__info">
                      <h4 className="m-text m-fs20 m-fw700 m-lh140 nav-dropdown-user__name">
                        {user?.name}
                      </h4>
                      <p className="m-text m-fs10 m-fw600 m-lh160 nav-dropdown-user__email">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nav-dropdown__items">
                <nav className="nav-dropdown-items">
                  <button
                    onClick={() => {
                      navigate("/profile/wallet");
                      setDropdownOpen(false);
                    }}
                    className="nav-dropdown-item nav-dropdown-item--hover"
                  >
                    <WalletIcon />
                    <p className="m-text m-fs14 m-fw500 m-lh160">
                      <div>Wallet</div>
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/profile/history");
                      setDropdownOpen(false);
                    }}
                    className="nav-dropdown-item nav-dropdown-item--hover"
                  >
                    <HistoryIcon />
                    <p className="m-text m-fs14 m-fw500 m-lh160">
                      <div>History</div>
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/profile/general");
                      setDropdownOpen(false);
                    }}
                    className="nav-dropdown-item nav-dropdown-item--hover"
                  >
                    <UserIcon className="m-icon m-icon-loadable nav-dropdown-item__icon" />
                    <p className="m-text m-fs14 m-fw500 m-lh160">
                      <div>Profile</div>
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      // navigate('/');
                      setDropdownOpen(false);
                    }}
                    className="nav-dropdown-item nav-dropdown-item--hover"
                  >
                    <NotificationIcon className="m-icon m-icon-loadable nav-dropdown-item__icon" />
                    <p className="m-text m-fs14 m-fw500 m-lh160">
                      <div>Notifications</div>
                    </p>
                  </button>
                </nav>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="nav-dropdown-item nav-dropdown-item--hover"
                >
                  <ExitIcon />
                  <p className="m-text m-fs14 m-fw500 m-lh160">
                    <div>Exit</div>
                  </p>
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

type NavBarProps = {
  isDesktop: boolean;
  sideBarOpen: boolean;
  toggleSideBar: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavBar = (props: NavBarProps) => {
  const navigate = useNavigate();
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [signUpModal, setSignUpModal] = useState<boolean>(false);
  const [searchModal, setSearchModal] = useState<boolean>(false);

  const closeLogin = () => setLoginModal(false);
  const closeSignUp = () => setSignUpModal(false);
  const closeSearch = () => setSearchModal(false);

  const user = useAppSelector((state) => state.auth.user);
  const defaultWallet: Wallet | undefined = user?.wallets.find(
    (w: Wallet) => w.default
  );

  const { data } = useGetMainQuery();
  
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (user) {
      setLoginModal(false);
    }
  }, [user]);

  return (
    <>
      <nav >
        <div style={{display: "flex", flexDirection: 'row', justifyContent: "space-between"}}>
          <div>
            {!props.isDesktop && (
              <button
                onClick={() => props.toggleSideBar(!props.sideBarOpen)}
               
              >
                <HamburgerIcon />
              </button>
            )}
            {!props.sideBarOpen && (
              <span
                onClick={() => navigate("/")}
             
              >
                <img height={"33px"} src={logo} alt="logo" />
              </span>
            )}
          </div>

          <div >
            <div style={{display: "flex", flexDirection: "row"}}
            
            >
              {data?.map((R) =>
                !R.is_sportbook && R.subcategories.length === 0 ? null : (
                  <span
                    key={R.id}
                    onClick={() => navigate(`/${R.slug}`)}
                  
                    data-qa="segment-0"
                  >
                    <div>
                      <img
                        src={config.baseUrl + "/storage/" + R.icon}
                        alt={R.name}
                      />
                    </div>
                    <span>{R.name}</span>
                  </span>
                )
              )}
            </div>
          </div>

          <div style={{display: "flex", flexDirection: "row"}}>
            <div
              onClick={() => setSearchModal(true)}
             
            >
              <SearchIcon />
            </div>

            <button
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
              }}
            
              onClick={toggleTheme}
            >
              <div>
                {theme === "dark" ? (
                  // Moon icon for dark mode
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="none"
                  >
                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </svg>
                ) : (
                  // Sun icon for light mode
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"
                    />
                  </svg>
                )}
              </div>
            </button>

            {user && defaultWallet && (
              <div >
                <div >
                  <div
                    is="div"
                  
                  >
                    <div >
                      {(+defaultWallet.balance / 100).toLocaleString("en-EN", {
                        minimumFractionDigits: defaultWallet.decimal_places,
                        maximumFractionDigits: defaultWallet.decimal_places,
                      })}{" "}
                      {/* @ts-ignore */}
                      {
                        currencyList[defaultWallet.slug.toUpperCase()]
                          .symbol_native
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {user ? (
              <ProfileDropdown />
            ) : (
              <>
                <button
                
                  onClick={() => setLoginModal(true)}
                >
                  <div >Log in</div>
                </button>
                <button
                 
                  onClick={() => setSignUpModal(true)}
                >
                  <div >Sign up</div>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      {loginModal && (
        <Modal title={`Login`} onClose={closeLogin}>
          <Login />
        </Modal>
      )}
      {signUpModal && (
        <Modal title={`Sign Up`} onClose={closeSignUp}>
          <SignUp />
        </Modal>
      )}
      {searchModal && (
        <Modal
          width={700}
          title={`Search`}
          onClose={closeSearch}
          additionalClass="search-modal search-modal--search"
        >
          <Search onCloseSearchModal={() => setSearchModal(false)} />
        </Modal>
      )}
    </>
  );
};

export default NavBar;
