import type { Routes } from '@/types/main'
import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from './customBaseQuery'
import type { GameListRequest, GameListResponse } from '@/types/game_list'
import type { NpCryptosRequest, NpCryptosResponse } from '@/types/np-cryptos';
import type { ProviderListRequest, ProviderListResponse } from '@/types/provider_list';

const toQueryString = (params: any): string => {
  return Object.entries(params)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map(v => `${encodeURIComponent(key)}[]=${encodeURIComponent(String(v))}`)
        : value !== undefined && value !== null
          ? [`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`]
          : []
    )
    .join('&');
};

export const mainAPi = createApi({
  reducerPath: 'mainApi',
  baseQuery: customBaseQuery,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getMain: builder.query<Array<Routes>, void>({
      query: () => '/main',
    }),
    getGameList: builder.query<GameListResponse, GameListRequest>({
      query: (params) => ({
        url: '/gameList?' + toQueryString(params),
      }),
    }),
     getProviderList: builder.query<ProviderListResponse, ProviderListRequest>({
      query: (params) => ({
        url: '/providerList?' + toQueryString(params),
      }),
    }),
    getNpCryptoList: builder.query<NpCryptosResponse, NpCryptosRequest>({
      query: (params) => '/np-crypto-list?'  + toQueryString(params),
    })
  }),
})

export const { useGetMainQuery, useGetGameListQuery, useGetNpCryptoListQuery,  useGetProviderListQuery } = mainAPi
