import apiClient from "../config/axiosInstance";

const RouteService = {
  getRoutes: async () => await apiClient.get("/routes"),
  getRouteById: async (id: string) => await apiClient.get(`/routes/${id}`),
};

export default RouteService;
