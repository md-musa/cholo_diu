import React, { useState } from "react";
import { FaClock, FaStickyNote } from "react-icons/fa";
import moment from "moment";
import apiClient from "../config/axiosConfig";
import { showSuccess, showError } from "../utils/toastUtils";

function AddScheduleModal({ form, onClose, fetchSchedule, editingSchedule, setEditingSchedule }) {
  const [time, setTime] = useState(form.time || "");
  const [note, setNote] = useState(form.note || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!time) return showError("Time is required");

    const payload = {
      routeId: form.routeId,
      direction: form.direction,
      time: moment(time, "HH:mm").format("HH:mm"),
      userType: form.userType,
      mode: form.mode,
      operatingDays: form.operatingDays,
      note,
    };

    console.log("Submitting schedule:", payload);

    try {
      setLoading(true);

      let res;
      if (editingSchedule) {
        res = await apiClient.put(`/schedules/${form._id}`, payload);
        showSuccess("Schedule updated successfully");
      } else {
        res = await apiClient.post("/schedules", payload);
        showSuccess("Schedule added successfully");
      }

      fetchSchedule();
      onClose();
      setEditingSchedule(false);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-3/6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{editingSchedule ? "Edit Schedule" : "Add Schedule"}</h3>

        {/* Time */}
        <div className="mb-4">
          <label className="label flex items-center gap-1">
            <FaClock /> Time
          </label>
          <input
            type="time"
            className="input input-bordered w-full"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="label flex items-center gap-1">
            <FaStickyNote /> Note
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-sm btn-outline btn-error" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button
            className={`btn mx-2 btn-sm btn-success ${loading ? "loading-xs" : ""}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddScheduleModal;
