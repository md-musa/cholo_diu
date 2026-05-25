import { FaCalendarAlt } from "react-icons/fa";
import { DirectionSchedules } from "./DirectionSchedules";
import { SCHEDULE_DIRECTIONS } from "../../../constants";

export function WeekdaySchedules({
  schedules,
  title,
  iconColor,
  onAddTo,
  onAddFrom,
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
    <div className="mx-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl p-4 bg-white">
      <div className="flex items-center justify-center mb-4 gap-2 text-lg font-bold text-gray-700">
        <FaCalendarAlt className={iconColor} />
        <span>{title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 2xl:gap-8">
        <DirectionSchedules
          directionSchedules={schedules?.to}
          direction="Up Trip"
          icon="up"
          onAdd={onAddTo}
          addSchedule={addSchedule}
          editSchedule={editSchedule}
          deleteSchedule={deleteSchedule}
          assignBus={assignBus}
          editBus={editBus}
          deleteBus={deleteBus}
          fetchSchedule={fetchSchedule}
          metadata={{ ...metadata, direction: SCHEDULE_DIRECTIONS.TO_CAMPUS }}
        />
        <DirectionSchedules
          directionSchedules={schedules?.from}
          direction="Down Trip"
          icon="down"
          onAdd={onAddFrom}
          addSchedule={addSchedule}
          editSchedule={editSchedule}
          deleteSchedule={deleteSchedule}
          assignBus={assignBus}
          editBus={editBus}
          deleteBus={deleteBus}
          fetchSchedule={fetchSchedule}
          metadata={{ ...metadata, direction: SCHEDULE_DIRECTIONS.FROM_CAMPUS }}
        />
      </div>
    </div>
  );
}
