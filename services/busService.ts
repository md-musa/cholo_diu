import apiClient from "@/config/axiosInstance";

const BusService = {
  getBuses: async () => await apiClient.get("/buses"),
  getBusById: async (id: string) => await apiClient.get(`/buses/${id}`),
};

export default BusService;
