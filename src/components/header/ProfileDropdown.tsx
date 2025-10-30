import { DownloadIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogoutMutation } from "@/services/authApi";
import { useNavigate } from "react-router-dom";
import { Trans } from "@lingui/react/macro";
import type { Wallet } from "@/types/auth";
import { currencyList } from "@/utils/currencyList";
import LanguageAccordion from "@/components/shared/v2/language-accordion.tsx";

import CasinoIcon from "@/assets/icons/casino-icon.svg";
import AddNewUser from "@/assets/icons/add-new-user.svg";
import MessagesIcon from "@/assets/icons/messages-icon.svg";
import PaymentsIcon from "@/assets/icons/payments-icon.svg";
import BetHistoryIcon from "@/assets/icons/bet-history-icon.svg";
import UserSettingsIcon from "@/assets/icons/user-setting-icon.svg";
import { UserCircle } from "lucide-react";
import type { ProfileDropdownProps } from "@/types/header";
import CustomUserMenu from "@/components/profile/custom-user-menu.tsx";

export default function ProfileDropdown({user, showBalance, toggleShowBalance, isNoCategoryOrSportsbook, isDesktop,}: ProfileDropdownProps) {
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const menuItems = [
        {
            icon: CasinoIcon,
            label: <Trans>Casino</Trans>,
            path: user.is_agent ? "/account/casino" : "/account/casino",
            show: !user.is_agent,
        },
        {
            icon: BetHistoryIcon,
            label: <Trans>Bets</Trans>,
            path: user.is_agent ? "/account/tickets" : "/account/bets",
            show: true,
        },
        {
            icon: AddNewUser,
            label: <Trans>Add New User</Trans>,
            path: "/account/users/create",
            show: user.is_agent,
        },
        {
            icon: UserSettingsIcon,
            label: <Trans>Users</Trans>,
            path: "/account/users",
            show: user.is_agent,
        },
        {
            icon: PaymentsIcon,
            label: <Trans>Wallet</Trans>,
            path: "/account/wallet",
            show: true,
        },
        {
            icon: MessagesIcon,
            label: <Trans>Reports</Trans>,
            path: "/account/reports",
            show: user.is_agent,
        },
        {
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
    const show = import.meta.env.VITE_HAYASPIN_ENABLE_NEW_MENU === "true"
    if(show){
        return <CustomUserMenu menuItems={menuItems} user={user} showBalance={showBalance} toggleShowBalance={toggleShowBalance} isNoCategoryOrSportsbook={isNoCategoryOrSportsbook} isDesktop={isDesktop} defaultWallet={defaultWallet} otherWallets={otherWallets} />
    }else {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <UserCircle className="w-full stroke-[1px] text-white h-full"/>
                </DropdownMenuTrigger>

                <DropdownMenuContent sideOffset={
                    isNoCategoryOrSportsbook && !isDesktop
                        ? showBalance
                            ? -4
                            : -10
                        : showBalance
                            ? 10
                            : 5
                }
                                     className="md:w-96 w-screen min-w-90 max-[380px]:min-w-full mt-2 max-[768px]:mt-6 p-0 bg-white rounded-lg rounded-tl-none rounded-tr-none pb-2"
                                     align="end"
                                     forceMount>
                    <div className="flex flex-col w-full h-full px-2 pt-2">
                        <DropdownMenuLabel className="font-normal">
                            <p className="text-xs font-medium leading-none">{user?.name}</p>
                        </DropdownMenuLabel>
                        <div
                            className="flex flex-col items-start gap-y-2 justify-between gap-x-4 w-full space-y-1 py-2">
                            <div className="flex flex-row h-full items-center w-full justify-between">
                                <div className="h-full">
                                    {defaultWallet?.map((w: Wallet) => (
                                        <div key={w.slug} className="w-fit h-full">
                                            <p className="h-[14px] flex items-center justify-start w-full truncate text-[11px]">
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
                                <DropdownMenuItem onClick={() => {
                                    navigate("/account/wallet");
                                }}
                                                  className="border py-0 px-2 text-base rounded-none bg-transparent focus:bg-transparent h-11 flex">
                                    <DownloadIcon className="text-background size-5"/>
                                    <Trans>Deposit</Trans>
                                </DropdownMenuItem>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                                {otherWallets?.map((w: Wallet) => (
                                    <div key={w.slug} className="w-fit">
                                        <p className="h-[14px] flex items-center justify-start w-full truncate text-[11px]">
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
                        <DropdownMenuSeparator className="py-0 my-0"/>
                    </div>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="rounded-none w-full py-0 h-14">
                            <TabsTrigger value="profile"
                                         className="cursor-pointer data-[state=active]:border-b-card data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold text-sm font-light rounded-none">
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
                                                <img src={item.icon} alt={item.path} className="size-9"/>
                                                <span className="text-xs">{item.label}</span>
                                            </DropdownMenuItem>
                                        );
                                    }
                                    return null;
                                })}
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
                                className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/70 hover:bg-black/10"
                                onClick={() => logout()}>
                                <Trans>Log out</Trans>
                            </DropdownMenuItem>
                        </TabsContent>

                        <TabsContent value="preferences">
                            <LanguageAccordion/>
                            <div className="flex h-14 items-center justify-between border-t border-[#f8f9fa]/40 px-2">
                                <p className="text-xs font-medium text-black">
                                    <Trans>Show Balance</Trans>
                                </p>
                                <button onClick={toggleShowBalance}
                                        className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                                            showBalance ? "bg-card" : "bg-gray-300"
                                        }`}>
                                <span
                                    className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                        showBalance ? "translate-x-5" : "translate-x-1"
                                    }`}/>
                                </button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}