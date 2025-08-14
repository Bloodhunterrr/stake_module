import {Outlet} from "react-router";
import {useLocation} from "react-router";
import {useTheme} from "@/hooks/useTheme";
import {ToastContainer} from "react-toastify";
import Modals from "@/components/shared/modals";
import Loader from "@/components/shared/Loader";
import NavBar from "@/components/shared/Header";
import SideBar from "@/components/shared/Sidebar";
import {useUserInfo} from "@/hooks/useUserInfo";
import {useIsDesktop} from "@/hooks/useIsDesktop";
import {useGetMainQuery} from "@/services/mainApi";
import {useScrollToTop} from "@/hooks/useScrollToTop";
import React, {useEffect, useRef, useState} from "react";

const App: React.FC = () => {
    useUserInfo();
    const [sideBarOpen, toggleSideBar] = useState<boolean>(false);
    const isDesktop = useIsDesktop(1280);
    const [styleVars, setStyleVars] = useState<Record<string, string>>({});
    const {error, isLoading} = useGetMainQuery();
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    useScrollToTop(containerRef);
    const {theme} = useTheme();

    useEffect(() => {
        toggleSideBar(false);
    }, [location.pathname]);

    useEffect(() => {

        const calculateHeights = () => {
            const windowHeight = window.innerHeight;

            setStyleVars({
                "--m-app-height": `${windowHeight}px`,
                "--app-height": `${windowHeight}px`,
            });
        };

        calculateHeights();
        window.addEventListener("resize", calculateHeights);

        return () => {
            window.removeEventListener("resize", calculateHeights);
        };
    }, []);

    if (error || isLoading) {
        return <Loader/>;
    }

    return (
        <>

            <div
                className={`app ${isDesktop ? "desktop" : "mobile"}`}
                style={styleVars as React.CSSProperties}
            >
                <SideBar/>
                <div
                    ref={containerRef}
                    id="container"
                    className="isFull m-thin-scrollbar"
                >
                    <NavBar
                        isDesktop={isDesktop}
                        sideBarOpen={sideBarOpen}
                        toggleSideBar={toggleSideBar}
                    />
                    <Outlet/>
                </div>
                <Modals/>
            </div>
            <ToastContainer theme={theme}/>
        </>
    );
};

export default App;
