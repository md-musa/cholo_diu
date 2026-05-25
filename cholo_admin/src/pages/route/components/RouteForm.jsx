import React, { useState, useEffect } from "react";

const RouteForm = ({ route, onClose, onSave }) => {
  const [form, setForm] = useState({
    routeNo: "",
    routeName: "",
    totalDistance: "",
    estimatedTime: "",
  });

  useEffect(() => {
    if (route) {
      setForm({
        routeNo: route.routeNo,
        routeName: route.routeName,
        totalDistance: route.totalDistance || "",
        estimatedTime: route.estimatedTime || "",
      });
    }
  }, [route]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form, route?._id);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">
          {route ? "Edit Route" : "Add Route"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Route No*</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.routeNo}
                onChange={(e) => setForm({ ...form, routeNo: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Route Name*</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.routeName}
                onChange={(e) => setForm({ ...form, routeName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Total Distance (km)</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={form.totalDistance}
                onChange={(e) => setForm({ ...form, totalDistance: e.target.value })}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="label">Estimated Time (minutes)</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={form.estimatedTime}
                onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {route ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RouteForm;
