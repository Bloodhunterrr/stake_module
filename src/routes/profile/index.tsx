import './style.css';
import WalletIcon  from '@/assets/icons/wallet.svg?react';
import HistoryIcon  from '@/assets/icons/clock.svg?react';
import UserIcon  from '@/assets/icons/user.svg?react';
import ExitIcon  from '@/assets/icons/exit.svg?react';
import ArrowUpIcon  from '@/assets/icons/arrow-up.svg?react';
import ArrowDownIcon  from '@/assets/icons/arrow-down.svg?react';
import Avatar  from "@/assets/icons/avatar.svg?react"

import { useLogoutMutation } from '@/services/authApi';
import { useAppSelector } from '@/hooks/rtk';
import { useNavigate, useMatch, Outlet } from 'react-router';

import { useState, useEffect } from 'react';
import { useIsDesktop } from '@/hooks/useIsDesktop';

const Profile = () => {
  const [logout] = useLogoutMutation();
  const user = useAppSelector((state) => state.auth?.user);
  const navigate = useNavigate();



  const isWalletActive = useMatch('/profile/wallet/*');
  const isHistoryActive = useMatch('/profile/history/*');
  const isProfileActive = useMatch('/profile/*') && !isWalletActive && !isHistoryActive;

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (target instanceof Element && !target.closest('.profile-nav-mobile')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  let mobileLabel = `Profile`;
  let mobileIcon = 'profile'
  
  if (isWalletActive) {
    mobileLabel = `Wallet`;
    mobileIcon = 'wallet'
  } else if (isHistoryActive) {
    mobileLabel = `History`;
    mobileIcon = 'history'
  }

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div style={{ backgroundColor: 'var(--color-dark-grey-0)' }}>
      <section className="profile-wrapper">
        <div className="profile-page">
          {isDesktop && (
            <div className="profile-nav-desktop">
              <div className="user-avatar-wrapper user-avatar-wrapper--default">
                <div className="UserAvatar">
                  <div className="m-avatar UserAvatar-Avatar">
                    <div className="m-avatar__image">
                      <Avatar />
                    </div>
                  </div>
                  <div className="UserAvatar-Text">
                    <div className="UserAvatar-Name">{user?.name}</div>
                    <div className="UserAvatar-Email TextOverflow TextOverflow--light">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>

              <nav>
                <div
                  onClick={() => navigate('wallet')}
                  className={`profile-nav-item ${isWalletActive ? 'profile-nav-item--active' : ''}`}
                >
                  <WalletIcon className="m-icon m-icon-loadable profile-nav-item__icon" />
                  <div>Wallet</div>
                  <div className="profile-nav-item__counter" />
                </div>

                <div
                  onClick={() => navigate('history')}
                  className={`profile-nav-item ${isHistoryActive ? 'profile-nav-item--active' : ''}`}
                >
                  <HistoryIcon className="m-icon m-icon-loadable profile-nav-item__icon" />
                  <div>History</div>
                  <div className="profile-nav-item__counter" />
                </div>

                <div
                  onClick={() => navigate('general')}
                  className={`profile-nav-item ${isProfileActive ? 'profile-nav-item--active' : ''}`}
                >
                  <UserIcon className="m-icon m-icon-loadable profile-nav-item__icon" />
                  <div>Profile</div>
                  <div className="profile-nav-item__counter" />
                </div>
              </nav>

              <div onClick={() => logout()} className="logout-button profile-nav-desktop__logout">
                <button className="m-button m-gradient-border m-button--secondary m-button--s m-button--swap logout-button__btn">
                  <div className="m-icon-container">
                    <ExitIcon />
                  </div>
                  <div className="m-button-content">
                    <div>Log out</div>
                  </div>
                </button>
              </div>
            </div>
          )}
          <div className="profile-page__content hideScrollbar">
            {!isDesktop && (
              <div className="profile-nav-mobile">
                <div
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="m-dropdown m-select profile-nav-mobile"
                >
                  <div className="m-dropdown-activator">
                    <div
                      className="m-input m-gradient-border m-input--basic m-input--m m-input--focused has-value"
                      tabIndex={0}
                    >
                      <div className="m-input-prepend">
                        {mobileIcon === 'profile' && <UserIcon className="m-icon m-icon-loadable profile-nav-mobile__icon" />}
                        {mobileIcon === 'wallet' && <WalletIcon className="m-icon m-icon-loadable profile-nav-mobile__icon" />}
                        {mobileIcon === 'history' && <HistoryIcon className="m-icon m-icon-loadable profile-nav-mobile__icon" />}
                        <span>{mobileLabel}</span>
                      </div>
                      <div className="m-input-append">
                        <div className="m-icon-container">
                          {mobileMenuOpen ? <ArrowUpIcon className="m-icon m-icon-loadable m-chevron m-select-chevron" /> :
                            <ArrowDownIcon className="m-icon m-icon-loadable m-chevron m-select-chevron" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {mobileMenuOpen && (
                  <div
                    className="m-dropdown-content m-dropdown-menu m-dropdown-menu--basic m-dropdown-menu--s m-select-dropdown"
                    data-qa="dropdown"
                    style={{
                      position: 'relative',
                      opacity: 1,
                    }}
                  >
                    <ul className="m-dropdown-menu-list m-select-list" data-qa="select-list">
                      <li
                        className={`m-dropdown-row ${isWalletActive ? 'm-dropdown-row--selected m-dropdown-row--focused' : ''} m-dropdown-row--basic m-dropdown-row--s profile-nav-mobile__item`}
                        tabIndex={0}
                        onClick={() => {
                          navigate('wallet');
                          setMobileMenuOpen(false);
                        }}
                        role="button"
                      >
                        <div className="m-dropdown-row-content">
                          <div className="m-dropdown-row-content-text">
                            <WalletIcon className="m-icon m-icon-loadable profile-nav-mobile__icon" />
                            <span>
                              <div>Wallet</div>
                            </span>
                          </div>
                        </div>
                      </li>
                      <li
                        className={`m-dropdown-row ${isHistoryActive ? 'm-dropdown-row--selected m-dropdown-row--focused' : ''} m-dropdown-row--basic m-dropdown-row--s profile-nav-mobile__item`}
                        tabIndex={0}
                        onClick={() => {
                          navigate('history');
                          setMobileMenuOpen(false);
                        }}
                        role="button"
                      >
                        <div className="m-dropdown-row-content">
                          <div className="m-dropdown-row-content-text">
                            <HistoryIcon className="m-icon m-icon-loadable profile-nav-mobile__icon" />
                            <span>
                              <div>History</div>
                            </span>
                          </div>
                        </div>
                      </li>
                      <li
                        className={`m-dropdown-row ${isProfileActive ? 'm-dropdown-row--selected m-dropdown-row--focused' : ''} m-dropdown-row--basic m-dropdown-row--s profile-nav-mobile__item`}
                        tabIndex={0}
                        onClick={() => {
                          navigate('general');
                          setMobileMenuOpen(false);
                        }}
                        role="button"
                      >
                        <div className="m-dropdown-row-content">
                          <div className="m-dropdown-row-content-text">
                            <UserIcon className="m-icon m-icon-loadable profile-nav-mobile__icon" />
                            <span>
                              <div>Profile</div>
                            </span>
                          </div>
                        </div>
                      </li>
                      <li
                        className={`m-dropdown-row m-dropdown-row--basic m-dropdown-row--s profile-nav-mobile__item`}
                        tabIndex={0}
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        role="button"
                      >
                        <div className="m-dropdown-row-content">
                          <div className="m-dropdown-row-content-text">
                            <ExitIcon className="m-icon m-icon-loadable profile-nav-mobile__icon" />
                            <span>
                              <div>Log out</div>
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;