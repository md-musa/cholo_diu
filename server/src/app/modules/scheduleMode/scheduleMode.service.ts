import CurrentScheduleModeModel from "./scheduleMode.model";

const getCurrentScheduleMode = async () => {
  return await CurrentScheduleModeModel.findOne();
};


const updateCurrentScheduleMode = async (modeKey) => {
  const currentMode = await CurrentScheduleModeModel.findOneAndUpdate(
    {},
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
