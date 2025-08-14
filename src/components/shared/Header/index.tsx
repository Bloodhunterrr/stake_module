import {
    Search as SearchIcon,
    Moon,
    Sun,
    History,
    Bell,
    LogOut,
    UserCircle,
    WalletIcon, UserIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";

import Login from "../login";
import SignUp from "../signup";
import {useState} from "react";
import {useTheme} from "@/hooks/useTheme";
import {useAppSelector} from "@/hooks/rtk";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import type {Wallet, User} from "@/types/auth";
import {currencyList} from "@/utils/currencyList";
import Search from "@/components/casino/search.tsx";
import {useLogoutMutation} from "@/services/authApi";

const logo = 'https://hayaspin.com/static/media/logo.eb0ca820ea802ba28dd2.svg';

type NavBarProps = {
    isDesktop: boolean;
    sideBarOpen: boolean;
    toggleSideBar: React.Dispatch<React.SetStateAction<boolean>>;
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

    const {theme, toggleTheme} = useTheme();

    return (
        <>
            <div className="flex items-center justify-between h-16">
                <div className="xl:ml-0 ml-12">
                    {!props.sideBarOpen && (
                        <Button
                            variant="ghost"
                            className="p-0"
                            onClick={() => navigate("/")}
                        >
                            <img className="h-8" src={logo} alt="logo"/>
                        </Button>
                    )}
                </div>


                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => setSearchModalOpen(true)}>
                        <SearchIcon className="h-5 w-5"/>
                    </Button>

                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5"/>
                        ) : (
                            <Moon className="h-5 w-5"/>
                        )}
                    </Button>

                    {user && defaultWallet && (
                        <div
                            className="flex items-center space-x-2 px-3 py-1 rounded-full bg-muted text-sm font-medium">
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

                    {user ? (
                        <ProfileDropdown user={user}/>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={() => setLoginModalOpen(true)}>
                                Log in
                            </Button>
                            <Button onClick={() => setSignUpModalOpen(true)}>Sign up</Button>
                        </>
                    )}
                </div>
            </div>

            {/* Login Modal */}
            <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <Login/>
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
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Search</DialogTitle>
                    </DialogHeader>
                    <Search onCloseSearchModal={() => setSearchModalOpen(false)}/>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NavBar;

const ProfileDropdown = ({user}: { user: User }) => {
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                    <UserCircle className="h-6 w-6"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => navigate("/profile/wallet")}>
                    <WalletIcon className="mr-2 h-4 w-4"/>
                    <span>Wallet</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile/history")}>
                    <History className="mr-2 h-4 w-4"/>
                    <span>History</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile/general")}>
                    <UserIcon className="mr-2 h-4 w-4"/>
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/notifications")}>
                    <Bell className="mr-2 h-4 w-4"/>
                    <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};