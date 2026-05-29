import { FaUser, FaUserTie } from "react-icons/fa";
import { WeekdaySchedules } from "./WeekdaySchedules";
import { SCHEDULE_OPERATING_DAYS } from "../../../constants";

// Employee Schedules
export function EmployeeSchedules({
  groupedSchedule,
  addSchedule,
  editSchedule,
  deleteSchedule,
  assignBus,
  editBus,
  deleteBus,
  fetchSchedule,
  metadata,
}) {
  return (
    <div className="my-16">
      <div className="divider py-4">
        <div className="flex items-center text-lg font-semibold">
          <FaUser className="text-slate-600 mx-2" /> <span>Employee Schedules</span>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <WeekdaySchedules
          schedules={groupedSchedule.employees?.weekdays}
          title="Weekdays"
          iconColor="text-green-600"
          addSchedule={addSchedule}
          editSchedule={editSchedule}
          deleteSchedule={deleteSchedule}
          assignBus={assignBus}
          editBus={editBus}
          deleteBus={deleteBus}
          fetchSchedule={fetchSchedule}
          metadata={{ ...metadata, operatingDays: SCHEDULE_OPERATING_DAYS.WEEKDAYS }}
        />
        <WeekdaySchedules
          schedules={groupedSchedule.employees?.friday}
          title="Friday"
          iconColor="text-purple-600"
          addSchedule={addSchedule}
          editSchedule={editSchedule}
          deleteSchedule={deleteSchedule}
          assignBus={assignBus}
          editBus={editBus}
          deleteBus={deleteBus}
          fetchSchedule={fetchSchedule}
          metadata={{ ...metadata, operatingDays: SCHEDULE_OPERATING_DAYS.FRIDAY }}
        />
      </div>
    </div>
  );
}
