import { UserCircle } from "lucide-react";
import CasinoIcon from "@/assets/icons/casino-icon.svg";
import MessagesIcon from "@/assets/icons/messages-icon.svg";
import PaymentsIcon from "@/assets/icons/payments-icon.svg";
import BetHistoryIcon from "@/assets/icons/bet-history-icon.svg";
import ChangePasswordIcon from "@/assets/icons/password-icon.svg";
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

import React, { useEffect, useState } from "react";
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

  const user = useAppSelector((state) => state.auth.user);
  const defaultWallet: Wallet | undefined = user?.wallets.find(
    (w: Wallet) => w.default
  );

  const [showBalance, setShowBalance] = useState<boolean>(true);
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
    "Vip Casino": <Trans>VIP Casino</Trans>,
    Casino: <Trans>Casino</Trans>,
    "Casino Live": <Trans>Casino Live</Trans>,
    "Crash Games": <Trans>Crash Games</Trans>,
    Virtual: <Trans>Virtual</Trans>,
    Lottery: <Trans>Lottery</Trans>,
  };

  const { data } = useGetMainQuery();

  return (
    <div className="sticky top-0 z-50">
      <div
        className={cn(
          "h-0 transition-all w-full no-scrollbar overflow-x-auto flex items-center flex-row container mx-auto duration-300 ease-in-out",
          {
            "h-11 xl:h-0 opacity-100 px-2 w-full bg-background":
              props.openOptionalSideBar && !props.isNoCategoryOrSportsbook,
            "h-8 xl:h-0 opacity-100 px-2 w-full ":
              props.openOptionalSideBar && props.isNoCategoryOrSportsbook,
          }
        )}
      >
        {data?.map((R) =>
          !R.is_sportbook && R.subcategories.length === 0 ? null : (
            <Button
              key={R.id}
              variant="ghost"
              className={cn(
                "flex items-center rounded-none bg-transparent text-primary-foreground text-[11px] hover:text-primary-foreground hover:bg-transparent space-x-2 px-2 font-medium",
                {
                  "text-card hover:text-card border-b border-b-card":
                    props.location.split("/")[1] === R.slug,
                }
              )}
              onClick={() => navigate(`/${R.slug}`)}
            >
              {headersTranslations[R.name] ?? R.name}
            </Button>
          )
        )}
      </div>

      <div
        style={
          props.isNoCategoryOrSportsbook && !isDesktop
            ? {
                backgroundColor: "#126E51",
              }
            : {
                backgroundImage: "linear-gradient(#005641,#222 165px)",
              }
        }
        className="sticky top-0 z-50 px-3"
      >
        <div
          className={cn(
            "relative flex items-center container mx-auto justify-between h-16",
            { "h-11 lg:h-16": props.isNoCategoryOrSportsbook }
          )}
        >
          <div
            className={cn("flex items-center", {
              "justify-start": !props.isNoCategoryOrSportsbook || isDesktop,
              "w-12": props.isNoCategoryOrSportsbook && !isDesktop, 
            })}
          >
            {!props.isNoCategoryOrSportsbook || isDesktop ? (
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent"
                onClick={() =>
                  props.setOpenOptionalSideBar(!props.openOptionalSideBar)
                }
              >
                <img src={logo} alt="logo" className="h-[16px]" />
              </Button>
            ) : null}
          </div>

          {props.isNoCategoryOrSportsbook && !isDesktop && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <img
                src={logoMobileSportbook}
                alt="logo"
                className="h-[36px] mt-2"
                  onClick={() =>
                  props.toggleSideBar(true)
                }
              />
            </div>
          )}
          <div className="hidden xl:flex items-center space-x-4">
            {data?.map((R) =>
              !R.is_sportbook && R.subcategories.length === 0 ? null : (
                <Button
                  key={R.id}
                  variant="ghost"
                  className={cn(
                    "flex items-center rounded-none bg-transparent text-primary-foreground text-sm hover:text-primary-foreground hover:bg-transparent space-x-2 px-2 font-medium",
                    {
                      "text-card hover:text-card border-b border-b-card":
                        props.location.split("/")[1] === R.slug,
                    }
                  )}
                  onClick={() => navigate(`/${R.slug}`)}
                >
                  <img
                    className="h-5 w-5"
                    style={{
                      filter:
                        props.location.split("/")[1] === R.slug
                          ? "brightness(0%) invert(88%) sepia(79%) saturate(541%) hue-rotate(77deg) brightness(99%) contrast(117%)"
                          : "brightness(0%) invert(100%)",
                    }}
                    src={config.baseUrl + "/storage/" + R.icon}
                    alt={R.name}
                  />
                  {headersTranslations[R.name] ?? R.name}
                </Button>
              )
            )}
          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <main
                className={cn("relative flex-col mx-2 w-full h-full", {
                  "mb-3 lg:mb-0": showBalance,
                  "mt-2": props.isNoCategoryOrSportsbook && !isDesktop,
                })}
              >
                <ProfileDropdown
                  user={user}
                  showBalance={showBalance}
                  toggleShowBalance={toggleShowBalance}
                />

                {user && defaultWallet && showBalance && (
                  <div
                    className={cn(
                      "absolute left-1/2 select-none translate-x-[-50%] h-1 items-center font-medium",
                      {
                        "text-[10px] -bottom-1":
                          props.isNoCategoryOrSportsbook && !isDesktop,
                        "text-xs": !(
                          props.isNoCategoryOrSportsbook && !isDesktop
                        ),
                      }
                    )}
                  >
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
                <Button
                  variant="secondary"
                  className="bg-transparent px-2.5 border-card/30 border-[1px] hover:border-card text-primary-foreground hover:text-card rounded-full font-semibold text-[11px] hover:bg-transparent cursor-pointer"
                  onClick={() => setLoginModalOpen(true)}
                >
                  <Trans>Log in</Trans>
                </Button>
              </section>
            )}
          </div>
        </div>

        <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
          <DialogContent
            showCloseButton={false}
            overlayClassName={cn("mt-16", {
              "mt-[110px] lg:mt-16": props.openOptionalSideBar,
            })}
            className={cn(
              "p-0 lg:w-[450px]  top-[64px] translate-y-0 rounded-none bg-secondary",
              {
                "top-[110px] lg:top-[64px]": props.openOptionalSideBar,
              }
            )}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
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
    </div>
  );
}

