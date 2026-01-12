import { FaUserGraduate } from "react-icons/fa";
import { WeekdaySchedules } from "./WeekdaySchedules";
import { SCHEDULE_OPERATING_DAYS } from "../../../constants";

// Student Schedules
export function StudentSchedules({
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
    <div className="mb-8">
      {/* <div className="divider py-4">
        <div className="flex items-center text-lg font-semibold">
          <FaUserGraduate className="text-slate-600 mx-2" /> <span> Schedules</span>
        </div>
      </div> */}

      <div className="grid gap-8 grid-cols-1 2xl:grid-cols-2">
        <WeekdaySchedules
          schedules={groupedSchedule.students?.weekdays}
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
          schedules={groupedSchedule.students?.friday}
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
