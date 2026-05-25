import React from "react";

const RouteTable = ({ routes, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Route No</th>
            <th>Route Name</th>
            <th>Distance</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route._id}>
              <td>{route.routeNo}</td>
              <td>{route.routeName}</td>
              <td>{route.totalDistance || "-"} km</td>
              <td>{route.estimatedTime || "-"} min</td>
              <td className="flex space-x-1">
                <button
                  onClick={() => onEdit(route)}
                  className="btn btn-sm btn-outline btn-info"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(route._id)}
                  className="btn btn-sm btn-outline btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {routes.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No routes found. Add a new route to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RouteTable;
