import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { authApi } from "./features/auth/authApi";
import { routeApi } from "./features/route/routeApi";
import routeReducer from "./features/route/routeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // slice reducer
    route: routeReducer, // slice reducer
    [authApi.reducerPath]: authApi.reducer, // RTK query API reducer
    [routeApi.reducerPath]: routeApi.reducer, // RTK query API reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, routeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
