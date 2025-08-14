import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {Menu, LifeBuoy, LayoutGrid, Home, DollarSign, type LucideIcon} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from 'lucide-react';


type Language = {
    code: string;
    name: string;
};

const ALLOWED_LANGUAGES: Record<string, Language> = {
    'en': { code: 'en', name: 'English' },
    'es': { code: 'es', name: 'Spanish' },
    'fr': { code: 'fr', name: 'French' },
};

type Subcategory = {
    id: number;
    name: string;
    slug: string;
    icon: LucideIcon;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    icon: LucideIcon;
    is_sportbook: boolean;
    subcategories: Subcategory[];
};

const mockedData: Category[] = [
    {
        id: 1,
        name: 'Live Casino',
        slug: 'casino-live',
        icon: Home,
        is_sportbook: false,
        subcategories: [
            { id: 101, name: 'Roulette', slug: 'roulette', icon: DollarSign },
            { id: 102, name: 'Blackjack', slug: 'blackjack', icon: DollarSign },
        ],
    },
    {
        id: 2,
        name: 'Slots',
        slug: 'slots',
        icon: Home,
        is_sportbook: false,
        subcategories: [
            { id: 201, name: 'Video Slots', slug: 'video-slots', icon: DollarSign },
            { id: 202, name: 'Classic Slots', slug: 'classic-slots', icon: DollarSign },
        ],
    },
    {
        id: 3,
        name: 'Sportsbook',
        slug: 'sport',
        icon: Home,
        is_sportbook: true,
        subcategories: [],
    },
];

const logo = 'https://hayaspin.com/static/media/logo.eb0ca820ea802ba28dd2.svg';
const DESKTOP_WIDTH = 768;

// --- Helper Components ---

function LanguageSwitcher() {
    const [currentLang, setCurrentLang] = useState<Language>(ALLOWED_LANGUAGES.en);
    const [open, setOpen] = useState(false);

    const handleLanguageChange = (lang: Language) => {
        setCurrentLang(lang);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    className="w-full justify-between rounded-lg font-normal transition-all duration-300 hover:bg-accent"
                >
                    <div className="flex items-center space-x-2">
                        <span>{currentLang.name}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
                <ScrollArea className="h-40">
                    <div className="flex flex-col space-y-1 p-1">
                        {Object.values(ALLOWED_LANGUAGES).map((lang) => (
                            <Button
                                key={lang.code}
                                variant="ghost"
                                className="w-full justify-between font-normal"
                                onClick={() => handleLanguageChange(lang)}
                            >
                                <span>{lang.name}</span>
                                {currentLang.code === lang.code && <Check className="h-4 w-4" />}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}

interface SidebarNavProps {
    sidebarOpen: boolean;
    data: Category[];
    categorySlug?: string;
    onNavigate: (path: string) => void;
}

function SidebarNav({ sidebarOpen, data, categorySlug, onNavigate }: SidebarNavProps) {
    return (
        <nav className="flex flex-col space-y-4">
            {data.map((category) => {
                const hasSubcategories = category.subcategories.length > 0;
                if (!category.is_sportbook && !hasSubcategories) {
                    return null;
                }

                const handleCategoryClick = () => onNavigate(`/${category.slug}`);
                const isActiveCategory = categorySlug === category.slug;

                return (
                    <div key={category.id} className="group">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start rounded-lg font-normal transition-all duration-300
                            ${sidebarOpen ? 'px-3 py-2' : 'px-0 py-2 w-12 h-12 justify-center'}
                            ${isActiveCategory ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}
                            onClick={handleCategoryClick}
                        >
                            <category.icon className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5 shrink-0`} />
                            {sidebarOpen && <span className="truncate">{category.name}</span>}
                        </Button>
                        {hasSubcategories && sidebarOpen && (
                            <ul className="pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                                {!category.is_sportbook && (
                                    <li
                                        className="flex items-center space-x-2 py-1 px-2 rounded-md hover:bg-accent cursor-pointer"
                                        onClick={handleCategoryClick}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                        <span>Lobby</span>
                                    </li>
                                )}
                                {category.subcategories.map((sub) => (
                                    <li
                                        key={sub.id}
                                        className="flex items-center space-x-2 py-1 px-2 rounded-md hover:bg-accent cursor-pointer"
                                        onClick={() => onNavigate(`/${category.slug}/games/${sub.slug}`)}
                                    >
                                        <sub.icon className="h-4 w-4" />
                                        <span>{sub.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

export default function Sidebar() {
    const navigate = useNavigate();
    const { categorySlug } = useParams<{ categorySlug: string }>();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > DESKTOP_WIDTH);

    useEffect(() => {
        const handleResize = () => {
            const isCurrentlyDesktop = window.innerWidth > DESKTOP_WIDTH;
            setIsDesktop(isCurrentlyDesktop);
            if (!isCurrentlyDesktop) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleNavigate = (path: string) => {
        navigate(path);
        if (!isDesktop) {
            setSidebarOpen(false);
        }
    };

    const commonNavContent = (
        <>
            <ScrollArea className="h-full pr-4">
                <SidebarNav
                    sidebarOpen={isDesktop ? sidebarOpen : true}
                    data={mockedData}
                    categorySlug={categorySlug}
                    onNavigate={handleNavigate}
                />
            </ScrollArea>
            <div className="mt-auto pt-4 border-t border-border flex flex-col space-y-2">
                <Button
                    onClick={() => {
                        console.log('chat');
                        if (!isDesktop) setSidebarOpen(false);
                    }}
                    className={`w-full justify-start rounded-lg font-normal
                    ${isDesktop && !sidebarOpen ? 'px-0 w-12 h-12 justify-center' : 'px-4'}`}
                >
                    <LifeBuoy className={`${isDesktop && sidebarOpen ? 'mr-3' : ''} h-5 w-5`} />
                    {(isDesktop && sidebarOpen || !isDesktop) && <span className="truncate">Support</span>}
                </Button>
                {(isDesktop && sidebarOpen || !isDesktop) && <LanguageSwitcher />}
            </div>
        </>
    );

    return (
        <>
            {isDesktop ? (
                <div
                    className={`relative h-full flex-col p-4 bg-card text-card-foreground transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'w-64' : 'w-20'} hidden md:flex`}
                >
                    <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} p-2 mb-4`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="shrink-0"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        {sidebarOpen && logo && (
                            <img
                                src={logo}
                                alt="logo"
                                className="h-8 cursor-pointer"
                                onClick={() => navigate("/")}
                            />
                        )}
                    </div>
                    {commonNavContent}
                </div>
            ) : (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetTrigger asChild className="fixed top-4 left-4 z-50 md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open sidebar</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 md:hidden">
                        <div className="flex items-center justify-between p-4 mb-4">
                            {logo && (
                                <img
                                    src={logo}
                                    alt="logo"
                                    className="h-8 cursor-pointer"
                                    onClick={() => handleNavigate("/")}
                                />
                            )}
                        </div>
                        <div className="h-[calc(100%-80px)] px-4 flex flex-col">
                            {commonNavContent}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </>
    );
}