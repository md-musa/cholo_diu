export interface IncomingLocationPayload {
    broadcaster: "user" | "driver";
    tripId: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
}

export interface OutgoingLocationPayload {
    tripId?: string;
    busName?: string;
    routeId: string;
    direction?: string;
    userType?: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    avgSpeed: number;
    currUserCnt: number;
    hostName?: string;
    timestamp: string;
}
