import "express-async-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routeNotFoundError from "./app/middlewares/routeNotFoundError";
import { AuthRouter } from "./app/modules/auth/auth.route";
import { BusRouter } from "./app/modules/bus/bus.route";
import { RouteRouter } from "./app/modules/route/route.route";
import { TripRouter } from "./app/modules/trip/trip.route";
import { SOCKET_EVENTS } from "./enums";
import { ScheduleRouter } from "./app/modules/schedule/schedule.route";
import { handleLocationBroadcast, handleRouteJoin, stopBroadcasting } from "./app/socket/broadcast";
import { ErrorLogRoute } from "./app/modules/errorLog/errorLog.route";
import AssignmentRoute from "./app/modules/assignment/assignment.route";
import helmet from "helmet";
import compression from "compression";
import { ScheduleModeRouter } from "./app/modules/scheduleMode/scheduleMode.route";
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));

// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(req.url);
//   next();
// });

// routes
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send({ message: "Working fine" });
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/buses", BusRouter);
app.use("/api/v1/routes", RouteRouter);
app.use("/api/v1/trips", TripRouter);
app.use("/api/v1/logs", ErrorLogRoute);
app.use("/api/v1/schedules", ScheduleRouter);
app.use("/api/v1/assignments", AssignmentRoute);
app.use("/api/v1/schedule-modes", ScheduleModeRouter);


app.use(globalErrorHandler);
app.use(routeNotFoundError);
// ---------------------------
// Socket IO
// ---------------------------

export const socketHandler = (socket: any) => {
  // console.log(`🟢 New client connected: ${socket.id}`);

  // 1️⃣ User joins a route-specific room
  socket.on(SOCKET_EVENTS.JOIN_ROUTE, (routeId: string) => {
    // console.log(`➡️ Client ${socket.id} joining route ${routeId}`);
    handleRouteJoin(socket, routeId);
  });

  // 2️⃣ Bus broadcasts location updates along with user count and host name
  socket.on(SOCKET_EVENTS.BROADCAST_BUS_LOCATION, (data: any) => {
    handleLocationBroadcast(socket, data);
  });

  socket.on(SOCKET_EVENTS.STOP_BROADCASTING, () => {
    // console.log(`🛑 Bus stopped broadcasting`);
    stopBroadcasting(socket);
  });

  // 3️⃣ User leaves the route-specific room
  socket.on("leave-room", (room: string) => {
    socket.leave(room);
    //console.log(`🚫 Client ${socket.id} left room ${room}`);
  });

  socket.on("disconnecting", () => {
    // console.log(`⚠️ Client disconnecting: ${socket.id}`);
    stopBroadcasting(socket);
  });
};

export default app;
