import { STUDENT_DENSITY } from "../../../enums";

export interface IRoute {
  routeNo: string;
  routeName: string;
  distance?: number;
  travelTime?: number;

  routeLine: [number, number][];

  stopages: {
    name: string;
    fare: number;
    coords: [number, number];
  }[];

  assignedBuses?: string[];

  waypoints?: {
    name?: string;
    coords?: [number, number];
    studentDensity?: STUDENT_DENSITY;
  }[];
}
