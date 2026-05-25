import { useState, useEffect } from "react";
import apiClient from "../../config/axiosConfig";
import { showSuccess, showError } from "../../utils/toastUtils";
import { SCHEDULE_DIRECTIONS, SCHEDULE_MODES, SCHEDULE_OPERATING_DAYS, SCHEDULE_USER_TYPES } from "../../constants";
import { groupSchedule } from "../../utils/scheduleutil";
import AddScheduleModal from "../../components/AddScheduleModal";
import BusAssignModal from "../../components/AssignBusModal";
import { Header } from "./components/Header";
import { SelectionPanel } from "./components/SelectionPanel";
import { StudentSchedules } from "./components/StudentSchedules";

function SchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedMode, setSelectedMode] = useState(SCHEDULE_MODES.REGULAR);
  const [selectedRoute, setSelectedRoute] = useState("");

  const [form, setForm] = useState({
    routeId: "",
    direction: SCHEDULE_DIRECTIONS.TO_CAMPUS,
    time: "",
    userType: SCHEDULE_USER_TYPES.STUDENT,
    mode: SCHEDULE_MODES.REGULAR,
    operatingDays: SCHEDULE_OPERATING_DAYS.WEEKDAYS,
    note: "",
    serviceType: "",
  });
  const [busForm, setBusForm] = useState({
    driverId: "",
    busId: "",
    assignmentType: "fixed",
    specificDate: "",
  });

  console.log(selectedMode, selectedRoute);
  const [modalVisible, setModalVisible] = useState(false);
  const [busAssignModalVisible, setBusAssignModalVisible] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [editingBus, setEditingBus] = useState(false);
  const [scheduleMode, setScheduleMode] = useState([]);

  // ========================
  // Fetching Data
  // ========================
  const fetchRoutes = async () => {
    try {
      const routesResponse = await apiClient.get("/routes");
      setRoutes(routesResponse.data);
    } catch (err) {
      console.error("Fetch routes error:", err);
    }
  };

  const fetchSchedule = async () => {
    if (!selectedRoute) return;
    try {
      const schedulesResponse = await apiClient.get(`/schedules/admin/route/${selectedRoute}/${selectedMode}`);
      setSchedules(schedulesResponse.data);
      // showSuccess("Schedules loaded successfully");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to load schedules");
    }
  };



  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [selectedRoute, selectedMode]);

  const groupedSchedule = groupSchedule(schedules);

  // ========================
  // Schedule Functions
  // ========================

  const addSchedule = (direction, operatingDays, userType) => {
    setForm({
      ...form,
      direction,
      operatingDays,
      userType,
      routeId: selectedRoute,
      time: "",
      note: "",
      mode: selectedMode,
    });
    setModalVisible(true);
  };

  const editSchedule = (schedule) => {
    setForm({
      ...schedule,
    });
    setModalVisible(true);
    setEditingSchedule(true);
  };

  const deleteSchedule = async (scheduleId) => {
    try {
      await apiClient.delete(`/schedules/${scheduleId}`);
      showSuccess("Schedule deleted successfully");
      fetchSchedule();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete schedule");
    }
  };

  // ========================
  // Bus Functions
  // ========================

  const assignBus = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
    setBusAssignModalVisible(true);
  };

  const editBus = (scheduleId, assignment) => {
    console.log("Editing bus assignment:", assignment);
    setBusForm({
      _id: assignment?._id || "",
      driverId: assignment?.driverId?._id || "",
      busId: assignment?.busId?._id || "",
      assignmentType: assignment?.assignmentType || "fixed",
      specificDate: assignment?.specificDate || "",
    });
    setSelectedScheduleId(scheduleId);
    setBusAssignModalVisible(true);
    setEditingBus(true);
  };

  const deleteBus = async (scheduleId, assignmentId) => {
    console.log("Deleting bus assignment:", assignmentId);
    try {
      await apiClient.delete(`/assignments/${assignmentId}`);
      showSuccess("Bus deleted successfully");
      fetchSchedule();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete bus");
    }
  };

  // ========================
  // Render
  // ========================

  if (!selectedRoute) {
    return (
      <div className="p-6">
        <Header />
        <SelectionPanel
          selectedMode={selectedMode}
          selectedRoute={selectedRoute}
          routes={routes}
          onModeChange={(e) => setSelectedMode(e.target.value)}
          onRouteChange={(e) => setSelectedRoute(e.target.value)}
        />
        <div className="mt-8 text-center text-gray-500">Please select a route to view schedules.</div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <Header />

      <SelectionPanel
        selectedMode={selectedMode}
        selectedRoute={selectedRoute}
        routes={routes}
        onModeChange={(e) => setSelectedMode(e.target.value)}
        onRouteChange={(e) => setSelectedRoute(e.target.value)}
      />

      <ScheduleDisplay
        groupedSchedule={groupedSchedule}
        addSchedule={addSchedule}
        editSchedule={editSchedule}
        deleteSchedule={deleteSchedule}
        assignBus={assignBus}
        editBus={editBus}
        deleteBus={deleteBus}
        fetchSchedule={fetchSchedule}
      />

      {modalVisible && (
        <AddScheduleModal
          form={form}
          onClose={() => setModalVisible(false)}
          fetchSchedule={fetchSchedule}
          editingSchedule={editingSchedule}
          setEditingSchedule={setEditingSchedule}
        />
      )}

      {busAssignModalVisible && (
        <BusAssignModal
          scheduleId={selectedScheduleId}
          onClose={() => {
            setBusAssignModalVisible(false);
            setEditingBus(false);
          }}
          fetchSchedule={fetchSchedule}
          metadata={busForm}
          editingBus={editingBus}
          setEditingBus={setEditingBus}
        />
      )}
    </div>
  );
}

function ScheduleDisplay({
  groupedSchedule,
  addSchedule,
  editSchedule,
  deleteSchedule,
  assignBus,
  editBus,
  deleteBus,
  fetchSchedule,
}) {
  return (
    <div className="">
      <StudentSchedules
        groupedSchedule={groupedSchedule}
        addSchedule={addSchedule}
        editSchedule={editSchedule}
        deleteSchedule={deleteSchedule}
        assignBus={assignBus}
        editBus={editBus}
        deleteBus={deleteBus}
        fetchSchedule={fetchSchedule}
        metadata={{ userType: SCHEDULE_USER_TYPES.STUDENT }}
      />
    </div>
  );
}

export default SchedulePage;
