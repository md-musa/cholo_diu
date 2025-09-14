import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/config/axiosBaseQuery";

export const tripApi = createApi({
  reducerPath: "tripApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Trip"],
  endpoints: (builder) => ({
    // Get all trips
    getTrips: builder.query({
      query: () => ({
        url: "/trips",
        method: "GET",
      }),
      providesTags: ["Trip"],
    }),

    // Update a trip
    createTrip: builder.mutation({
      query: ({ payload }: { payload: any }) => {
        console.log("Creating trip with payload in tripApi:", payload);
        return {
          url: `/trips`,
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: ["Trip"],
    }),

    updateTrip: builder.mutation({
      query: ({ id, payload }: { id: string; payload: any }) => ({
        url: `/trips/${id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["Trip"],
    }),
  }),
});

export const { useCreateTripMutation, useGetTripsQuery, useUpdateTripMutation } = tripApi;
