import { axiosBaseQuery } from "@/config/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const routeApi = createApi({
  reducerPath: "routeApi",
  baseQuery: axiosBaseQuery(),

  endpoints: (builder) => ({
    gerRoutes: builder.query({
      query: () => ({ url: "/routes", method: "GET" }),
    }),
  }),
});

export const { useGerRoutesQuery } = routeApi;
