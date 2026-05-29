import { FaCalendar, FaCalendarWeek } from "react-icons/fa";
import { MdDirectionsBus, MdSchedule } from "react-icons/md";

export function Header() {
  return (
    <h2 className="text-2xl text-center font-bold my-3 flex items-center gap-2">
      <FaCalendarWeek className="text-slate-700" /> Schedules
    </h2>
  );
}