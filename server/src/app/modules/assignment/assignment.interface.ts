import { Document, Types } from "mongoose";

export interface IAssignment extends Document {
  scheduleId: Types.ObjectId;
  busId?: Types.ObjectId;
  driverId?: Types.ObjectId;
  assignmentType: "fixed" | "one-off";
  specificDate?: Date;
  workingDays?: ("sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday")[];
}
