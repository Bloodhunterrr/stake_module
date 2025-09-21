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
import UserListRender from "@/components/profile/profile/UserListRender.tsx";
import EditUser from "@/components/shared/v2/user/edit-user.tsx";
import TransactionList from "@/components/profile/profile/TransactionList.tsx";
import Reports from "@/components/profile/profile/Reports.tsx";
import Messages from "@/components/profile/profile/Messages.tsx";
import SingleTicketPage from "@/components/profile/profile/SingleTicketPage.tsx";
import SingleUserBets from "@/components/profile/profile/SingleUserBets.tsx";
import TicketPage from "@/components/profile/profile/TicketPage.tsx";
import TransactionPage from "@/components/profile/profile/TransactionPage.tsx";
import TransactionUserList from "@/components/profile/profile/TransactionUserList.tsx";
import SingleUserTransaction from "@/components/profile/profile/SingleUserTransaction.tsx";
import AgentPayments from "@/components/profile/profile/AgentPayments.tsx";

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






              //AGENT PATHS
             { path: "users", element: <UserListRender />,},
             { path: "users/edit/:userId", element: <EditUser /> },

             { path: "agent/payments", element: <AgentPayments /> },

             { path: "users/transaction/:userId", element: <TransactionList /> },
             { path: "users/create", element: <EditUser /> },
             { path: "users/reports", element: <Reports /> },
             { path: "notifications", element: <Messages />,},
             //  TODO => Agent new paths
             { path : "tickets"  , element: <TicketPage /> },
             { path : "tickets/:userTicketId"  , element: <SingleTicketPage /> },
             { path : "tickets/user/:singleBetsId"  , element: <SingleUserBets /> },
             //  TODO => Transactions Path
             { path : "reports"  , element: <TransactionPage /> },
             { path : "reports/:userTransactionId"  , element: <TransactionUserList /> },
              //  TODO => Transactions Path
              { path : "transactions/user/:singleBetsId"  , element: <SingleUserTransaction /> }
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
