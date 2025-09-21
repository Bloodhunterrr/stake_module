import { Outlet } from "react-router";
import { useLocation } from "react-router";
import { useTheme } from "@/hooks/useTheme";
import { ToastContainer } from "react-toastify";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useGetMainQuery } from "@/services/mainApi";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Header from "@/components/shared/v2/header.tsx";
import TitleUpdater from "@/components/title-updater.tsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Loading from "@/components/shared/v2/loading.tsx";
import Sidebar from "./components/shared/v2/side-bar";
import { useParams } from "react-router-dom";

const App: React.FC = () => {
    useUserInfo();
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const isDesktop = useIsDesktop(1280);
    const isDesktopForSidebar = useIsDesktop(1024);
    const { data, error, isLoading } = useGetMainQuery();
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const { categorySlug } = useParams<{ categorySlug: string }>();
    const { theme, optionalSideBarOpen, setOptionalSideBarOpen } = useTheme();

    useScrollToTop(containerRef);

    useEffect(() => {
        setSideBarOpen(false);
    }, [location.pathname]);



    const isNoCategoryOrSportsbook = useMemo(() => {
        const pathParts = location.pathname.split("/").filter(Boolean);

        // True only for `/` or `/:categorySlug`
        if (pathParts.length === 0) return true; // root
        if (pathParts.length === 1) {
            const cat = data?.find((el) => el.slug === pathParts[0]);
            // return !cat || cat.is_sportbook;
            console.log(cat)
            return true
        }

        return true;
    }, [location.pathname, data]);

    useEffect(() => {
        setOptionalSideBarOpen(!isNoCategoryOrSportsbook);
    }, [isNoCategoryOrSportsbook]);

    console.log(isNoCategoryOrSportsbook, categorySlug)

    if (error || isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <Loading />
            </section>
        );
    }

    return (
        <div className="bg-background text-primary-foreground">
            <TitleUpdater />
            <main className="transition-all relative duration-300 ease-in-out">
                <Header
                    location={location.pathname}
                    setOpenOptionalSideBar={setOptionalSideBarOpen}
                    openOptionalSideBar={optionalSideBarOpen}
                    isDesktop={isDesktop}
                    sideBarOpen={sideBarOpen}
                    toggleSideBar={setSideBarOpen}
                    isNoCategoryOrSportsbook={isNoCategoryOrSportsbook}
                />

                {!isDesktopForSidebar && isNoCategoryOrSportsbook && (
                    <Sidebar
                        isDesktop={isDesktopForSidebar}
                        sideBarOpen={sideBarOpen}
                        toggleSideBar={setSideBarOpen}
                    />
                )}
                <Outlet />
            </main>
            <ToastContainer theme={theme} />
        </div>
    );
};

export default App;
