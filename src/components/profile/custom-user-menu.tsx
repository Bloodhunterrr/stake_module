import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {DownloadIcon, UserCircle} from "lucide-react";
import type {Wallet} from "@/types/auth.ts";
import {currencyList} from "@/utils/currencyList.ts";
import {Trans} from "@lingui/react/macro";
import {useNavigate} from "react-router";
import {cn} from "@/lib/utils.ts";
import {useLogoutMutation} from "@/services/authApi.ts";
import {Input} from "@/components/ui/input.tsx";
import { Search } from 'lucide-react';
import LanguageAccordion from "@/components/shared/v2/language-accordion.tsx";

function CustomUserMenu({isNoCategoryOrSportsbook , menuItems, isDesktop , showBalance , user , defaultWallet , otherWallets , toggleShowBalance} : any) {
    const [logout] = useLogoutMutation();

    const navigate = useNavigate()

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <UserCircle className="w-full stroke-[1px] text-card h-full" />
            </DropdownMenuTrigger>

            <DropdownMenuContent tabIndex={-1} sideOffset={
                    isNoCategoryOrSportsbook && !isDesktop
                        ? showBalance
                            ? -4
                            : -10
                        : showBalance
                            ? 4
                            : 4
                } className="md:w-96 w-screen min-w-90 max-[380px]:min-w-full mt-6 lg:mt-3.5 p-0 bg-white rounded-none" align="end" forceMount>
                <div className="flex flex-col w-full h-full pt-2">
                    <DropdownMenuLabel className="font-normal py-0 h-8 flex flex-row items-center justify-between">
                        <div className={'flex flex-row items-center h-5 relative gap-x-2 pr-1 w-2/3'}>
                            <Input tabIndex={1} placeholder={"Kerko Bileten"} className={'h-7 pr-7 relative rounded-sm'}/>
                            <Search className={'absolute top-1/2  right-3 size-5 stroke-[1px] text-black/70 -translate-y-1/2'}/>
                        </div>
                        <div className="flex h-10 w-1/3 gap-x-0.5 items-center justify-between px-2">
                            <p className="text-[9px] shrink-0 font-medium text-black/70 ">
                                <Trans>Show Balance</Trans>
                            </p>
                            <button
                                onClick={toggleShowBalance}
                                className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                                    showBalance ? "bg-card" : "bg-gray-300"
                                }`}>
                            <span className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                    showBalance ? "translate-x-5" : "translate-x-1"
                                }`}/>
                            </button>
                        </div>
                        <p className="text-xs font-medium leading-none"></p>
                    </DropdownMenuLabel>
                    <div className="flex flex-col items-start  justify-between  gap-x-4 w-full space-y-1 pt-2">
                        <div
                            className={
                                "flex flex-row h-full items-center border-b border-t px-2 py-1 w-full justify-between"
                            }>
                            <div className={"h-full"}>
                                {defaultWallet?.map((w: Wallet) => (
                                    <div key={w.slug} className="w-fit h-full">
                                        <p className={
                                            "h-[14px] flex items-center justify-start w-full truncate text-[11px]"
                                        }>
                                            {user?.name} ({user?.id})
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
                                }>
                                <DownloadIcon className={"text-background  size-5"} />
                                <Trans>Deposit</Trans>
                            </DropdownMenuItem>
                        </div>
                        <div className={"flex flex-col items-center  justify-between w-full"}>
                            {otherWallets?.map((w: Wallet , index : number) => (
                                <div key={w.slug} className={cn("w-full border-b px-2 h-12",{
                                    "border-b-transparent py-1" : (index + 1)   ===  otherWallets.length
                                })}>
                                    <p className={
                                        "h-[14px] flex items-center  justify-start w-full truncate text-[11px]"
                                    }>
                                        {user?.name} ({user?.id})
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
                        <div className={"border-t w-full py-2"}>
                            <LanguageAccordion/>
                        </div>
                    </div>
                </div>
                <DropdownMenuItem
                    className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/90 hover:bg-black/10"
                    onClick={() => {
                        if (window.Tawk_API) {
                            if (typeof window.Tawk_API.maximize === "function") {
                                window.Tawk_API.maximize();
                            } else {
                                window.Tawk_API.onLoad = () => {
                                    window.Tawk_API?.maximize?.();
                                };
                            }
                        }
                    }}
                >
                    Chat
                </DropdownMenuItem>
                {menuItems.map((item : any, i : number) => {
                    if (item.show) {
                        return (
                            <DropdownMenuItem key={i}
                                              className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/90 hover:bg-black/10"
                                              onClick={() => navigate(item.path)}>
                                {item.label}
                            </DropdownMenuItem>
                        );
                    }
                })}
                <DropdownMenuItem
                    className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/90 hover:bg-black/10"
                    onClick={() => navigate("/account/general")}>
                    <Trans>Profile</Trans>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/90 hover:bg-black/10"
                    onClick={() => navigate("/account/notifications")}>
                    <Trans>Messages</Trans>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/90 hover:bg-black/10"
                    onClick={() => navigate("/")}>
                    <Trans>Responsible Gambling</Trans>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="w-full border-t rounded-none px-2 py-2 cursor-pointer text-black/90 hover:bg-black/10"
                    onClick={() => navigate("/account/change-password")}>
                    <Trans>Password</Trans>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="w-full border-t rounded-none px-2 py-2 cursor-pointer hover:bg-black/10 text-black/70"
                    onClick={() => logout()}>
                    <Trans>Log out</Trans>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default CustomUserMenu;