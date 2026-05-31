import { SCHEDULE_MODES } from "../../../enums";

const mongoose = require("mongoose");

const currentScheduleModeSchema = new mongoose.Schema(
  {
    modeKey: {
      type: String,
      enum: [
        SCHEDULE_MODES.REGULAR,
        SCHEDULE_MODES.MID_TERM,
        SCHEDULE_MODES.FINAL_EXAM,
        SCHEDULE_MODES.RAMADAN,
        SCHEDULE_MODES.VACATION,
      ],
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);


/**
 * IMPORTANT: This collection should contain ONLY ONE document
 */
const CurrentScheduleModeModel = mongoose.model("Current_Schedule_Mode", currentScheduleModeSchema);
export default CurrentScheduleModeModel;