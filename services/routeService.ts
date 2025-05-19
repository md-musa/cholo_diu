import apiClient from "../config/axiosConfig";
import { IRoute } from "@/interfaces/route";

const getRoutes = async (): Promise<IRoute[]> => {
  return await apiClient.get("/routes");
};

export const RouteService = {
  getRoutes,
};
