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

import Login from "../login";
import SignUp from "../signup";
import Search from "@/components/casino/search";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/rtk";
import { useNavigate } from "react-router-dom";

import { useGetMainQuery } from "@/services/mainApi";
import { useLogoutMutation } from "@/services/authApi";

import config from "@/config";
import { cn } from "@/lib/utils";
import { Trans } from "@lingui/react/macro";
import type { Wallet, User } from "@/types/auth";
import { currencyList } from "@/utils/currencyList";

const logo = "https://hayaspin.com/static/media/logo.eb0ca820ea802ba28dd2.svg";

type NavBarProps = {
  isDesktop: boolean;
  sideBarOpen: boolean;
  toggleSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  openOptionalSideBar: boolean;
  setOpenOptionalSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  location: string;
};

const NavBar = (props: NavBarProps) => {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

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

  const { data } = useGetMainQuery();
  return (
      <div className="sticky top-0 z-50 bg-background">
        <div className={cn("h-0 transition-all w-full no-scrollbar overflow-x-auto flex items-center flex-row container mx-auto duration-300 ease-in-out",
            { "h-11 lg:h-0 opacity-100 px-2 w-full": props.openOptionalSideBar }
        )}>
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
                    <Trans>{R.name}</Trans>
                  </Button>
              )
          )}
        </div>

        <div style={{ backgroundImage: "linear-gradient(#005641,#222 165px)" }} className="sticky top-0 z-50 px-3">
          <div className="flex items-center container mx-auto justify-between h-16">
            <div>
              {!props.sideBarOpen && (
                  <Button
                      variant="ghost"
                      className="p-0 hover:bg-transparent"
                      onClick={() =>
                          props.setOpenOptionalSideBar(!props.openOptionalSideBar)
                      }
                  >
                    <img className="h-8" src={logo} alt="logo" />
                  </Button>
              )}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
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
                          )} onClick={() => navigate(`/${R.slug}`)}>
                        <img
                            className="h-5 w-5"
                            style={{
                              filter:
                                  props.location.split("/")[1] === R.slug
                                      ? "grayscale(100%) brightness(70%) sepia(100%) hue-rotate(110deg) saturate(200%)"
                                      : "",
                            }}
                            src={config.baseUrl + "/storage/" + R.icon}
                            alt={R.name}
                        />
                        <Trans>{R.name}</Trans>
                      </Button>
                  )
              )}
            </div>

            <div className="flex items-center space-x-2">
              {user ? (
                  <main className="relative flex-col w-full h-full">
                    <ProfileDropdown
                        user={user}
                        showBalance={showBalance}
                        toggleShowBalance={toggleShowBalance}
                    />

                    {user && defaultWallet && showBalance && (
                        <div className="flex absolute -bottom-2.5 -right-1/2 -translate-x-0.5 h-1 items-center text-xs font-medium">
                    <span>
                      {(+defaultWallet.balance / 100).toLocaleString("en-EN", {
                        minimumFractionDigits: defaultWallet.decimal_places,
                        maximumFractionDigits: defaultWallet.decimal_places,
                      })}
                    </span>
                          <span className="font-bold">
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
                            className="bg-[#101114] hover:bg-[#525766] items-center shadow-[inset_0_0_0_1px_#454956] hover:shadow-none w-[70px] h-8 text-xs text-white cursor-pointer flex justify-center relative no-underline transition-all duration-150 ease-in-out rounded-2xl border-none"  onClick={() => setLoginModalOpen(true)}>
                      <Trans>Log in</Trans>
                    </Button>
                  </section>
              )}
            </div>
          </div>

          <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
            <DialogContent className="p-0 lg:w-[450px] rounded-none bg-secondary"  
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
      </div>
  );
};

export default NavBar;

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
    { icon: CasinoIcon, label: <Trans>Casino</Trans>, path: "/account/casino" },
    { icon: BetHistoryIcon, label: <Trans>Bets</Trans>, path: "/account/bets" },
    {
      icon: PaymentsIcon,
      label: <Trans>Payments</Trans>,
      path: "/account/payments",
    },
    {
      icon: UserSettingsIcon,
      label: <Trans>Profile</Trans>,
      path: "/account/general",
    },
    {
      icon: ChangePasswordIcon,
      label: <Trans>Password</Trans>,
      path: "/account/change-password",
    },
    {
      icon: MessagesIcon,
      label: <Trans>Messages</Trans>,
      path: "/notifications",
    },
  ];

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserCircle className="w-full stroke-[1px] text-card h-full" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-96 mt-4 p-0 bg-white rounded-none" align="end" forceMount >
          <div className="flex flex-col w-full h-full px-2 py-2">
            <DropdownMenuLabel className="font-normal">
              <p className="text-xs font-medium leading-none">{user?.name}</p>
            </DropdownMenuLabel>

            <div className="flex flex-row items-center justify-between gap-x-4 w-full space-y-1 py-2">
              {user.wallets?.map((w: Wallet) => (
                  <div key={w.slug} className="w-fit">
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

            <DropdownMenuSeparator className="py-0 my-0" />
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="rounded-none w-full py-0 h-14">
              <TabsTrigger
                  value="profile"
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
                {menuItems.map((item, i) => (
                    <DropdownMenuItem
                        key={i}
                        className="flex flex-col focus:bg-transparent cursor-pointer justify-end"
                        onClick={() => navigate(item.path)}>
                      <img src={item.icon} alt={item.path} />
                      <span className="text-xs">
                   {item.label}
                  </span>
                    </DropdownMenuItem>
                ))}{" "}
              </div>

              <DropdownMenuItem
                  className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/40 hover:text-black/70"
                  onClick={() => navigate("/account/wallet")}
              >
                <Trans>Wallet</Trans>
              </DropdownMenuItem>

              <DropdownMenuItem
                  className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/40 hover:text-black/70"
                  onClick={() => logout()}
              >
                <Trans>Log out</Trans>
              </DropdownMenuItem>
            </TabsContent>

            <TabsContent value="preferences">
              <div className="flex h-14 items-center justify-between border-t border-[#f8f9fa]/40 px-2">
                <p className="text-xs font-medium text-black"><Trans>Show Balance</Trans></p>
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