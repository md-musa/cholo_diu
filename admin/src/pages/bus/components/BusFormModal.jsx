import React, { useState, useEffect } from "react";

import { showSuccess, showError, showLoading, dismissToast } from "../../../utils/toastUtils";
import { BUS_STATUS, BUS_TYPES } from "../../../constants";
import apiClient from "../../../config/axiosConfig";

const BusFormModal = ({ bus, routes, drivers, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    busType: BUS_TYPES.STUDENT,
    capacity: 45,
    status: BUS_STATUS.ACTIVE,
  });

  useEffect(() => {
    if (bus) {
      setForm({
        name: bus.name,
        busType: bus.busType,
        capacity: bus.capacity,
        status: bus.status,
      });
    }
  }, [bus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = showLoading(bus ? "Updating bus..." : "Creating bus...");
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        name: form.name.toLowerCase().trim(),
      };

      if (bus) {
        await apiClient.put(`/buses/${bus._id}`, payload);
        showSuccess("Bus updated successfully");
      } else {
        await apiClient.post(`/buses`, payload);
        showSuccess("Bus created successfully");
      }

      onSuccess();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save bus");
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">{bus ? "Edit Bus" : "Add Bus"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Bus Name*</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Bus Type*</label>
              <select
                className="select select-bordered w-full"
                value={form.busType}
                onChange={(e) => setForm({ ...form, busType: e.target.value })}
                required
              >
                {Object.values(BUS_TYPES).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Capacity*</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <select
              className="select select-bordered w-full"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {Object.values(BUS_STATUS).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Assigned Route</label>
              <select
                className="select select-bordered w-full"
                value={form.assignedRouteId}
                onChange={(e) => setForm({ ...form, assignedRouteId: e.target.value })}
              >
                <option value="">None</option>
                {routes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} ({r.startLocation} → {r.endLocation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Assigned Driver</label>
              <select
                className="select select-bordered w-full"
                value={form.assignedDriverId}
                onChange={(e) => setForm({ ...form, assignedDriverId: e.target.value })}
              >
                <option value="">None</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {bus ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusFormModal;
