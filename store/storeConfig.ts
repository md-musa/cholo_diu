import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import authReducer from "./features/auth/authSlice";
import { authApi } from "./features/auth/authApi";

import routeReducer from "./features/route/routeSlice";
import scheduleReducer from "./features/schedule/scheduleSlice";
import { routeApi } from "./features/route/routeApi";
import { scheduleApi } from "./features/schedule/scheduleApi";

// 1. Create the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    route: routeReducer,
    schedule: scheduleReducer,
    [authApi.reducerPath]: authApi.reducer,
    [routeApi.reducerPath]: routeApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, routeApi.middleware, scheduleApi.middleware),
});

// 2. Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 3. Typed versions of hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
