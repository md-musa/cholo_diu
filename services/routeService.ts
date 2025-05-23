import apiClient from "../config/axiosConfig";

const RouteService = {
  getRoutes: async () => await apiClient.get("/routes"),
  getRouteById: async (id: string) => await apiClient.get(`/routes/${id}`),
};

export default RouteService;
