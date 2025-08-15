import {useState} from "react";
import {cn} from "@/lib/utils.ts";
import {Moon, Sun} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Outlet, useNavigate, useLocation} from "react-router-dom";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

export default function History() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
        document.documentElement.classList.toggle("dark");
    };

    const tabs = [
        {
            label: "Transactions history",
            path: "/profile/history",
            value: "transactions",
        },
        {
            label: "Casino History",
            path: "/profile/history/casino",
            value: "casino",
        },
        {
            label: "Betting History",
            path: "/profile/history/sport",
            value: "sport",
        },
    ];

    const currentTabValue = tabs.find((tab) => tab.path === location.pathname)?.value || tabs[0].value;

    return (
        <div className={cn(
            "min-h-screen flex items-start justify-center py-10 px-4",
            "bg-gray-100 dark:bg-gray-950 transition-colors duration-300"
        )}>
            <Card className="w-full max-w-4xl p-6 md:p-8 shadow-2xl rounded-xl">
                <CardHeader
                    className="flex flex-row items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
                    <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                        History
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                        {isDarkMode ? (
                            <Sun className="h-6 w-6 text-gray-500 hover:text-gray-400 transition-colors"/>
                        ) : (
                            <Moon className="h-6 w-6 text-gray-600 hover:text-gray-700 transition-colors"/>
                        )}
                    </Button>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs value={currentTabValue} className="mb-8">
                        <TabsList className="grid w-full grid-cols-3 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 p-1">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    onClick={() => navigate(tab.path)}
                                    className={cn(
                                        "h-10 text-base font-semibold transition-all duration-300 rounded-md",
                                        "data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground",
                                        "data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 dark:text-gray-400",
                                        "data-[state=inactive]:hover:bg-gray-300 dark:hover:bg-gray-700"
                                    )}
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                    <div className="min-h-[200px]">
                        <Outlet/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

