import { FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import { ScheduleItem } from "./ScheduleItem";

// DirectionSchedules
export function DirectionSchedules({
  directionSchedules,
  direction,
  icon,
  addSchedule,
  editSchedule,
  deleteSchedule,
  assignBus,
  editBus,
  deleteBus,
  fetchSchedule,
  metadata,
}) {
  const IconComponent = icon === "up" ? FaArrowUp : FaArrowDown;
  const iconColor = icon === "up" ? "text-emerald-600" : "text-rose-600";
  const bgColor = icon === "up" ? "bg-emerald-50" : "bg-rose-50";
  const borderColor = icon === "up" ? "border-emerald-200" : "border-rose-200";

  return (
    <div className={`rounded-xl border-1 ${borderColor} ${bgColor} p-4 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-bold text-gray-700">
          <div className={`p-2 rounded-lg bg-white shadow-sm ${iconColor}`}>
            <IconComponent />
          </div>
          <span>{direction}</span>
        </div>
        <span className="badge badge-sm badge-neutral">{directionSchedules?.length || 0} trips</span>
      </div>

      <div className="flex flex-col gap-3">
        {directionSchedules && directionSchedules.length > 0 ? (
          directionSchedules.map((schedule) => (
            <ScheduleItem
              key={schedule._id}
              schedule={schedule}
              addSchedule={addSchedule}
              editSchedule={editSchedule}
              deleteSchedule={deleteSchedule}
              assignBus={assignBus}
              editBus={editBus}
              deleteBus={deleteBus}
              fetchSchedule={fetchSchedule}
              metadata={metadata}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 text-sm py-4 italic border-2 border-dashed border-gray-200 rounded-lg">
            No schedules yet
          </div>
        )}
      </div>

      <button
        onClick={() => addSchedule(metadata.direction, metadata.operatingDays, metadata.userType)}
        className="btn btn-sm btn-ghost w-full mt-4 text-gray-600 hover:text-primary hover:bg-white/50"
      >
        <FaPlus /> Add Additional Trip
      </button>
    </div>
  );
}
