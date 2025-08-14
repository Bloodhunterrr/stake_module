import {loadAsset} from "@/utils/loadAsset";

import ArrowDown from "@/assets/icons/arrow-down.svg?react";
import Hamburger from "@/assets/icons/hamburger.svg?react";
import Support from "@/assets/icons/support.svg?react";
import LobbyIcon from "@/assets/icons/lobby.svg?react";

import "./language.css";
import "./sidebar.css";
import {ALLOWED_LANGUAGES} from "@/types/lang";
import {useGetMainQuery} from "@/services/mainApi";
import config from "@/config";
import {useNavigate} from "react-router";
import {useParams} from "react-router";

const logo = loadAsset("images/logo.svg?react");

const Language = () => {

    const currentLang =
        ALLOWED_LANGUAGES['en' as keyof typeof ALLOWED_LANGUAGES];

    return (
        <>
            <button
                className="m-button m-gradient-border m-button--secondary m-button--m lang-switcher-btn"
            >
                <div className="m-button-content">
                    <span className="lang-switcher-country">{currentLang.name}</span>
                </div>
                <div className="m-icon-container">
                    <ArrowDown/>
                </div>
            </button>
            {/*{open && (*/}
            {/*  <Modal title={`Select a language`} onClose={handleClose}>*/}
            {/*    <div className="LangSwitcherModal-Countries">*/}
            {/*      {Object.values(ALLOWED_LANGUAGES).map((lang) => {*/}
            {/*        return (*/}
            {/*          <span*/}
            {/*            className="LangSwitcherModal-Country"*/}
            {/*            onClick={() => [*/}
            {/*              i18n.activate(lang.code),*/}
            {/*              handleClose(),*/}
            {/*              localStorage.setItem("lang", lang.code),*/}
            {/*            ]}*/}
            {/*          >*/}
            {/*            {i18n.locale === lang.code && (*/}
            {/*              <span className="LangSwitcherModal-Country-Checkmark">*/}
            {/*                <CheckMark />*/}
            {/*              </span>*/}
            {/*            )}*/}
            {/*            <span className="LangSwitcherModal-Country-Text">*/}
            {/*              {lang.name}*/}
            {/*            </span>*/}
            {/*          </span>*/}
            {/*        );*/}
            {/*      })}*/}
            {/*    </div>*/}
            {/*  </Modal>*/}
            {/*)}*/}
        </>
    );
};

type SideBarProps = {
    isDesktop: boolean;
    sideBarOpen: boolean;
    toggleSideBar: React.Dispatch<React.SetStateAction<boolean>>;
};

const SideBar = (props: SideBarProps) => {
    const {data} = useGetMainQuery();
    const navigate = useNavigate();
    const {categorySlug} = useParams();

    console.log(data);

    return (
        <div className={`nav-sidebar ${props.sideBarOpen ? "opened" : ""} isFull`}>
            {!props.isDesktop && props.sideBarOpen && (
                <div
                    className="nav-sidebar-overlay"
                    onClick={() => props.toggleSideBar(false)}
                />
            )}
            <div className="nav-sidebar-content">
                {props.sideBarOpen && (
                    <div className="nav-sidebar-expanded">
                        <div className="nav-sidebar-header">
                            <button className="nav-sidebar-header-toggle">
                                <div
                                    className="nav-sidebar-header-wrap"
                                    onClick={() => props.toggleSideBar(!props.sideBarOpen)}
                                >
                                    <Hamburger/>
                                </div>
                            </button>
                            <span
                                aria-current="page"
                                onClick={() => navigate("/")}
                                className="router-link-active router-link-exact-active nav-logo nav-sidebar-header-logo"
                            >
                <img height={"33px"} src={logo} className="" alt="logo"/>
              </span>
                        </div>
                        <div className="nav-sidebar-expanded-content">
                            <div className="nav-sidebar-expanded-scrollY hideScrollbar nav-sidebar-expanded--gap">
                                <ul>
                                    {data?.map((R) =>
                                            !R.is_sportbook && R.subcategories.length === 0 ? null : (
                                                <li key={R.id} style={{marginBottom: 20}}>
                                                    <div onClick={() => navigate(`/${R.slug}`)}>
                                                        <img
                                                            src={config.baseUrl + "/storage/" + R.icon}
                                                            alt={R.name}
                                                            width={20}
                                                            height={20}
                                                        />
                                                        <span>{R.name}</span>
                                                    </div>

                                                    {R.subcategories.length > 0 && (
                                                        <ul style={{marginLeft: 10}}>
                                                            {!R.is_sportbook && (
                                                                <li onClick={() => navigate(`/${R.slug}`)}>
                                                                    <LobbyIcon style={{width: 20, height: 20}}/>
                                                                    <span>
                                  <div>Lobby</div>
                                </span>
                                                                </li>
                                                            )}
                                                            {R.subcategories.map((C) => (
                                                                <li
                                                                    key={C.id}
                                                                    onClick={() =>
                                                                        navigate(`/${R.slug}/games/${C.slug}`)
                                                                    }
                                                                >
                                                                    <img
                                                                        src={config.baseUrl + "/storage/" + C.icon}
                                                                        alt={C.name}
                                                                        width={20}
                                                                        height={20}
                                                                    />
                                                                    <span>{C.name}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            )
                                    )}
                                </ul>

                                <div className="nav-sidebar-expanded-support">
                                    <div className="nav-sidebar-expanded-support-help">
                                        <div className="m-dropdown">
                                            <div className="m-dropdown-activator">
                                                <button
                                                    onClick={() => console.log('chat')}
                                                    className="m-button m-gradient-border m-button--success m-button--m nav-sidebar-support"
                                                >
                                                    <div className="m-button-content">
                                                        <Support/>
                                                        Support
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <Language/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {props.isDesktop && !props.sideBarOpen && (
                    <div className="nav-sidebar-wrapped">
                        <div className="nav-sidebar-header">
                            <button className="nav-sidebar-header-toggle">
                                <div
                                    className="nav-sidebar-header-wrap"
                                    onClick={() => props.toggleSideBar(!props.sideBarOpen)}
                                >
                                    <Hamburger/>
                                </div>
                            </button>
                        </div>
                        <div className="nav-sidebar-wrapped-content hideScrollbar">
                            {data?.map((R) =>
                                    !R.is_sportbook && R.subcategories.length === 0 ? null : (
                                        <div
                                            key={R.id}
                                            className={`nav-sidebar-icon ${
                                                categorySlug === R.slug ? "active" : ""
                                            }`}
                                        >
                                            <div className="m-dropdown">
                                                <div className="m-dropdown-activator">
                        <span
                            onClick={() => navigate(`${R.slug}`)}
                            className="nav-sidebar-icon"
                        >
                          <img
                              width={28}
                              height={28}
                              src={config.baseUrl + "/storage/" + R.icon}
                              alt={R.name}
                          />
                        </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                            )}
                            <div className="m-dropdown divider-top">
                                <div className="m-dropdown-activator">
                                    <button
                                        onClick={() => console.log('chat')}
                                        className="nav-sidebar-support-wrapped nav-sidebar-icon"
                                    >
                                        <Support/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;
