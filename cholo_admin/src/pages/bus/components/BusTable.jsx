import React from "react";
import { BUS_STATUS } from "../../../constants";

const BusTable = ({ buses, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="table w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Status</th>
            {/* <th>Route</th>
            <th>Driver</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus, idx) => (
            <tr key={bus._id}>
              <td>{idx + 1}</td>
              <td className="capitalize">{bus.name}</td>
              <td className="capitalize">{bus?.busType || '-'}</td>
              <td>{bus?.capacity || '-'}</td>
              <td>
                <span
                  className={`badge capitalize ${
                    bus.status === BUS_STATUS.ACTIVE
                      ? "badge-success"
                      : bus.status === BUS_STATUS.MAINTENANCE
                      ? "badge-warning"
                      : "badge-error"
                  }`}
                >
                  {bus.status}
                </span>
              </td>
              {/* <td>{bus.assignedRouteId?.name || "-"}</td>
              <td>{bus.assignedDriverId?.name || "-"}</td> */}
              <td className="flex space-x-1">
                <button className="btn btn-sm btn-outline btn-info" onClick={() => onEdit(bus)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-outline btn-error" onClick={() => onDelete(bus._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {buses.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No buses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BusTable;
