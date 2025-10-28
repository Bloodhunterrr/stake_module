// components/header/HeaderTop.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trans } from "@lingui/react/macro";
import ProfileDropdown from "./ProfileDropdown";
import type {User} from "@/types/auth";
import logoMobileSportbook from "@/assets/images/logo-mobile.svg";
import logo from "@/assets/images/logo.svg";

interface HeaderTopProps {
    isNoCategoryOrSportsbook: boolean;
    isDesktop: boolean;
    openOptionalSideBar: boolean;
    setOpenOptionalSideBar: (value: boolean) => void;
    user?: User;
    setLoginModalOpen: (value: boolean) => void;
    showBalance: boolean;
    toggleShowBalance: () => void;
}

export default function HeaderTop({
                                      isNoCategoryOrSportsbook,
                                      isDesktop,
                                      openOptionalSideBar,
                                      setOpenOptionalSideBar,
                                      user,
                                      setLoginModalOpen,
                                      showBalance,
                                      toggleShowBalance
                                  }: HeaderTopProps) {
    return (
        <div className="sticky w-[calc(100%_-_60px)] max-md:w-full ml-auto top-0 z-100 bg-[var(--navbar-bg)] h-15 min-[1024px]:px-[3vw] min-[1440px]:px-[calc((100%_-_1260px)_/_2)]">
            <div className={cn("relative flex items-center mx-auto justify-between h-15 px-[10px] max-md:px-[3vw]")}>
                <div className={cn("flex items-center", {
                    "justify-start": !isNoCategoryOrSportsbook || isDesktop,
                    "w-12": isNoCategoryOrSportsbook && !isDesktop,
                })}>
                    {!isNoCategoryOrSportsbook || isDesktop ? (
                        <Button variant="ghost" className="p-0 hover:bg-transparent" asChild>
                            <Link to="/">
                                <img src={logo} alt="logo" className="h-[16px]" />
                            </Link>
                        </Button>
                    ) : null}
                </div>

                {isNoCategoryOrSportsbook && !isDesktop && (
                    <div className="absolute left-1/2 top-1 -tranFslate-x-1/2">
                        <img src={logoMobileSportbook}
                            alt="logo"
                            className="h-[36px] mt-2"
                            onClick={() => setOpenOptionalSideBar(!openOptionalSideBar)}/>
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    {user && user.is_agent && (
                        <div className="capitalize text-sm select-none">
                            {user.roles[0].name == "shop" ? <Trans>Shop</Trans> : user.roles[0].name}
                        </div>
                    )}
                    {user ? (
                        <ProfileDropdown
                            user={user}
                            isNoCategoryOrSportsbook={isNoCategoryOrSportsbook}
                            isDesktop={isDesktop}
                            showBalance={showBalance}
                            toggleShowBalance={toggleShowBalance} />
                    ) : (
                        <section className="space-x-3">
                            <Button variant="secondary" onClick={() => setLoginModalOpen(true)}
                                className="bg-[var(--navbar-login)] h-11 py-2.5 px-4.5 text-[var(--navbar-text)]
                                rounded-[0.5rem] font-semibold text-[15px] hover:bg-[var(--navbar-login-hover)] cursor-pointer">
                                <Trans>Login</Trans>
                            </Button>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}