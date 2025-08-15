import {cn} from "@/lib/utils";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Outlet, useNavigate, useLocation} from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        {label: "General", path: "/profile/general"},
        {label: "Security", path: "/profile/security"},
    ];

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">
                Profile
            </h1>

            <Tabs
                value={location.pathname}
                onValueChange={(value) => navigate(value)}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.path}
                            value={tab.path}
                            className={cn(
                                "w-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-colors duration-200"
                            )}
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="mt-6 rounded-lg border bg-card text-card-foreground p-6">
                <Outlet/>
            </div>
        </div>
    );
}