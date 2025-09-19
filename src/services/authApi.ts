import {logout, setCredentials, setUser} from '@/slices/authSlice';
import {customBaseQuery} from './customBaseQuery';
import type {PlayRequest, PlayResponse, SportbookIframeReq} from '@/types/play';
import type {SetDefaultWalletRequest, SetDefaultWalletResponse} from '@/types/wallet';
import type {TransactionHistoryReq, TransactionHistoryResponse} from '@/types/transactionHistory';
import type {CasinoTransactionReq, CasinoTransactionResponse} from '@/types/casinoHistory';
import type {SportHistoryReq, SportHistoryResponse} from '@/types/sportHistory';
import type {DepositRequest, DepositResponse} from '@/types/deposits';
import type {WithdrawRequest, WithdrawResponse} from '@/types/withdraws';
import type {
    AuthMeResponse,
    AuthResponse, BlockRequest, BlockResponse, getSendSingleMessageRequest, getSendSingleMessageResponse,
    LoginRequest, MessageRequest, MessageResponse,
    ReportRequest, ReportResponse, SingleMessageResponse, TransactionRequest, TransactionResponse,
    UsersRequest,
    UsersResponse
} from "@/types/auth.ts";
import {createApi} from "@reduxjs/toolkit/query/react";
import {toast} from "react-toastify";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            onQueryStarted: async (_arg, {queryFulfilled, dispatch}) => {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch (error) {
                    console.error(error)
                }
            },
        }),
        changePassword: builder.mutation({
            query: (body) => ({
                url: '/change-password',
                method: 'POST',
                body,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            onQueryStarted: async (_, {dispatch, queryFulfilled}) => {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                    window.location.href = '/';
                } catch (error) {
                    console.error(error)
                    dispatch(logout());
                    window.location.href = '/';
                }
                toast.success(('Logged out successfully'));
            },
        }),
        getUserInfo: builder.query<AuthMeResponse, void>({
            query: () => ({
                url: '/me',
            }),
            onQueryStarted: async (_arg, {queryFulfilled, dispatch}) => {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setUser(data));
                } catch (error) {
                    console.error(error)
                }
            }
        }),

        // Wallets
        setDefaultWallet: builder.mutation<SetDefaultWalletResponse, SetDefaultWalletRequest>({
            query: (data) => ({
                url: '/wallet/set-default-wallet',
                method: "POST",
                body: data
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled
                    dispatch(authApi.endpoints.getUserInfo.initiate(undefined, {forceRefetch: true}));
                    toast.success(('Default wallet updated successfully'));
                } catch (e) {
                    console.error(e)
                    toast.error(('Failed to set default wallet'));
                }
            }
        }),

        createDeposit: builder.mutation<DepositResponse, DepositRequest>({
            query: (data) => ({
                url: '/wallet/deposit',
                method: "POST",
                body: data
            })
        }),
        createWithdraw: builder.mutation<WithdrawResponse, WithdrawRequest>({
            query: (data) => ({
                url: '/wallet/withdraw',
                method: "POST",
                body: data
            })
        }),
        // Slots url
        getPlay: builder.query<PlayResponse, PlayRequest>({
            query: (params) => ({
                url: '/play',
                params
            })
        }),

        // Sports IFRAME URL
        getSportIframe: builder.query<PlayResponse, SportbookIframeReq>({
            query: (params) => ({
                url: '/s-iframe',
                params
            })
        }),

        getTransactionHistory: builder.mutation<TransactionHistoryResponse, TransactionHistoryReq>({
            query: (filters) => ({
                url: "/history/transactions",
                method: "POST",
                body: filters,
            }),
        }),
        getCasinoHistory: builder.mutation<CasinoTransactionResponse, CasinoTransactionReq>({
            query: (filters) => ({
                url: "/history/casino",
                method: "POST",
                body: filters,
            }),
        }),
        getSportHistory: builder.mutation<SportHistoryResponse, SportHistoryReq>({
            query: (filters) => ({
                url: "/history/sport",
                method: "POST",
                body: filters,
            }),
        }),
        // Get users
        getUserList : builder.query<UsersResponse, UsersRequest>({
            query: (params) => ({
                url: '/agent/users?',
                params
            }),
        }),
        getSingleUser : builder.query<UsersResponse, UsersRequest>({
            query: (params) => ({
                url: `/agent/users/` + params.user_id,
            }),
        }),
        getSingleUserTransaction : builder.query<TransactionResponse, TransactionRequest>({
            query: (params) => ({
                url: `/agent/transactions?`,
                params
            }),
        }),
        getReports : builder.query<ReportResponse, ReportRequest>({
            query: (params) => ({
                url: `/agent/report?`,
                params
            }),
        }),
        putBlockUser : builder.mutation<BlockResponse, BlockRequest>({
            query: (params) => ({
                method: 'PUT',
                url: `/agent/users/${params.id}/block-status`,
                body : params?.body
            }),
        }),
        getMessages : builder.query<MessageResponse, MessageRequest>({
            query: (params) => ({
                url: `agent/messages`,
                params
            }),
        }),
        getSingleMessage : builder.query<SingleMessageResponse, MessageRequest>({
            query: (params) => ({
                url: `agent/messages/${params.id}`,
            }),
        }),
        getSendSingleMessage: builder.mutation<MessageResponse, MessageRequest>({
            query: (filters) => ({
                url: "/agent/messages",
                method: "POST",
                body: filters,
            }),
        }),
        getAllUsersTickets : builder.query<getSendSingleMessageResponse, getSendSingleMessageRequest>({
            query: (params) => ({
                url: `/agent/tickets`,
                params
            }),
        }),
        getSingleUsersTickets : builder.query<any, any>({
            query: (params) => ({
                url: `/agent/tickets/user`,
                params
            }),
        }),
        getTransactions : builder.query<any, any>({
            query: (params) => ({
                url: `/agent/transactions`,
                params
            }),
        }),
        getSingleUsersTransaction : builder.query<any, any>({
            query: (params) => ({
                url: `/agent/transactions/user`,
                params
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useGetUserInfoQuery,
    useChangePasswordMutation,
    useLogoutMutation,
    useLazyGetPlayQuery,
    useLazyGetSportIframeQuery,
    useGetSportIframeQuery,
    useSetDefaultWalletMutation,
    useGetSportHistoryMutation,
    useGetCasinoHistoryMutation,
    useGetTransactionHistoryMutation,
    useCreateDepositMutation,
    useCreateWithdrawMutation,
    useLazyGetUserListQuery,
    useLazyGetSingleUserQuery,
    useLazyGetSingleUserTransactionQuery,
    useLazyGetReportsQuery,
    usePutBlockUserMutation,
    useLazyGetMessagesQuery,
    useLazyGetSingleMessageQuery,
    useGetSendSingleMessageMutation,
    useLazyGetAllUsersTicketsQuery,
    useLazyGetSingleUsersTicketsQuery,
    useLazyGetTransactionsQuery,
    useLazyGetSingleUsersTransactionQuery,
} = authApi;