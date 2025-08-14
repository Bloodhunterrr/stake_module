import { createBrowserRouter } from "react-router";
import App from "../App";
import Profile from "./profile";
import History from "@/components/profile/history";
import Lobby from "./casino";
import SubcategoryGames from "./casino/subCategoryGames";
import GameIframe from "./casino/gamesIframe";
import WalletPage from "@/components/profile/wallet";
import TransactionHistory from "@/components/profile/history/Transaction";
import SportHistory from "@/components/profile/history/SportHistory";
import CasinoHistory from "@/components/profile/history/Casino";
import UserInfo from "@/components/profile/profile/UserInfo";
import Security from "@/components/profile/profile/Security";
import ProfileIndex from "@/components/profile/Profile";
import ProvidersGames from "./casino/providersGames";
import ErrorPage from "@/components/shared/error";
import AllProvidersList from "./casino/allProvidersList";
import type {DOMRouterOpts} from "react-router-dom";

const  routes=  createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Lobby />,
            },
            {
                path: ':categorySlug',
                element: <Lobby />,
            },
            {
                path: ':categorySlug/games/:subCategorySlug',
                element: <SubcategoryGames />,
            },
            {
                path: '/game/:gameID',
                element: <GameIframe />,
            },
            {
                path: '/providers',
                element:<AllProvidersList />
            },
            {
                path: '/provider/:providerCode',
                element: <ProvidersGames />
            },
            {
                path: '/profile',
                element: <Profile />,
                children: [
                    {
                        path: '/profile',
                        element: <ProfileIndex />,
                        children: [
                            {
                                index: true,
                                path: '/profile/general',
                                element: <UserInfo />
                            },
                            {
                                path: '/profile/security',
                                element: <Security />
                            },
                        ]
                    },
                    {
                        path: '/profile/wallet',
                        element: <WalletPage />
                    },
                    {
                        path: '/profile/history',
                        element: <History />,
                        children: [
                            {
                                path: '/profile/history',
                                element: <TransactionHistory />
                            },
                            {
                                path: '/profile/history/casino',
                                element: <CasinoHistory />
                            },
                            {
                                path: '/profile/history/sport',
                                element: <SportHistory />
                            },
                        ]
                    },
                ]
            },
            {
                path: '*',
                element: <ErrorPage />,
            },
        ],
        errorElement: <ErrorPage />
    },
], {
    window,
    scrollRestoration: 'manual',
} as DOMRouterOpts);

export default routes;