import {Menu, UserCircle} from "lucide-react";
import CasinoIcon from "@/assets/icons/casino-icon.svg";
import AddNewUser from "@/assets/icons/add-new-user.svg";
import MessagesIcon from "@/assets/icons/messages-icon.svg";
import PaymentsIcon from "@/assets/icons/payments-icon.svg";
import BetHistoryIcon from "@/assets/icons/bet-history-icon.svg";
import UserSettingsIcon from "@/assets/icons/user-setting-icon.svg";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Search from "@/components/casino/search";

import React, {useEffect, useRef, useState} from "react";
import { useAppSelector } from "@/hooks/rtk";
import { useNavigate } from "react-router-dom";

import { useGetMainQuery } from "@/services/mainApi";
import { useLogoutMutation } from "@/services/authApi";

import config from "@/config";
import { cn } from "@/lib/utils";
import { Trans } from "@lingui/react/macro";
import type { Wallet, User } from "@/types/auth";
import { currencyList } from "@/utils/currencyList";
import Login from "@/components/shared/v2/login";
import SignUp from "@/components/shared/v2/signup";
import LanguageAccordion from "@/components/shared/v2/language-accordion.tsx";
import { DownloadIcon } from "lucide-react";
import logo from "@/assets/images/logo.svg";
import logoMobileSportbook from "@/assets/images/logo-mobile.svg";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import {Sheet, SheetContent, SheetHeader, SheetTrigger} from "@/components/ui/sheet.tsx";

type HeaderProps = {
  isDesktop: boolean;
  sideBarOpen: boolean;
  toggleSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  openOptionalSideBar: boolean;
  setOpenOptionalSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  location: string;
  isNoCategoryOrSportsbook: boolean;
};

