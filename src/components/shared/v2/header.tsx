import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Search from "@/components/casino/search";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/hooks/rtk";
import { Link } from "react-router-dom";
import { useGetMainQuery } from "@/services/mainApi";
import { cn } from "@/lib/utils";
import { Trans } from "@lingui/react/macro";
import type { Wallet } from "@/types/auth";
import { currencyList } from "@/utils/currencyList";
import Login from "@/components/shared/v2/login";
import SignUp from "@/components/shared/v2/signup";
import logo from "@/assets/images/logo.svg";
import logoMobileSportbook from "@/assets/images/logo-mobile.svg";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import ProfileDropdown from "@/components/header/ProfileDropdown";
import Sidebar from "@/components/header/Sidebar";
import type { HeaderProps, Category } from "@/types/header";
import NavbarMobile from "@/components/navbar/NavbarMobile.tsx";

export default function Header(props: HeaderProps) {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [signUpModalOpen, setSignUpModalOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const isDesktop = useIsDesktop(1024);
    const [showPopupId, setShowPopupId] = useState<number | null>(null);
    const [popupTop, setPopupTop] = useState<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showBalance, setShowBalance] = useState<boolean>(true);
    const [accordionValue, setAccordionValue] = useState<string>("");

    const user = useAppSelector((state) => state.auth.user);
    const defaultWallet: Wallet | undefined = user?.wallets.find((w: Wallet) => w.default);

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
        Sport: <Trans>Sport</Trans>,
        Casino: <Trans>Casino</Trans>,
        "Vip Casino": <Trans>VIP Casino</Trans>,
        "Casino Live": <Trans>Casino Live</Trans>,
        "Crash Games": <Trans>Crash Games</Trans>,
        Virtual: <Trans>Virtual</Trans>,
        Lottery: <Trans>Lottery</Trans>,
    };

    const { data } = useGetMainQuery();

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, R: Category) => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }
        setShowPopupId(null);
        const rect = e.currentTarget.getBoundingClientRect();
        const newTop = rect.top - 55;
        timerRef.current = window.setTimeout(() => {
            setShowPopupId(R.id);
            setPopupTop(newTop);
        }, 50);
        const img = e.currentTarget.querySelector("img.h-5.w-5.z-\\[2\\]") as HTMLImageElement | null;
        if (img && props.location.split("/")[1] !== R.slug) {
            img.style.filter = "brightness(0%) invert(100%)";
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, R: Category) => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }
        setShowPopupId(null);
        setPopupTop(null);
        const img = e.currentTarget.querySelector("img.h-5.w-5.z-\\[2\\]") as HTMLImageElement | null;
        if (img && props.location.split("/")[1] !== R.slug) {
            img.style.filter = "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)";
        }
    };

    const filterStyle = { filter: isHovered
        ? "brightness(0%) invert(100%)"
        : "brightness(0%) invert(77%) sepia(26%) saturate(212%) hue-rotate(186deg) brightness(95%) contrast(84%)",
    };

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <div className="sticky top-0 z-100 header-shadow h-15">
            <div className="sticky w-[calc(100%_-_60px)] max-md:w-full ml-auto top-0 z-100 bg-[var(--navbar-bg)] h-15 px-[3vw] min-[1440px]:px-[calc((100%_-_1320px)_/_2)]">
                <div className={cn("relative flex items-center mx-auto justify-between h-15 min-[1440px]:pr-[60px]")}>
                    <div className={cn("flex items-center", {
                            "justify-start": !props.isNoCategoryOrSportsbook || isDesktop,
                            "w-12": props.isNoCategoryOrSportsbook && !isDesktop,
                        })}>
                        {!props.isNoCategoryOrSportsbook || isDesktop ? (
                            <Button variant="ghost" className="p-0 lg:hover:bg-transparent" asChild>
                                <Link to="/">
                                    <img src={logo} alt="logo" className="h-[16px]" />
                                </Link>
                            </Button>
                        ) : null}
                    </div>

                    {props.isNoCategoryOrSportsbook && !isDesktop && (
                        <div className="absolute left-0 top-1 ">
                            <img src={logoMobileSportbook} alt="logo" className="h-[36px] mt-2"
                                onClick={() => props.setOpenOptionalSideBar(!props.openOptionalSideBar)}/>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        {user && user.is_agent && (
                            <div className="capitalize text-sm select-none">
                                {user.roles[0].name === "shop" ? <Trans>Shop</Trans> : user.roles[0].name}
                            </div>
                        )}
                        {user ? (
                            <main className={cn("relative flex-col mx-2 w-full h-full", {
                                    "mb-3 lg:mb-0": showBalance,
                                    "mt-2": props.isNoCategoryOrSportsbook && !isDesktop,
                                })}>
                                <ProfileDropdown user={user}
                                    showBalance={showBalance}
                                    toggleShowBalance={toggleShowBalance}
                                    isNoCategoryOrSportsbook={props.isNoCategoryOrSportsbook}
                                    isDesktop={isDesktop}/>

                                {user && defaultWallet && showBalance && (
                                    <div className={cn("absolute left-1/2 select-none translate-x-[-50%] h-1 items-center font-medium",
                                        {
                                            "text-[10px] -bottom-1": props.isNoCategoryOrSportsbook && !isDesktop,
                                            "text-xs": !(props.isNoCategoryOrSportsbook && !isDesktop),
                                        }
                                    )}>
                                        <span>
                                            {(+defaultWallet.balance / 100).toLocaleString("en-EN", {
                                                minimumFractionDigits: defaultWallet.decimal_places,
                                                maximumFractionDigits: defaultWallet.decimal_places,
                                            })}
                                        </span>
                                        <span className="">
                                            {currencyList[defaultWallet.slug.toUpperCase()]?.symbol_native}
                                        </span>
                                    </div>
                                )}
                            </main>
                        ) : (
                            <section className="space-x-3">
                                <Button variant="secondary"
                                    className="bg-[var(--navbar-login)] h-11 py-2.5 px-4.5 text-[var(--navbar-text)] rounded-[0.5rem] font-semibold text-[15px] lg:hover:bg-[var(--navbar-login-hover)] cursor-pointer"
                                    onClick={() => setLoginModalOpen(true)}>
                                    <Trans>Login</Trans>
                                </Button>
                            </section>
                        )}
                    </div>
                </div>

                <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
                    <DialogContent showCloseButton={false}
                        overlayClassName={cn("bg-black/75 mt-[44px] lg:mt-15", {
                            "mt-[88px] lg:mt-15": props.openOptionalSideBar,
                        })} className={cn(
                            "rounded-md bg-cover border-transparent bg-center fixed w-full min-w-[200px] flex flex-col overflow-hidden max-w-[630px] sm:max-w-[630px] h-full max-h-[716px] p-0 -translate-x-1/2 top-1/2 left-1/2"
                        )}
                        onOpenAutoFocus={(e) => e.preventDefault()}
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
            <Sidebar data={data}
                location={props.location}
                isHovered={isHovered}
                setIsHovered={setIsHovered}
                filterStyle={filterStyle}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                showPopupId={showPopupId}
                popupTop={popupTop}
                headersTranslations={headersTranslations}
                accordionValue={accordionValue}
                setAccordionValue={setAccordionValue}/>
            <NavbarMobile data={data}
                          location={props.location}
                          isHovered={isHovered}
                          setIsHovered={setIsHovered}
                          filterStyle={filterStyle}
                          handleMouseEnter={handleMouseEnter}
                          handleMouseLeave={handleMouseLeave}
                          showPopupId={showPopupId}
                          popupTop={popupTop}
                          headersTranslations={headersTranslations}
                          accordionValue={accordionValue}
                          setAccordionValue={setAccordionValue}/>
        </div>
    );
}