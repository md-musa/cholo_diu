import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/config/axiosBaseQuery";
import { ISchedule } from "./schedule.interface";

export const scheduleApi = createApi({
  reducerPath: "scheduleApi",
  baseQuery: axiosBaseQuery(),
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getScheduleByRoute: builder.query<ISchedule[], { routeId: string; operatingDays: string }>({
      query: ({ routeId, operatingDays }) => ({
        url: `/schedules/route/${routeId}`,
        method: "GET",
        params: { operatingDays },
      }),
    }),
    getScheduleByDriver: builder.query<any, { driverId: string }>({
      query: ({ driverId }) => ({
        url: `/schedule-assignments/driver/${driverId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetScheduleByRouteQuery, useGetScheduleByDriverQuery } = scheduleApi;
