import { STUDENT_DENSITY, USER_ROLES } from "@/constants";

export interface IRoute {
  name: string;
  startLocation: string;
  endLocation: string;
  totalDistance?: number; // in kilometers
  estimatedTime?: number; // in minutes
  wayline?: JSON; // matches Mongoose Mixed
  assignedBuses?: string[]; // array of ObjectIds as strings
  waypoints?: {
    location?: string;
    latitude?: number;
    longitude?: number;
    studentDensity?: STUDENT_DENSITY.LOW | STUDENT_DENSITY.MEDIUM | STUDENT_DENSITY.HIGH;
  }[];
}

export interface IUser {
  name: string;
  email: string;
  role: USER_ROLES.ADMIN | USER_ROLES.EMPLOYEE | USER_ROLES.STUDENT | USER_ROLES.SUPER_ADMIN;
  password: string;
  phoneNumber: string;
  houseLocation: {
    latitude: number;
    longitude: number;
  };
  routeId: IRoute;
}
