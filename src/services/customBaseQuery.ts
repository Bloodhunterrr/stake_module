import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {BaseQueryFn, FetchArgs, FetchBaseQueryError} from '@reduxjs/toolkit/query';
import type {ApiResponse} from '@/types/apiResponse';
import type {RootState} from '@/store';
import {logout} from '@/slices/authSlice';
import {toast} from "react-toastify";
import config from "@/config";

function isApiResponse(data: any): data is ApiResponse {
    return data && 'success' in data && 'message' in data && 'data' in data;
}

export const customBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: `${config.baseUrl}/v1`,
        prepareHeaders: (headers, api) => {
            const token = (api.getState() as RootState).auth.accessToken;
            headers.set('Accept', `application/json`);
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    });

    const result = await baseQuery(args, api, extraOptions);

    if (result.error) {
        const status = result.error.status;

        if (status === 401) {
            // toast.warn(('Unauthorized request!!'))
            api.dispatch(logout())
        }

        return result;
    }

    if (result.data && isApiResponse(result.data)) {
        if (!result.data.success) {
            toast.error(result.data.message)
        }
        result.data = result.data.data;
    }

    return result;
};