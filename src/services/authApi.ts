import {logout, setCredentials, setUser} from '@/slices/authSlice';
import {customBaseQuery} from './customBaseQuery';
import type {PlayRequest, PlayResponse, SportbookIframeReq} from '@/types/play';
import type {SetDefaultWalletRequest, SetDefaultWalletResponse} from '@/types/wallet';
import type {TransactionHistoryReq, TransactionHistoryResponse} from '@/types/transactionHistory';
import type {CasinoTransactionReq, CasinoTransactionResponse} from '@/types/casinoHistory';
import type {SportHistoryReq, SportHistoryResponse} from '@/types/sportHistory';
import type {DepositRequest, DepositResponse} from '@/types/deposits';
import type {WithdrawRequest, WithdrawResponse} from '@/types/withdraws';
import type {AuthMeResponse, AuthResponse, LoginRequest} from "@/types/auth.ts";
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
                } catch (error) {
                    console.error(error)
                    dispatch(logout());
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
    }),
});

export const {
    useLoginMutation,
    useGetUserInfoQuery,
    useChangePasswordMutation,
    useLogoutMutation,
    useLazyGetPlayQuery,
    useLazyGetSportIframeQuery,
    useSetDefaultWalletMutation,
    useGetSportHistoryMutation,
    useGetCasinoHistoryMutation,
    useGetTransactionHistoryMutation,
    useCreateDepositMutation,
    useCreateWithdrawMutation
} = authApi;