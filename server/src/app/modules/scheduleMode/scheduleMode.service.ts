import CurrentScheduleModeModel from "./scheduleMode.model";

const getCurrentScheduleMode = async () => {
  return await CurrentScheduleModeModel.findOne();
};

/**
 * Update current schedule mode
 * If no document exists → create one
 * Ensures ONLY ONE document always exists
 */

const updateCurrentScheduleMode = async (modeKey) => {
  const currentMode = await CurrentScheduleModeModel.findOneAndUpdate(
    {}, // match any document (only one should exist)
    {
      modeKey,
    },
    {
      new: true,
      upsert: true,
    }
  );

  return currentMode;
};

export const ScheduleModeService = {
  getCurrentScheduleMode,
  updateCurrentScheduleMode,
};
