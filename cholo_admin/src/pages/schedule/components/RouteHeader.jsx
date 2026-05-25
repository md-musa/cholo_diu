import { FaRoute } from "react-icons/fa";

export function RouteHeader({ groupedSchedule }) {
  console.log("Rendering RouteHeader with groupedSchedule:", groupedSchedule);
  return (
    <div className="bg-primary text-primary-content p-4 rounded-t-lg">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <FaRoute /> {groupedSchedule.route?.name || "Unknown Route"}
      </h3>
      <p className="text-sm opacity-90">{groupedSchedule.route?.endLocation}</p>
    </div>
  );
}
