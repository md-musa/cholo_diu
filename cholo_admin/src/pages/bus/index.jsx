import React, { useState, useEffect } from "react";
import { showSuccess, showError, showLoading, dismissToast } from "../../utils/toastUtils";
import BusFormModal from "./components/BusFormModal";
import BusTable from "./components/BusTable";
import apiClient from "../../config/axiosConfig";

const BusPage = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editBus, setEditBus] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [busesRes, routesRes, driversRes] = await Promise.all([
        apiClient.get("/buses"),
        // apiClient.get("/routes"),
        // apiClient.get("/drivers"),
      ]);

      setBuses(busesRes.data);
      setRoutes([]);
      setDrivers([]);

    } catch (err) {
      dismissToast();
      showError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;
    const toastId = showLoading("Deleting bus...");
    try {
      await apiClient.delete(`/buses/${id}`);
      showSuccess("Bus deleted successfully");
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete bus");
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Buses</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Add Bus
        </button>
      </div>

      <BusTable buses={buses} loading={loading} onEdit={setEditBus} onDelete={handleDelete} />

      {/* Modal for Add/Edit */}
      {showModal || editBus ? (
        <BusFormModal
          routes={routes}
          drivers={drivers}
          bus={editBus}
          onClose={() => {
            setShowModal(false);
            setEditBus(null);
          }}
          onSuccess={() => {
            fetchData();
            setShowModal(false);
            setEditBus(null);
          }}
        />
      ) : null}
    </div>
  );
};

export default BusPage;
