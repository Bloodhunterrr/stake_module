import App from "../App";
import Profile from "./profile";
import Lobby from "./casino";
import GameIframe from "./casino/gamesIframe";
import { createBrowserRouter } from "react-router";
import History from "@/components/profile/history";
import type { DOMRouterOpts } from "react-router-dom";
import ProvidersGames from "./casino/providersGames";
import ErrorPage from "@/components/shared/v2/error";
import ProfileIndex from "@/components/profile/Profile";
import SubcategoryGames from "./casino/subCategoryGames";
import AllProvidersList from "./casino/allProvidersList";
import UserInfo from "@/components/profile/profile/UserInfo";
import Security from "@/components/profile/profile/Security";
import CasinoHistory from "@/components/profile/history/Casino";
import SportHistory from "@/components/profile/history/SportHistory";
import TransactionHistory from "@/components/profile/history/Transaction";
import ChangePasswordPage from "./account/change-password";
import WalletPage from "./account/wallet";
import CasinoPageHistory from "./account/casino";

const routes = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Lobby />,
        },
        {
          path: ":categorySlug",
          element: <Lobby />,
        },
        {
          path: ":categorySlug/games/:subCategorySlug",
          element: <SubcategoryGames />,
        },
        {
          path: "/game/:gameID",
          element: <GameIframe />,
        },
        {
          path: "/providers",
          element: <AllProvidersList />,
        },
        {
          path: "/provider/:providerCode",
          element: <ProvidersGames />,
        },
        {
          path: "/profile",
          element: <Profile />,
          children: [
            {
              path: "/profile",
              element: <ProfileIndex />,
              children: [
                {
                  index: true,
                  path: "/profile/general",
                  element: <UserInfo />,
                },
                {
                  path: "/profile/security",
                  element: <Security />,
                },
              ],
            },
            {
              path: "/profile/wallet",
              element: <WalletPage />,
            },
            {
              path: "/profile/history",
              element: <History />,
              children: [
                {
                  path: "/profile/history",
                  element: <TransactionHistory />,
                },
                {
                  path: "/profile/history/casino",
                  element: <CasinoHistory />,
                },
                {
                  path: "/profile/history/sport",
                  element: <SportHistory />,
                },
              ],
            },
          ],
        },
        {
          path: "/account",
          children: [
            { path: "change-password", element: <ChangePasswordPage /> },
            { path: "wallet", element: <WalletPage /> },
            { path: "casino", element: <CasinoPageHistory /> },
          ],
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
      errorElement: <ErrorPage />,
    },
  ],
  {
    window,
    scrollRestoration: "manual",
  } as DOMRouterOpts
);

export default routes;
