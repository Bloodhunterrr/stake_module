import {Outlet} from "react-router";
import {useLocation} from "react-router";
import {useTheme} from "@/hooks/useTheme";
import {ToastContainer} from "react-toastify";
import Modals from "@/components/shared/modals";
import Loader from "@/components/shared/Loader";
import NavBar from "@/components/shared/v2/Header";
// import SideBar from "@/components/shared/v2/Sidebar";
import {useUserInfo} from "@/hooks/useUserInfo";
import {useIsDesktop} from "@/hooks/useIsDesktop";
import {useGetMainQuery} from "@/services/mainApi";
import {useScrollToTop} from "@/hooks/useScrollToTop";
import React, {useEffect, useRef, useState} from "react";

const App: React.FC = () => {
    useUserInfo();
    const [sideBarOpen, toggleSideBar] = useState<boolean>(false);
    const isDesktop = useIsDesktop(1280);
    const {error, isLoading} = useGetMainQuery();
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);

    useScrollToTop(containerRef);
    const {theme , optionalSideBarOpen, setOptionalSideBarOpen} = useTheme();

    useEffect(() => {
        toggleSideBar(false);
    }, [location.pathname]);

    if (error || isLoading) {
        return <Loader/>;
    }

    return (
        <div className="bg-background text-primary-foreground">
            {/*<SideBar*/}
            {/*    isDesktop={isDesktop}*/}
            {/*    sideBarOpen={sideBarOpen}*/}
            {/*    toggleSideBar={toggleSideBar}*/}
            {/*/>*/}
            <main
                className={`transition-all duration-300 ease-in-out`}
            >
                <NavBar
                    location={location.pathname}
                    setOpenOptionalSideBar={setOptionalSideBarOpen}
                    openOptionalSideBar={optionalSideBarOpen}
                    isDesktop={isDesktop}
                    sideBarOpen={sideBarOpen}
                    toggleSideBar={toggleSideBar}
                />
                <Outlet/>
            </main>
            <Modals/>
            <ToastContainer theme={theme}/>
        </div>
    );
};

export default App;