export default function Header(props: HeaderProps) {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const isDesktop = useIsDesktop(1024);
  const [showPopupId, setShowPopupId] = useState<number | null>(null);
  const [popupTop, setPopupTop] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const defaultWallet: Wallet | undefined = user?.wallets.find(
    (w: Wallet) => w.default
  );


  useEffect(() => {
    const stored = localStorage.getItem("showBalance");
    if (stored !== null) setShowBalance(JSON.parse(stored));
  }, []);

  const toggleShowBalance = () => {
    const newValue = !showBalance;
    setShowBalance(newValue);
    localStorage.setItem("showBalance", JSON.stringify(newValue));
  };

  const headersTranslations: Record<string, any> = {
    "Sport": <Trans>Sport</Trans>,
    "Casino": <Trans>Casino</Trans>,
    "Vip Casino": <Trans>VIP Casino</Trans>,
    "Casino Live": <Trans>Casino Live</Trans>,
    "Crash Games": <Trans>Crash Games</Trans>,
    "Virtual": <Trans>Virtual</Trans>,
    "Lottery": <Trans>Lottery</Trans>,
  };

    const { data } = useGetMainQuery();

    type Category = {
        id: number;
        slug: string;
        name: string;
        icon: string;
        is_sportbook: boolean;
        subcategories: any[];
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, R: Category) => {
        // 1. Clear any existing timer
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }
        // 2. Hide any currently showing popup
        setShowPopupId(null);

        // 3. Calculate button position
        const rect = e.currentTarget.getBoundingClientRect();
        const newTop = rect.top - 50; // Button bottom + 10px offset

        // 4. Start timer for 1000ms (1 second)
        timerRef.current = window.setTimeout(() => {
            setShowPopupId(R.id);
            setPopupTop(newTop);
        }, 100);

        {
            const img = e.currentTarget.querySelector('img');
            if (img && props.location.split("/")[1] !== R.slug) {
                img.style.filter = "brightness(0%) invert(100%)";
            }
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, R: Category) => {
        // Immediately clear the timer and hide the popup
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }
        setShowPopupId(null);
        setPopupTop(null);

        {
            const img = e.currentTarget.querySelector('img');
            if (img && props.location.split("/")[1] !== R.slug) {
                img.style.filter = "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)";
            }
        }
    };

    const filterStyle = {
        // Default style (on leave)
        filter: isHovered
            ? "brightness(0%) invert(100%)" // Hover color: White
            : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)", // Default color
    };

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const sideMenuToggle = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

  return (
    <div className="sticky top-0 z-100 header-shadow h-15">
        <div className="sticky w-[calc(100%_-_60px)] ml-auto top-0 z-100 bg-[var(--grey-600)] h-15 px-[calc((100%_-_1260px)_/_2)]">
            <div className={cn("relative flex items-center mx-auto justify-between h-15")}>
                <div className={cn("flex items-center", {
                    "justify-start": !props.isNoCategoryOrSportsbook || isDesktop,
                    "w-12": props.isNoCategoryOrSportsbook && !isDesktop,
                })}>
                    {!props.isNoCategoryOrSportsbook || isDesktop ? (
                        <Button variant="ghost"
                                className="p-0 hover:bg-transparent"
                                onClick={() => props.toggleSideBar(true)}>
                            <img src={logo} alt="logo" className="h-[16px]" />
                        </Button>
                    ) : null}
                </div>

                {props.isNoCategoryOrSportsbook && !isDesktop && (
                    <div className="absolute left-1/2 top-1 -translate-x-1/2">
                        <img src={logoMobileSportbook}
                             alt="logo" className="h-[36px] mt-2"
                             onClick={() => props.setOpenOptionalSideBar(!props.openOptionalSideBar)}/>
                    </div>
                )}
                {/*<div className="hidden lg:flex items-center space-x-4">*/}
                {/*  {data?.map((R) =>*/}
                {/*    !R.is_sportbook && R.subcategories.length === 0 ? null : (*/}
                {/*      <Button key={R.id}*/}
                {/*        variant="ghost" className={cn(*/}
                {/*          "flex items-center rounded-none bg-transparent text-primary-foreground text-sm hover:text-primary-foreground hover:bg-transparent space-x-2 px-2 font-medium",*/}
                {/*          {*/}
                {/*            "text-card hover:text-card border-b border-b-card":*/}
                {/*              props.location.split("/")[1] === R.slug,*/}
                {/*          }*/}
                {/*        )} onClick={() => navigate(`/${R.slug}`)}>*/}
                {/*        <img className="h-5 w-5"*/}
                {/*          style={{*/}
                {/*            filter:*/}
                {/*              props.location.split("/")[1] === R.slug*/}
                {/*                ? "brightness(0%) invert(88%) sepia(79%) saturate(541%) hue-rotate(77deg) brightness(99%) contrast(117%)"*/}
                {/*                : "brightness(0%) invert(100%)",*/}
                {/*          }}*/}
                {/*          src={config.baseUrl + "/storage/" + R.icon}*/}
                {/*          alt={R.name}/>*/}
                {/*        {headersTranslations[R.name] ?? R.name}*/}
                {/*      </Button>*/}
                {/*    )*/}
                {/*  )}*/}
                {/*</div>*/}

                <div className="flex items-center space-x-2">
                    {
                        user && user.is_agent && <div className={'capitalize text-sm select-none'}>
                            {user.roles[0].name == "shop" ? <Trans>Shop</Trans> : user.roles[0].name}
                        </div>
                    }
                    {user ? (
                        <main className={cn("relative flex-col mx-2 w-full h-full", {
                            "mb-3 lg:mb-0": showBalance,
                            "mt-2": props.isNoCategoryOrSportsbook && !isDesktop,
                        })}>
                            <ProfileDropdown
                                user={user}
                                showBalance={showBalance}
                                toggleShowBalance={toggleShowBalance}
                                isNoCategoryOrSportsbook={props.isNoCategoryOrSportsbook}
                                isDesktop={isDesktop}/>


                            {user && defaultWallet && showBalance && (
                                <div className={cn(
                                    "absolute left-1/2 select-none translate-x-[-50%] h-1 items-center font-medium",
                                    {
                                        "text-[10px] -bottom-1":
                                            props.isNoCategoryOrSportsbook && !isDesktop,
                                        "text-xs": !(
                                            props.isNoCategoryOrSportsbook && !isDesktop
                                        ),
                                    }
                                )}>

                    <span>
                      {(+defaultWallet.balance / 100).toLocaleString("en-EN", {
                          minimumFractionDigits: defaultWallet.decimal_places,
                          maximumFractionDigits: defaultWallet.decimal_places,
                      })}
                    </span>
                                    <span className="">
                      {
                          currencyList[defaultWallet.slug.toUpperCase()]
                              ?.symbol_native
                      }
                    </span>
                                </div>
                            )}
                        </main>
                    ) : (
                        <section className="space-x-3">
                            <Button variant="secondary"
                                    className="bg-[var(--grey-400)] h-11 py-2.5 px-4.5 text-primary-foreground rounded-[0.5rem] font-semibold text-[15px] hover:bg-[var(--grey-300)] cursor-pointer"
                                    onClick={() => setLoginModalOpen(true)}>
                                <Trans>Login</Trans>
                            </Button>
                        </section>
                    )}
                </div>
            </div>

            <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
                <DialogContent showCloseButton={false}
                               overlayClassName={cn("mt-[44px] lg:mt-16", {
                                   "mt-[88px] lg:mt-16": props.openOptionalSideBar,
                               })} className={cn(
                    "p-0 lg:w-[450px] lg:top-16 top-[44px] translate-y-0 rounded-none bg-secondary",
                    {
                        "top-[88px] lg:top-[84px]": props.openOptionalSideBar,
                    }
                )} onOpenAutoFocus={(e) => e.preventDefault()}
                               onCloseAutoFocus={(e) => e.preventDefault()}>
                    <Login setLoginModalOpen={setLoginModalOpen} />
                </DialogContent>
            </Dialog>

            <Dialog open={signUpModalOpen} onOpenChange={setSignUpModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <SignUp />
                </DialogContent>
            </Dialog>

            <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
                <DialogContent className="overflow-auto w-full h-full">
                    <DialogHeader>
                        <DialogTitle>
                            <Trans>Search</Trans>
                        </DialogTitle>
                    </DialogHeader>
                    <Search onCloseSearchModal={() => setSearchModalOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
      <Sheet>
          <div className="md:fixed top-0 h-[calc(100%)] w-max bg-[var(--grey-700)] z-[900]">
              <SheetTrigger asChild>
                  <button className="w-15 relative t-0 -mb-2 aspect-[1/1] order-[-3] z-[901] rounded-[8px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2),0_4px_6px_-2px_rgba(0,0,0,0.1))]"
                          onClick={sideMenuToggle}>
                      <Menu className="m-auto w-5 h-5 transition-filter duration-200"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            style={filterStyle}/>
                  </button>
              </SheetTrigger>
              <div className={cn("h-[calc(100%_-_60px)] p-2 z-900 transition-all no-scrollbar overflow-x-auto flex items-center flex-col gap-[8px] container mx-auto duration-300 ease-in-out bg-[var(--grey-700)] top-15 w-15 data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left")}>
                  <div className="w-[calc(100%_-_16px)] h-0 border-t-[2px] border-t-[var(--grey-400)] mt-1.25 mb-1"></div>
                  {/*<div>*/}
                  {data?.map((R) =>
                      !R.is_sportbook && R.subcategories.length === 0 ? null : (
                          <Button key={R.id} variant="ghost" className={cn(
                              "flex w-11 h-11 relative items-center rounded-[6px] bg-transparent text-primary-foreground text-[11px] hover:text-primary-foreground hover:bg-[var(--grey-400)] px-2 font-medium",
                              {
                                  "text-card hover:text-card bg-[var(--grey-400)]": props.location.split("/")[1] === R.slug,
                                  "order-[-2]" : R.name === "Sport",
                                  "order-[-1]" : R.name === "Casino",
                              }
                          )}
                                  onMouseEnter={(e) => handleMouseEnter(e, R)}
                                  onMouseLeave={(e) => handleMouseLeave(e, R)}
                                  onClick={() => navigate(`/${R.slug}`)}>
                              <img className="h-5 w-5"
                                   style={{
                                       filter:
                                           props.location.split("/")[1] === R.slug
                                               ? "brightness(0%) invert(100%)"
                                               : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)",
                                   }}
                                   src={config.baseUrl + "/storage/" + R.icon}
                                   alt={R.name}/>
                              {showPopupId === R.id && popupTop !== null && (
                                  <div style={{ top: popupTop }} className="fixed left-0 whitespace-nowrap bg-white text-black text-[13px] font-normal py-3 px-4 rounded-[8px] shadow-xl shadow-[#0000004a] z-[1000] before:content-[''] before:absolute before:-translate-x-2/4 before:w-0 before:h-0 before:border-x-[6px] before:border-x-transparent before:border-t-[6px] before:border-t-[white] before:border-b-0 before:border-b-transparent before:border-solid before:left-7.5 before:bottom-[-6px]">
                                      {headersTranslations[R.name] ?? R.name}
                                  </div>
                              )}
                          </Button>
                      )
                  )}
              </div>
          </div>
          <SheetContent side="left" className={cn("h-full p-0 z-900 transition-all no-scrollbar overflow-x-auto flex items-center flex-col gap-[0] container mx-auto duration-300 ease-in-out bg-[var(--grey-700)] md:fixed w-[260px] data-[state=open]:duration-300 data-[state=closed]:duration-500 data-[state=open]:slide-out-to-left data-[state=closed]:slide-in-from-left"
              )} style={{ filter: "drop-shadow(0 0 5px rgba(25, 25, 25, 0.25))" }} overlayClassName="bg-[#0e1224b3]" closeClassName="hidden closeBtn">
              <SheetHeader className="flex flex-row gap-0 p-0 pr-4 h-15 shadow-lg">
                  <button className="w-15 relative aspect-[1/1] order-[-3]" onClick={() => (document.querySelector(".closeBtn") as HTMLElement)?.click()}>
                      <Menu className="m-auto w-5 h-5 transition-filter duration-200"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            style={filterStyle}/>
                  </button>
                  <div className="flex gap-2 my-auto">
                      {data?.map((R) =>
                          !R.is_sportbook && R.subcategories.length === 0  ? null : R.name !== "Sport" && R.name !== "Casino" ? null : (
                              <Button
                                  key={R.id}
                                  variant="ghost"
                                  className={cn("flex w-22 h-9 relative items-center rounded-[6px] bg-transparent text-primary-foreground text-[11px] hover:text-primary-foreground hover:bg-[var(--grey-400)] px-2 font-medium",
                                      {
                                          "text-card hover:text-card bg-[var(--grey-400)]": props.location.split("/")[1] === R.slug,
                                          "order-[-2]" : R.name === "Sport",
                                          "order-[-1]" : R.name === "Casino",
                                      }
                                  )}
                                  onMouseEnter={(e) => handleMouseEnter(e, R)}
                                  onMouseLeave={(e) => handleMouseLeave(e, R)}
                                  onClick={() => navigate(`/${R.slug}`)}>
                                  <img className="h-5 w-5"
                                       style={{
                                           filter:
                                               props.location.split("/")[1] === R.slug
                                                   ? "brightness(0%) invert(100%)"
                                                   : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)",
                                       }}
                                       src={config.baseUrl + "/storage/" + R.icon}
                                       alt={R.name}/>
                                  <span className="color-white">{R.name}</span>
                              </Button>
                          )
                      )}
                  </div>
              </SheetHeader>
              <div className="w-full p-4">
                  <div className="bg-[var(--grey-600)] rounded-[8px]">
                      {data?.map((R) =>
                          !R.is_sportbook && R.subcategories.length === 0 ? null : (R.name === "Sport" || R.name === "Casino") ? null : (
                              <Button
                                  key={R.id}
                                  variant="ghost"
                                  className={cn(
                                      "flex justify-start w-full h-12 relative rounded-[6px] bg-transparent text-primary-foreground text-md hover:text-primary-foreground hover:bg-[var(--grey-400)] px-4 py-3 font-medium",
                                      {
                                          "text-card hover:text-card bg-[var(--grey-400)]": props.location.split("/")[1] === R.slug,
                                      }
                                  )}
                                  onMouseEnter={(e) => handleMouseEnter(e, R)}
                                  onMouseLeave={(e) => handleMouseLeave(e, R)}
                                  onClick={() => navigate(`/${R.slug}`)}>
                                  <img className="h-5 w-5"
                                       style={{
                                           filter:
                                               props.location.split("/")[1] === R.slug
                                                   ? "brightness(0%) invert(100%)"
                                                   : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)",
                                       }}
                                       src={config.baseUrl + "/storage/" + R.icon}
                                       alt={R.name}/>
                                  <span className="text-white">
                                      {headersTranslations[R.name] ?? R.name}
                                  </span>
                              </Button>
                          )
                      )}
                  </div>

              </div>
          </SheetContent>
        {/*<div>*/}
        {/*    {data?.map((R) =>*/}
        {/*        !R.is_sportbook && R.subcategories.length === 0 ? null : (*/}
        {/*            <Button*/}
        {/*                key={R.id}*/}
        {/*                variant="ghost"*/}
        {/*                className={cn(*/}
        {/*                    "flex w-full px-2 h-11 relative items-center rounded-[6px] bg-transparent text-primary-foreground text-[11px] hover:text-primary-foreground hover:bg-[var(--grey-400)] px-2 font-medium",*/}
        {/*                    {*/}
        {/*                        "text-card hover:text-card bg-[var(--grey-400)]": props.location.split("/")[1] === R.slug,*/}
        {/*                        "order-[-2]" : R.name === "Sport",*/}
        {/*                        "order-[-1]" : R.name === "Casino",*/}
        {/*                    }*/}
        {/*                )}*/}
        {/*                onMouseEnter={(e) => handleMouseEnter(e, R)}*/}
        {/*                onMouseLeave={(e) => handleMouseLeave(e, R)}*/}
        {/*                onClick={() => navigate(`/${R.slug}`)}>*/}
        {/*                <img className="h-5 w-5"*/}
        {/*                     style={{*/}
        {/*                         filter:*/}
        {/*                             props.location.split("/")[1] === R.slug*/}
        {/*                                 ? "brightness(0%) invert(100%)"*/}
        {/*                                 : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)",*/}
        {/*                     }}*/}
        {/*                     src={config.baseUrl + "/storage/" + R.icon}*/}
        {/*                     alt={R.name}/>*/}
        {/*                {showPopupId === R.id && popupTop !== null && (*/}
        {/*                    <div style={{ top: popupTop }} className="fixed left-0 whitespace-nowrap bg-white text-black text-[13px] font-normal py-3 px-4 rounded-[8px] shadow-xl shadow-[#0000004a] z-[1000] before:content-[''] before:absolute before:-translate-x-2/4 before:w-0 before:h-0 before:border-x-[6px] before:border-x-transparent before:border-t-[6px] before:border-t-[white] before:border-b-0 before:border-b-transparent before:border-solid before:left-7.5 before:bottom-[-6px]">*/}
        {/*                    {headersTranslations[R.name] ?? R.name}*/}
        {/*                </div>*/}
        {/*                )}*/}
        {/*            </Button>*/}
        {/*        )*/}
        {/*    )}*/}
        {/*</div>*/}
      </Sheet>
      <div className="hidden md:data-[state=open]:fixed h-full w-[260px] flex items-center flex-col data-[state=open]:duration-300 data-[state=closed]:duration-500 data-[state=open]:slide-out-to-left data-[state=closed]:slide-in-from-left" data-state="open">
          <button className="w-15 relative -top-2 -mb-2 aspect-[1/1] order-[-3]" onClick={sideMenuToggle}>
              <Menu className="m-auto w-5 h-5 transition-filter duration-200"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={filterStyle}/>
          </button>
      </div>
    </div>
  );
}

