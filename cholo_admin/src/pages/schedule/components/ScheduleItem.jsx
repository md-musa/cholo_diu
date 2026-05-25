import React from "react";
import moment from "moment";
import { FaBus, FaClock, FaEdit, FaTrash } from "react-icons/fa";
import AssignedBusCard from "./AssignedBusCard";

export function ScheduleItem({ schedule, editSchedule, deleteSchedule, assignBus, editBus, deleteBus, metadata }) {
  const formattedTime = schedule?.time ? moment(schedule.time, "HH:mm").format("hh:mm A") : "Not Scheduled";
  const assignedBuses = schedule?.assignedBuses || [];
  const fixedBuses = assignedBuses.filter((a) => a.assignmentType === "fixed");
  const oneOffBuses = assignedBuses.filter((a) => a.assignmentType === "one-off");

  return (
    <div className="group mb-4 relative bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Time Header */}
      <div className="p-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-md shadow-sm text-blue-500">
            <FaClock size={14} />
          </div>
          <span className="text-lg font-bold text-gray-800">{formattedTime}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => editSchedule && editSchedule(schedule)}
            className="btn btn-ghost btn-xs btn-square text-gray-500 hover:text-blue-600"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Delete this schedule?")) deleteSchedule(schedule._id);
            }}
            className="btn btn-ghost btn-xs btn-square text-gray-500 hover:text-red-600"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {schedule?.note && (
        <div className="px-3 pt-2">
          <p className="text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded inline-block">
            Note: {schedule.note}
          </p>
        </div>
      )}

      {/* Bus Assignments */}
      <div className="p-3 space-y-4">
        {/* Fixed Buses */}
        {fixedBuses.length > 0 && (
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Fixed Buses</span>
            </div>
            <div className="space-y-2">
              {fixedBuses.map((assigned) => (
                <AssignedBusCard
                  key={assigned._id}
                  scheduleId={schedule._id}
                  assigned={assigned}
                  variant="fixed"
                  onEditBus={editBus}
                  onDeleteBus={deleteBus}
                  metadata={{ ...metadata, busData: assigned }}
                />
              ))}
            </div>
          </div>
        )}

        {/* One-off Buses */}
        {oneOffBuses.length > 0 && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">One-Off Buses</span>
            </div>
            <div className="space-y-2">
              {oneOffBuses.map((assigned) => (
                <AssignedBusCard
                  key={assigned._id}
                  scheduleId={schedule._id}
                  assigned={assigned}
                  variant="one-off"
                  onEditBus={editBus}
                  onDeleteBus={deleteBus}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Add Bus */}
        {fixedBuses.length === 0 && oneOffBuses.length === 0 && (
          <div className="text-center py-2">
            <button
              onClick={() => assignBus && assignBus(schedule._id)}
              className="btn btn-xs btn-outline btn-dashed w-full text-gray-400 hover:text-primary hover:border-primary"
            >
              <FaBus /> Assign Bus
            </button>
          </div>
        )}

        {(fixedBuses.length > 0 || oneOffBuses.length > 0) && (
          <button
            onClick={() => assignBus && assignBus(schedule._id)}
            className="btn btn-xs btn-ghost w-full text-gray-400 hover:text-primary"
          >
            <FaBus /> Add Another Bus
          </button>
        )}
      </div>
    </div>
  );
}