const ProfileDropdown = ({
  user,
  showBalance,
  toggleShowBalance,
}: {
  user: User;
  showBalance: boolean;
  toggleShowBalance: () => void;
}) => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: CasinoIcon,
      label: <Trans>Casino</Trans>,
      path: user.is_agent ? "/account/casino" : "/account/casino",
      show: true,
    },
    {
      icon: BetHistoryIcon,
      label: <Trans>Bets</Trans>,
      path: user.is_agent ? "/account/bets" : "/account/bets",
      show: true,
    },
    {
      icon: PaymentsIcon,
      label: <Trans>Payments</Trans>,
      path: "/account/payments",
      show: true,
    },
    {
      icon: UserSettingsIcon,
      label: <Trans>Users</Trans>,
      path: "/account/users",
      show: user.is_agent,
    },
    {
      icon: ChangePasswordIcon,
      label: <Trans>Password</Trans>,
      path: "/account/change-password",
      show: true,
    },
    {
      icon: MessagesIcon,
      label: <Trans>Messages</Trans>,
      path: "/account/notifications",
      show: true,
    },
    {
      icon: MessagesIcon,
      label: <Trans>Reports</Trans>,
      path: "/account/users/reports",
      show: user.is_agent,
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
        sideOffset={showBalance ? 10 : 5}
        className="lg:w-96  w-screen min-w-90 mt-4 p-0 bg-white rounded-none"
        align="end"
        forceMount
      >
        <div className="flex flex-col w-full h-full px-2 py-2">
          <DropdownMenuLabel className="font-normal">
            <p className="text-xs font-medium leading-none">{user?.name}</p>
          </DropdownMenuLabel>
          <div className="flex flex-col items-start gap-y-2 justify-between gap-x-4 w-full space-y-1 py-2">
            <div
              className={
                "flex flex-row h-full items-center  w-full justify-between"
              }
            >
              <div className={"h-full"}>
                {defaultWallet?.map((w: Wallet) => (
                  <div key={w.slug} className="w-fit h-full">
                    <p
                      className={
                        "h-[14px] flex items-center justify-start w-full truncate text-[11px]"
                      }
                    >
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
                }}
                className={
                  "border py-0 px-2 text-base rounded-none bg-transparent focus:bg-transparent h-11  flex"
                }
              >
                <DownloadIcon className={"text-background  size-5"} />
                Deposit
              </DropdownMenuItem>
            </div>
            <div
              className={"flex flex-row items-center justify-between w-full"}
            >
              {otherWallets?.map((w: Wallet) => (
                <div key={w.slug} className="w-fit">
                  <p
                    className={
                      "h-[14px] flex items-center justify-start w-full truncate text-[11px]"
                    }
                  >
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
            <TabsTrigger
              value="profile"
              className=" cursor-pointer data-[state=active]:border-b-card data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold text-sm font-light rounded-none"
            >
              <Trans>Profile</Trans>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="cursor-pointer data-[state=active]:border-b-card data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold text-sm font-light rounded-none"
            >
              <Trans>Preferences</Trans>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-3 gap-3 px-2 py-4">
              {menuItems.map((item, i) => {
                if (item.show) {
                  return (
                    <DropdownMenuItem
                      key={i}
                      className="flex flex-col focus:bg-transparent cursor-pointer justify-end"
                      onClick={() => navigate(item.path)}
                    >
                      <img src={item.icon} alt={item.path} />
                      <span className="text-xs">{item.label}</span>
                    </DropdownMenuItem>
                  );
                }
              })}{" "}
            </div>
            <DropdownMenuItem
              className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/70 hover:bg-black/10"
              onClick={() => navigate("/account/general")}
            >
              <Trans>Profile</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/70 hover:bg-black/10"
              onClick={() => navigate("/account/wallet")}
            >
              <Trans>Wallet</Trans>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="w-full border-t rounded-none px-2 py-2 cursor-pointer hover:bg-black/10 text-black/70"
              onClick={() => logout()}
            >
              <Trans>Log out</Trans>
            </DropdownMenuItem>
          </TabsContent>

          <TabsContent value="preferences">
            <LanguageAccordion />
            <div className="flex h-14 items-center justify-between border-t border-[#f8f9fa]/40 px-2">
              <p className="text-xs font-medium text-black">
                <Trans>Show Balance</Trans>
              </p>
              <button
                onClick={toggleShowBalance}
                className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                  showBalance ? "bg-card" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    showBalance ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
