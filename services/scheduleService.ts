import apiClient from "@/config/axiosConfig";

const ScheduleService = {
  getScheduleByRoute: async (routeId: string, day: string) =>
    await apiClient.get(`/schedules/get-single-route-schedule`, {
      params: { routeId, day: day.toLocaleLowerCase() },
    }),
};

export default ScheduleService;