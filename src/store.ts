import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '@/services/authApi'
import { mainAPi } from '@/services/mainApi'
import authReducer from '@/slices/authSlice'
import sharedReducer from '@/slices/sharedSlice'

export const store = configureStore({
  reducer: {
    "auth": authReducer,
    'shared': sharedReducer,
    [mainAPi.reducerPath]: mainAPi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(mainAPi.middleware)
      .concat(authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch