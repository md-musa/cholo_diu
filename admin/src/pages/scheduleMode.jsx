import React, { useState, useEffect } from "react";
import apiClient from "../config/axiosConfig";
import { SCHEDULE_MODES } from "../constants";
import { showError, showSuccess } from "../utils/toastUtils";
// import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

const ScheduleMode = () => {
  const [selectedMode, setSelectedMode] = useState("");
  const [currentMode, setCurrentMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Fetch current schedule mode on mount
  useEffect(() => {
    const fetchCurrentMode = async () => {
      try {
        setFetching(true);
        setError("");
        const response = await apiClient.get("/schedule-modes");
        if (response.data && response.data.modeKey) {
          setCurrentMode(response.data.modeKey);
          setSelectedMode(response.data.modeKey);
        }
      } catch (err) {
        console.error("Failed to fetch current mode:", err);
        setError("Failed to load current schedule mode. Please refresh the page.");
        showError("Failed to load current schedule mode");
      } finally {
        setFetching(false);
      }
    };

    fetchCurrentMode();
  }, []);

  const handleUpdate = async () => {
    if (!selectedMode) {
      showError("Please select a schedule mode");
      return;
    }

    if (selectedMode === currentMode) {
      showError("This mode is already active");
      return;
    }

    const modeLabel = selectedMode.replace("_", " ").toUpperCase();
    const confirmUpdate = window.confirm(`Are you sure you want to change the schedule mode to "${modeLabel}"?`);
    if (!confirmUpdate) return;

    setLoading(true);
    setError("");
    try {
      await apiClient.put("/schedule-modes", { modeKey: selectedMode });
      setCurrentMode(selectedMode);
      showSuccess("Schedule mode updated successfully!");
    } catch (err) {
      console.error("Error updating schedule mode:", err);
      const errorMsg = err.response?.data?.message || "Failed to update schedule mode. Please try again.";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getModeLabel = (mode) => {
    return mode.replace(/_/g, " ").toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-12 px-4">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-center mb-2 text-primary-1000">Schedule Mode</h1>
          <p className="text-center text-gray-500 text-sm mb-8">Manage the active schedule mode for your institution</p>

          {/* Currently Active Mode */}
          <div className="mb-8 p-4 bg-primary-50 border-l-4 border-primary-1000 rounded">
            <p className="text-sm text-gray-600 mb-1">Currently Active Mode</p>
            {fetching ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : currentMode ? (
              <p className="text-xl font-bold text-primary-1000">{getModeLabel(currentMode)}</p>
            ) : (
              <p className="text-gray-500">Unable to load current mode</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">⚠️ {error}</div>
          )}

          {/* Mode Selection Section */}
          {!fetching && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select New Mode</label>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  disabled={loading}
                  className="select select-bordered w-full text-base focus:border-primary-1000 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="" disabled>
                    Choose a mode...
                  </option>
                  {Object.entries(SCHEDULE_MODES).map(([key, value]) => (
                    <option key={key} value={value}>
                      {getModeLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Update Button */}
              <button
                onClick={handleUpdate}
                disabled={loading || !selectedMode || selectedMode === currentMode}
                className={`btn w-full text-white font-semibold gap-2 ${
                  loading
                    ? "btn-disabled bg-gray-400"
                    : selectedMode === currentMode
                    ? "btn-disabled bg-gray-400"
                    : "btn-primary bg-primary-1000 border-primary-1000 hover:bg-primary-900"
                }`}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating Mode...
                  </>
                ) : (
                  "Update Schedule Mode"
                )}
              </button>
            </>
          )}

          {/* Loading skeleton */}
          {fetching && (
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleMode;
