import { FaCalendarAlt, FaRoute } from "react-icons/fa";
import { SCHEDULE_MODES } from "../../../constants";
import { getEnumLabel } from "../../../utils/scheduleutil";

export function SelectionPanel({ selectedMode, selectedRoute, routes, onModeChange, onRouteChange }) {
  return (
    <div className="bg-slate-700 border-2 border-gray-300 p-4 pb-6 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RouteSelector selectedRoute={selectedRoute} routes={routes} onRouteChange={onRouteChange} />
        <ModeSelector selectedMode={selectedMode} onModeChange={onModeChange} />
      </div>
    </div>
  );
}

function ModeSelector({ selectedMode, onModeChange }) {
  return (
    <div className="px-4">
      <label className="label text-white mb-2">
        <span className="label-text flex items-center gap-2">
          <FaCalendarAlt /> Schedule Mode
        </span>
      </label>
      <select className="select select-bordered w-full" value={selectedMode} onChange={onModeChange}>
        {Object.values(SCHEDULE_MODES).map((mode) => (
          <option key={mode} value={mode}>
            {getEnumLabel(mode)}
          </option>
        ))}
      </select>
    </div>
  );
}

function RouteSelector({ selectedRoute, routes, onRouteChange }) {
  return (
    <div className="px-4">
      <label className="label text-white mb-2">
        <span className="label-text flex items-center gap-2">
          <FaRoute /> Select Route
        </span>
      </label>
      <select className="select select-bordered w-full" value={selectedRoute} onChange={onRouteChange}>
        <option value="">Select Route</option>
        {routes.map((route) => (
          <option key={route._id} value={route._id}>
            {route.routeNo + ": " + route.routeName}
          </option>
        ))}
      </select>
    </div>
  );
}
