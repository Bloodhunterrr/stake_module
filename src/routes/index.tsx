import App from "../App";
import Lobby from "./casino";
import GameIframe from "./casino/gamesIframe";
import { createBrowserRouter } from "react-router";
import type { DOMRouterOpts } from "react-router-dom";
import ProvidersGames from "./casino/providersGames";
import ErrorPage from "@/components/shared/v2/error";
import SubcategoryGames from "./casino/subCategoryGames";
import AllProvidersList from "./casino/allProvidersList";
import UserInfo from "@/components/profile/profile/UserInfo";
import ChangePasswordPage from "./account/change-password";
import WalletPage from "./account/wallet";
import CasinoPageHistory from "./account/casino";
import PaymentsHistoryPage from "./account/payments";
import BetsHistoryPage from "./account/bets";

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
          path: ":categorySlug/providers",
          element: <AllProvidersList />,
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
          path: ":categorySlug/provider/:providerCode",
          element: <ProvidersGames />,
        },
        {
          path: "/account",
          children: [
            { path: "change-password", element: <ChangePasswordPage /> },
            { path: "wallet", element: <WalletPage /> },
            { path: "casino", element: <CasinoPageHistory /> },
            { path: "bets", element: <BetsHistoryPage /> },
            { path: "payments", element: <PaymentsHistoryPage /> },
            { path: "general", element: <UserInfo /> },
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