const ProfileDropdown = ({
  user,
  showBalance,
  toggleShowBalance,
  isNoCategoryOrSportsbook,
  isDesktop,
}: {
  user: User;
  showBalance: boolean;
  toggleShowBalance: () => void;
  isNoCategoryOrSportsbook: boolean;
  isDesktop: boolean;
}) => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const menuItems = [{
      icon: CasinoIcon,
      label: <Trans>Casino</Trans>,
      path: user.is_agent ? "/account/casino" : "/account/casino",
      show: !user.is_agent,
    }, {
      icon: BetHistoryIcon,
      label: <Trans>Bets</Trans>,
      path: user.is_agent ? "/account/tickets" : "/account/bets",
      show: true,
    }, {
      icon: AddNewUser,
      label: <Trans>Add New User</Trans>,
      path: "/account/users/create",
      show: user.is_agent,
    }, {
      icon: UserSettingsIcon,
      label: <Trans>Users</Trans>,
      path: "/account/users",
      show: user.is_agent,
    }, {
      icon: PaymentsIcon,
      label: <Trans>Wallet</Trans>,
      path: "/account/wallet",
      show: true,
    }, {
      icon: MessagesIcon,
      label: <Trans>Reports</Trans>,
      path: "/account/reports",
      show: user.is_agent,
    }, {
      icon: PaymentsIcon,
      label: <Trans>Payments</Trans>,
      path: user.is_agent ? "/account/agent/payments" : "/account/payments",
      show: true,
    },
  ];

  const defaultWallet = user.wallets.filter(
    (singleWallet) => singleWallet.default === 1
  );
  const otherWallets = user.wallets.filter(
    (singleWallet) => singleWallet.default !== 1
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserCircle className="w-full stroke-[1px] text-card h-full" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={
          isNoCategoryOrSportsbook && !isDesktop
            ? showBalance
              ? -4
              : -10
            : showBalance
            ? 10
            : 5
        }
        className="lg:w-96 w-screen min-w-90 max-[380px]:min-w-full mt-4 p-0 bg-white rounded-none"
        align="end"
        forceMount
      >
        <div className="flex flex-col w-full h-full px-2 pt-2">
          <DropdownMenuLabel className="font-normal">
            <p className="text-xs font-medium leading-none">{user?.name}</p>
          </DropdownMenuLabel>
          <div className="flex flex-col items-start gap-y-2 justify-between gap-x-4 w-full space-y-1 py-2">
            <div className={
                "flex flex-row h-full items-center  w-full justify-between"
              }>
              <div className={"h-full"}>
                {defaultWallet?.map((w: Wallet) => (
                  <div key={w.slug} className="w-fit h-full">
                    <p className={
                        "h-[14px] flex items-center justify-start w-full truncate text-[11px]"
                      }>
                      {w.name}
                    </p>
                    <span className="text-xl font-semibold">
                      {(Number(w.balance) / 100).toLocaleString("en-EN", {
                        minimumFractionDigits: w.decimal_places,
                        maximumFractionDigits: w.decimal_places,
                      })}
                    </span>
                    <span className="font-bold">
                      {currencyList[w.slug.toUpperCase()]?.symbol_native}
                    </span>
                  </div>
                ))}
              </div>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/account/wallet");
                }} className={
                  "border py-0 px-2 text-base rounded-none bg-transparent focus:bg-transparent h-11  flex"
                }>
                    <DownloadIcon className={"text-background  size-5"} />
                    <Trans>Deposit</Trans>
              </DropdownMenuItem>
            </div>
            <div className={"flex flex-row items-center justify-between w-full"}>
              {otherWallets?.map((w: Wallet) => (
                <div key={w.slug} className="w-fit">
                  <p
                    className={
                      "h-[14px] flex items-center justify-start w-full truncate text-[11px]"
                    }>
                    {w.name}
                  </p>
                  <span className="text-xl font-semibold">
                    {(Number(w.balance) / 100).toLocaleString("en-EN", {
                      minimumFractionDigits: w.decimal_places,
                      maximumFractionDigits: w.decimal_places,
                    })}
                  </span>
                  <span className="font-bold">
                    {currencyList[w.slug.toUpperCase()]?.symbol_native}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <DropdownMenuSeparator className="py-0 my-0" />
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="rounded-none w-full py-0 h-14">
            <TabsTrigger value="profile"
              className=" cursor-pointer data-[state=active]:border-b-card data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold text-sm font-light rounded-none">
              <Trans>Profile</Trans>
            </TabsTrigger>
            <TabsTrigger value="preferences"
              className="cursor-pointer data-[state=active]:border-b-card data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold text-sm font-light rounded-none">
              <Trans>Preferences</Trans>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-3 gap-3 px-2 py-4">
              {menuItems.map((item, i) => {
                if (item.show) {
                  return (
                    <DropdownMenuItem key={i}
                      className="flex flex-col focus:bg-transparent cursor-pointer justify-end"
                      onClick={() => navigate(item.path)}>
                      <img src={item.icon} alt={item.path} className={'size-9'}/>
                      <span className="text-xs">{item.label}</span>
                    </DropdownMenuItem>
                  );
                }
              })}{" "}
            </div>
            <DropdownMenuItem
              className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/70 hover:bg-black/10"
              onClick={() => navigate("/account/general")}>
              <Trans>Profile</Trans>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/70 hover:bg-black/10"
              onClick={() => navigate("/account/notifications")}>
              <Trans>Messages</Trans>
            </DropdownMenuItem>

              <DropdownMenuItem
                  className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/70 hover:bg-black/10"
                  onClick={() => navigate("/")}>
                  <Trans>Responsible Gambling</Trans>
              </DropdownMenuItem>

            <DropdownMenuItem
              className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/70 hover:bg-black/10"
              onClick={() => navigate("/account/change-password")}>
              <Trans>Password</Trans>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="w-full border-t rounded-none px-2 py-2 cursor-pointer hover:bg-black/10 text-black/70"
              onClick={() => logout()}>
              <Trans>Log out</Trans>
            </DropdownMenuItem>
          </TabsContent>

          <TabsContent value="preferences">
            <LanguageAccordion />
            <div className="flex h-14 items-center justify-between border-t border-[#f8f9fa]/40 px-2">
              <p className="text-xs font-medium text-black">
                <Trans>Show Balance</Trans>
              </p>
              <button onClick={toggleShowBalance}
                className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                  showBalance ? "bg-card" : "bg-gray-300"
                }`}>
                <span className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    showBalance ? "translate-x-5" : "translate-x-1"
                  }`}/>
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
