import {
  // Sun,
  // Moon,
  // LogOut,
  // Search as SearchIcon,
  Bell,
  Dice6,
  UserIcon,
  CreditCard,
  UserCircle,
  WalletIcon,
  LockKeyhole,
  ClipboardClock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog.tsx";

import Login from "../login";
import SignUp from "../signup";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppSelector } from "@/hooks/rtk.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import type { Wallet, User } from "@/types/auth.ts";
import { currencyList } from "@/utils/currencyList.ts";
import Search from "@/components/casino/search.tsx";
import { useLogoutMutation } from "@/services/authApi.ts";
import { useGetMainQuery } from "@/services/mainApi.ts";
import config from "@/config.ts";
import {cn} from "@/lib/utils.ts";
import { Trans } from "@lingui/react/macro";

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
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.user);
  const defaultWallet: Wallet | undefined = user?.wallets.find(
      (w: Wallet) => w.default
  );

  // const { theme, toggleTheme } = useTheme();
  const { data } = useGetMainQuery();
  return (
      <div className={'sticky top-0  z-50 bg-background'}>
        <div className={cn("h-0 transition-all w-full no-scrollbar overflow-x-auto flex items-center flex-row container mx-auto duration-300 ease-in-out", {
          "h-11 lg:h-0 opacity-100  px-2 w-full": props.openOptionalSideBar,
        })}>
          {data?.map((R) =>
              !R.is_sportbook && R.subcategories.length === 0 ? null : (
                  <Button
                      key={R.id}
                      variant="ghost"
                      className={cn("flex items-center rounded-none bg-transparent text-primary-foreground text-[11px] hover:text-primary-foreground hover:bg-transparent space-x-2 px-2 font-medium",{
                        'text-card hover:text-card border-b border-b-card': props.location.split('/')[1] === R.slug
                      })}
                      onClick={() => navigate(`/${R.slug}`)}
                  >
                    <Trans>{R.name}</Trans>
                  </Button>
              )
          )}
        </div>
        <div style={{backgroundImage: "linear-gradient(#005641,#222 165px)"}}
             className="sticky top-0 z-50 px-3 ">
          <div className="flex items-center container mx-auto justify-between h-16">
            <div className="">
              {!props.sideBarOpen && (
                  <Button
                      variant="ghost"
                      className="p-0 hover:bg-transparent"
                      onClick={() => props.setOpenOptionalSideBar(!props.openOptionalSideBar)}
                  >
                    <img className="h-8" src={logo} alt="logo"/>
                  </Button>
              )}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              {data?.map((R) =>
                  !R.is_sportbook && R.subcategories.length === 0 ? null : (
                      <Button
                          key={R.id}
                          variant="ghost"
                          className={cn("flex items-center rounded-none bg-transparent text-primary-foreground text-sm hover:text-primary-foreground hover:bg-transparent space-x-2 px-2 font-medium",{
                            'text-card hover:text-card border-b border-b-card': props.location.split('/')[1] === R.slug
                          })}
                          onClick={() => navigate(`/${R.slug}`)}
                      >
                        <img
                            className="h-5 w-5"
                            style={{
                              filter:  props.location.split('/')[1] === R.slug ? 'grayscale(100%) brightness(70%) sepia(100%) hue-rotate(110deg) saturate(200%)' : '',
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

              {/*<Button*/}
              {/*    variant="ghost"*/}
              {/*    size="icon"*/}
              {/*    onClick={() => setSearchModalOpen(true)}*/}
              {/*>*/}
              {/*  <SearchIcon className="h-5 w-5"/>*/}
              {/*</Button>*/}

              {/*<Button variant="ghost" size="icon" onClick={toggleTheme}>*/}
              {/*  {theme === "dark" ? (*/}
              {/*      <Sun className="h-5 w-5"/>*/}
              {/*  ) : (*/}
              {/*      <Moon className="h-5 w-5"/>*/}
              {/*  )}*/}
              {/*</Button>*/}

              {user ? (
                  <main className="relative flex-col w-full  h-full">
                    <ProfileDropdown user={user}/>
                    {user && defaultWallet && (
                        <div className="flex absolute  -bottom-2.5 -right-1/2 -translate-x-0.5 h-1 items-center space-x- rounded-full text-xs font-medium">
                          <span>
                            {(+defaultWallet.balance / 100).toLocaleString("en-EN", {
                              minimumFractionDigits: defaultWallet.decimal_places,
                              maximumFractionDigits: defaultWallet.decimal_places,
                            })}
                          </span>
                          <span className="font-bold">
                             {currencyList[defaultWallet.slug.toUpperCase()]?.symbol_native}
                          </span>
                        </div>
                    )}
                  </main>
              ) : (
                  <section className={'space-x-3'}>

                    {/*<Button*/}
                    {/*    className={'bg-transparent hover:bg-transparent border-[1px] border-chart-4 text-[11px] rounded-full p-2 h-8 text-chart-4'}*/}
                    {/*    onClick={() => setSignUpModalOpen(true)}>*/}
                    {/*  Join*/}
                    {/*</Button>*/}

                    <Button
                        variant="secondary"
                        className="bg-transparent hover:bg-transparent border-[1px] border-primary-foreground/30 text-[11px] rounded-full p-2 h-8 text-primary-foreground"
                        onClick={() => setLoginModalOpen(true)}
                    >
                      <Trans>Log in</Trans>
                    </Button>
                  </section>
              )}
            </div>
          </div>

          {/* Login Modal */}
          <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
            <DialogContent
                className="p-0 lg:w-[450px] rounded-none bg-secondary">
              <Login setLoginModalOpen={setLoginModalOpen}/>
            </DialogContent>
          </Dialog>

          {/* Sign Up Modal */}
          <Dialog open={signUpModalOpen} onOpenChange={setSignUpModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <SignUp/>
            </DialogContent>
          </Dialog>

          {/* Search Modal */}
          <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
            <DialogContent className="overflow-auto w-full h-full  ">
              <DialogHeader>
                <DialogTitle><Trans>Search</Trans></DialogTitle>
              </DialogHeader>
              <Search onCloseSearchModal={() => setSearchModalOpen(false)}/>
            </DialogContent>
          </Dialog>
        </div>
      </div>

  );
};

export default NavBar;

const ProfileDropdown = ({user}: { user: User }) => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserCircle className="w-full stroke-[1px] text-card h-full"/>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96 mt-4  p-0 bg-white rounded-none" align="end" forceMount>
          <div className="flex flex-col w-full h-full">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <p className="text-xs font-medium leading-none">{user?.name}</p>
              </div>
            </DropdownMenuLabel>
            <div className={'flex flex-row items-center justify-between gap-x-4  w-full space-y-1 px-2'}>
              {
                user.wallets?.map((w: Wallet) => (
                    <div key={w.slug} className=" w-fit">
                    <span className={'text-xl font-semibold'}>
                      {(+w.balance / 100).toLocaleString("en-EN", {
                        minimumFractionDigits: w.decimal_places,
                        maximumFractionDigits: w.decimal_places,
                      })}
                    </span>
                      <span className="font-bold">
                      {currencyList[w.slug.toUpperCase()]?.symbol_native}
                    </span>
                    </div>
                ))
              }
            </div>
            <DropdownMenuSeparator className={'py-0 my-0'}/>
          </div>
          <Tabs defaultValue="profile" className="w-full ">
            <TabsList className={'rounded-none w-full py-0 h-14'}>
              <TabsTrigger  value="profile" className={'data-[state=active]:border-b-card data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold text-sm  font-light rounded-none '}>Profile</TabsTrigger>
              <TabsTrigger value="preferences" className={'data-[state=active]:border-b-card data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold text-sm font-light rounded-none '}>Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className={'grid grid-cols-3 gap-3 px-2'}>
              <DropdownMenuItem
                  className={'flex flex-col focus:bg-transparent cursor-pointer'}
                  onClick={() => navigate("/account/casino")}>
                <Dice6 className="size-10 stroke-[1px]"/>
                <span className={'text-xs'}><Trans>Casino</Trans></span>
              </DropdownMenuItem>

              {/*<DropdownMenuItem*/}
              {/*    className={'flex flex-col focus:bg-transparent cursor-pointer'}*/}
              {/*    onClick={() => navigate("/profile/history")}>*/}
              {/*  <History className="size-10 stroke-[1px]"/>*/}
              {/*  <span className={'text-xs'}>History</span>*/}
              {/*</DropdownMenuItem>*/}

              <DropdownMenuItem
                  className={'flex flex-col focus:bg-transparent cursor-pointer'}
                  onClick={() => navigate("account/bets")}>
                <ClipboardClock className="size-10 stroke-[1px]"/>
                <span className={'text-xs'}><Trans>Bets</Trans></span>
              </DropdownMenuItem>
              <DropdownMenuItem
                  className={'flex flex-col focus:bg-transparent cursor-pointer'}
                  onClick={() => navigate("account/payments")}>
                <CreditCard className="size-10 stroke-[1px]"/>
                <span className={'text-xs'}><Trans>Payments</Trans></span>
              </DropdownMenuItem>
              <DropdownMenuItem
                  className={'flex flex-col focus:bg-transparent cursor-pointer'}
                  onClick={() => navigate("account/general")}>
                <UserIcon className="size-10 stroke-[1px]"/>
                <span className={'text-xs'}><Trans>Profile</Trans></span>
              </DropdownMenuItem>
              <DropdownMenuItem
                  className={'flex flex-col focus:bg-transparent cursor-pointer'}
                  onClick={() => navigate("/account/change-password")}>
                <LockKeyhole className="size-10 stroke-[1px]"/>
                <span className={'text-xs '}><Trans>Password</Trans></span>
              </DropdownMenuItem>
              <DropdownMenuItem
                  className={'flex flex-col focus:bg-transparent cursor-pointer'}
                  onClick={() => navigate("/account/wallet")}>
                <WalletIcon className={'size-10 stroke-[1px]'}/>
                <span className={'text-xs'}><Trans>Wallet</Trans></span>
              </DropdownMenuItem>
              <DropdownMenuItem
                  className={'flex flex-col focus:bg-transparent cursor-pointer'}
                  onClick={() => navigate("/notifications")}>
                <Bell className="size-10 stroke-[1px]"/>
                <span className={'text-xs'}><Trans>Notifications</Trans></span>
              </DropdownMenuItem>
            </TabsContent>
            <TabsContent value="preferences"></TabsContent>
          </Tabs>
          <DropdownMenuItem
              className="w-full border-t rounded-none px-2 py-2 "
              onClick={() => logout()}>
            <Trans>Log out</Trans>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
};