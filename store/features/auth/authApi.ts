import { axiosBaseQuery } from "@/config/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),

  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({ url: "/user", method: "GET" }),
    }),
  }),
});

export const { useGetUserQuery } = authApi;
