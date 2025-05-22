import { createContext, useState, useContext } from "react";

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState();

  


  return <ScheduleContext.Provider value={{ schedules, setSchedules }}>{children}</ScheduleContext.Provider>;
};

// Custom Hook to Use Context
export const useSchedule = () => useContext(ScheduleContext);
