import React from "react";
import { FaBus, FaUser, FaEdit, FaTrash, FaClock, FaWheelchair, FaUserCircle } from "react-icons/fa";

export default function AssignedBusCard({ scheduleId, assigned, variant = "fixed", onEditBus, onDeleteBus, metadata }) {
  const busName = assigned?.busId?.name || "Bus Not Assigned";
  const driverName = assigned?.driverId?.name || "Not Assigned";
  const dateLabel = assigned?.specificDate ? new Date(assigned.specificDate).toLocaleDateString() : null;

  // border color depends on variant but card bg remains white as requested
  const borderClass = variant === "one-off" ? "border-yellow-200" : "border-gray-200";

  return (
    <div
      className={`relative bg-white ${borderClass} border border-gray-300 rounded-md py-2 my-2 px-2 group`}
      role="group"
      aria-label={`Assignment for ${busName}`}
      tabIndex={0}
    >
      <div className="">
        {/* Bus column */}
        <div className="flex items-center gap-3 min-w-0">
          <FaBus className={variant === "one-off" ? "text-yellow-600" : "text-green-600"} />
          <p className="capitalize font-semibold">{busName}</p>
        </div>

        {/* Driver column */}
        <div className="flex items-center gap-3 min-w-0">
          <FaUserCircle className="text-gray-500" />
          <div className="min-w-0">
            <div className="text-sm truncate" title={driverName}>
              {driverName}
            </div>
            <div className="text-xs text-gray-400">Driver</div>
          </div>
        </div>

        {/* Date column */}
        {dateLabel && (
          <div className="flex items-center justify-start">
            <FaClock className="text-gray-500" />
            <div className="text-sm ml-2 text-gray-500">{dateLabel || "No Date"}</div>
          </div>
        )}
      </div>

      {/* Absolute action buttons on the right (centered vertically).
          Hidden by default; visible on hover or focus within the card. */}
      <div
        className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col gap-2
                   opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150"
        aria-hidden={!onEditBus && !onDeleteBus}
      >
        <button
          type="button"
          onClick={() => onEditBus && onEditBus(scheduleId, assigned)}
          title="Edit assignment"
          className="btn btn-ghost btn-xs p-2"
          aria-label={`Edit assignment for ${busName}`}
        >
          <FaEdit />
        </button>

        <button
          type="button"
          onClick={() => {
            if (typeof onDeleteBus === "function") {
              if (window.confirm(`Delete assignment for ${busName}?`)) onDeleteBus(scheduleId, assigned._id);
            }
          }}
          title="Delete assignment"
          className="btn btn-ghost btn-xs p-2 text-red-600"
          aria-label={`Delete assignment for ${busName}`}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
