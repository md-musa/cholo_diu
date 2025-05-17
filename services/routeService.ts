import { STUDENT_DENSITY } from "@/constants";
import apiClient from "../config/axiosConfig";

export interface IRoute {
  name: string;
  startLocation: string;
  endLocation: string;
  totalDistance?: number; // in kilometers
  estimatedTime?: number; // in minutes
  wayline?: unknown; // matches Mongoose Mixed
  assignedBuses?: string[]; // array of ObjectIds as strings
  waypoints?: {
    location?: string;
    latitude?: number;
    longitude?: number;
    studentDensity?: STUDENT_DENSITY.LOW | STUDENT_DENSITY.MEDIUM | STUDENT_DENSITY.HIGH;
  }[];
}

const getRoutes = async (): Promise<IRoute[]> => {
  return await apiClient.get("/routes");
};

export const RouteService = {
  getRoutes,
};
