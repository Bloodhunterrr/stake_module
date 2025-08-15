import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import {useState, useEffect} from 'react';
import {useAppSelector} from '@/hooks/rtk';
import {Button} from '@/components/ui/button';
import {useIsDesktop} from '@/hooks/useIsDesktop';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {useLogoutMutation} from '@/services/authApi';
import UserIcon from '@/assets/icons/user.svg?react';
import ExitIcon from '@/assets/icons/exit.svg?react';
import WalletIcon from '@/assets/icons/wallet.svg?react';
import HistoryIcon from '@/assets/icons/clock.svg?react';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {useNavigate, useMatch, Outlet} from 'react-router-dom';

export default function Profile() {
    const [logout] = useLogoutMutation();
    const user = useAppSelector((state) => state.auth?.user);
    const navigate = useNavigate();

    const isWalletActive = useMatch('/profile/wallet/*');
    const isHistoryActive = useMatch('/profile/history/*');
    const isProfileActive = useMatch('/profile/*') && !isWalletActive && !isHistoryActive;

    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const isDesktop = useIsDesktop();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isDesktop) {
                const target = event.target as Node;
                const mobileNav = document.querySelector('.profile-nav-mobile');
                if (mobileNav && !mobileNav.contains(target)) {
                    setMobileMenuOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDesktop]);

    let mobileLabel = `Profile`;
    let mobileIcon = <UserIcon className="h-4 w-4"/>;
    if (isWalletActive) {
        mobileLabel = `Wallet`;
        mobileIcon = <WalletIcon className="h-4 w-4"/>;
    } else if (isHistoryActive) {
        mobileLabel = `History`;
        mobileIcon = <HistoryIcon className="h-4 w-4"/>;
    }

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <section className="container mx-auto py-8 lg:py-16">
            <div className="flex flex-col lg:flex-row lg:space-x-8">
                {isDesktop && (
                    <div
                        className="hidden lg:flex lg:flex-col lg:w-64 space-y-6 p-4 border rounded-lg bg-background">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <div className="font-semibold text-lg">{user?.name}</div>
                                <div className="text-sm text-muted-foreground">{user?.email}</div>
                            </div>
                        </div>
                        <nav className="flex-1 space-y-2">
                            <Button
                                variant="ghost"
                                className={`w-full justify-start space-x-2 ${isWalletActive ? 'bg-muted' : ''}`}
                                onClick={() => navigate('wallet')}
                            >
                                <WalletIcon className="h-4 w-4"/>
                                <span>Wallet</span>
                            </Button>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start space-x-2 ${isHistoryActive ? 'bg-muted' : ''}`}
                                onClick={() => navigate('history')}
                            >
                                <HistoryIcon className="h-4 w-4"/>
                                <span>History</span>
                            </Button>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start space-x-2 ${isProfileActive ? 'bg-muted' : ''}`}
                                onClick={() => navigate('general')}
                            >
                                <UserIcon className="h-4 w-4"/>
                                <span>Profile</span>
                            </Button>
                        </nav>
                        <Button
                            variant="outline"
                            className="w-full mt-auto"
                            onClick={() => logout()}
                        >
                            <ExitIcon className="h-4 w-4 mr-2"/>
                            <span>Log out</span>
                        </Button>
                    </div>
                )}

                <div className="flex-1 p-4 lg:p-0">
                    {!isDesktop && (
                        <div className="profile-nav-mobile mb-6">
                            <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between pr-3">
                                        <div className="flex items-center space-x-2">
                                            {mobileIcon}
                                            <span>{mobileLabel}</span>
                                        </div>
                                        {mobileMenuOpen ? <ChevronUp className="h-4 w-4"/> :
                                            <ChevronDown className="h-4 w-4"/>}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[calc(100vw-2rem)] mt-2">
                                    <DropdownMenuItem onClick={() => {
                                        navigate('wallet');
                                        setMobileMenuOpen(false);
                                    }}>
                                        <WalletIcon className="h-4 w-4 mr-2"/>
                                        <span>Wallet</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        navigate('history');
                                        setMobileMenuOpen(false);
                                    }}>
                                        <HistoryIcon className="h-4 w-4 mr-2"/>
                                        <span>History</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        navigate('general');
                                        setMobileMenuOpen(false);
                                    }}>
                                        <UserIcon className="h-4 w-4 mr-2"/>
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}>
                                        <ExitIcon className="h-4 w-4 mr-2"/>
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                    <Outlet/>
                </div>
            </div>
        </section>
    );
}