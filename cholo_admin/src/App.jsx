import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import Logs from "./pages/Logs";
import SchedulePage from "./pages/schedule";
import BusPage from "./pages/bus";
import RoutePage from "./pages/route";
import ScheduleMode from "./pages/scheduleMode";
import NotFound from "./pages/NotFound";

const DashboardLayout = () => {
  return (
    <div className="mx-auto">
      <div className="grid grid-cols-[1fr_4fr]">
        <Sidebar />
        <div className="">
          <Routes>
            <Route path="/schedules" element={<SchedulePage />} />
            <Route path="/routes" element={<RoutePage />} />
            <Route path="/buses" element={<BusPage />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/schedule-mode" element={<ScheduleMode />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/*" element={<DashboardLayout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
