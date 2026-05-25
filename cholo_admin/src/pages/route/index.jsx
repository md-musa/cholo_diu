import React, { useState, useEffect } from "react";
import { showSuccess, showError, showLoading, dismissToast } from "../../utils/toastUtils";
import RouteForm from "./components/RouteForm";
import RouteTable from "./components/RouteTable";
import apiClient from "../../config/axiosConfig";

const RoutePage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/routes");
      setRoutes(response.data);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to fetch routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSave = async (form, editId) => {
    const loadingToast = showLoading(editId ? "Updating route..." : "Creating route...");
    try {
      const payload = {
        ...form,
        totalDistance: form.totalDistance ? parseFloat(form.totalDistance) : undefined,
        estimatedTime: form.estimatedTime ? parseInt(form.estimatedTime) : undefined,
      };

      if (editId) {
        await apiClient.put(`/routes/${editId}`, payload);
        showSuccess("Route updated successfully");
      } else {
        await apiClient.post("/routes", payload);
        showSuccess("Route created successfully");
      }

      fetchRoutes();
      setModalOpen(false);
      setSelectedRoute(null);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save route");
    } finally {
      dismissToast(loadingToast);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    const loadingToast = showLoading("Deleting route...");
    try {
      await apiClient.delete(`/routes/${id}`);
      showSuccess("Route deleted successfully");
      fetchRoutes();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete route");
    } finally {
      dismissToast(loadingToast);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Routes Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedRoute(null);
            setModalOpen(true);
          }}
        >
          + Add Route
        </button>
      </div>

      <RouteTable
        routes={routes}
        loading={loading}
        onEdit={(route) => {
          setSelectedRoute(route);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <RouteForm
          route={selectedRoute}
          onClose={() => {
            setModalOpen(false);
            setSelectedRoute(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default RoutePage;
