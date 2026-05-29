import React, { useState, useEffect } from "react";
import { FaBus, FaUser, FaCalendarAlt } from "react-icons/fa";
import apiClient from "../config/axiosConfig";
import { showSuccess, showError } from "../utils/toastUtils";
import moment from "moment";

function AssignBusModal({ scheduleId, onClose, fetchSchedule, metadata, editingBus, setEditingBus }) {
  const [busOptions, setBusOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [assignmentType, setAssignmentType] = useState("fixed");
  const [specificDate, setSpecificDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch bus + driver options
  useEffect(() => {
    async function fetchBuses() {
      try {
        const res = await apiClient.get("/buses");
        setBusOptions(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchDrivers() {
      try {
        const res = await apiClient.get("/auth/drivers");
        setDriverOptions(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchBuses();
    fetchDrivers();
  }, []);

  // Prefill values in edit mode
  useEffect(() => {
    if (editingBus) {
      setSelectedBus(metadata.busId || "");
      setSelectedDriver(metadata.driverId || "");
      setAssignmentType(metadata.assignmentType || "fixed");
      setSpecificDate(metadata.specificDate || "");
    }
  }, [editingBus]);

  const handleSubmit = async () => {
    if (!selectedBus) return showError("Please select a bus");
    if (assignmentType === "one-off" && !specificDate) return showError("Please select a date");

    const payload = {
      busId: selectedBus,
      scheduleId,
      assignmentType,
      specificDate: assignmentType === "one-off" ? specificDate : undefined,
    };

    if (selectedDriver) payload.driverId = selectedDriver;

    try {
      setLoading(true);

      if (editingBus) {
        console.log("meta data", metadata);
        console.log("Editing assignment with payload:", payload);
        await apiClient.put(`/assignments/${metadata._id}`, payload);
        showSuccess("Bus assignment updated successfully");
      } else {
        await apiClient.post("/assignments", payload);
        showSuccess("Bus assigned successfully");
      }

      fetchSchedule();
      onClose();
      setEditingBus(false);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to assign bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-3/6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          {editingBus ? "Edit Bus & Driver Assignment" : "Assign Bus & Driver"}
        </h3>

        {/* Bus Selection */}
        <div className="mb-4">
          <label className="label flex items-center gap-1">
            <FaBus /> Select Bus
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedBus}
            onChange={(e) => setSelectedBus(e.target.value)}
            required
          >
            <option value="">Select Bus</option>
            {busOptions.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.name.charAt(0).toUpperCase() + bus.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Driver Selection */}
        <div className="mb-4">
          <label className="label flex items-center gap-1">
            <FaUser /> Select Driver
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
          >
            <option value="">Select Driver</option>
            {driverOptions.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Type */}
        <div className="mb-4">
          <label className="label flex items-center gap-1">Assignment Type</label>
          <select
            className="select select-bordered w-full"
            value={assignmentType}
            onChange={(e) => setAssignmentType(e.target.value)}
          >
            <option value="fixed">Fixed</option>
            <option value="one-off">One-off</option>
          </select>
        </div>

        {/* Date field for One-off */}
        {assignmentType === "one-off" && (
          <div className="mb-4">
            <label className="label flex items-center gap-1">
              <FaCalendarAlt /> Select Date
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={specificDate ? moment(specificDate).format("YYYY-MM-DD") : ""}
              onChange={(e) => setSpecificDate(e.target.value)}
              min={moment().format("YYYY-MM-DD")}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-sm btn-outline btn-error" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={`btn btn-sm btn-success ${loading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : editingBus ? "Update" : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignBusModal;
