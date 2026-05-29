import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaRoute,
  FaCalendarPlus,
  FaBus,
  FaInfo,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { FaListCheck } from "react-icons/fa6";

function Sidebar() {
  const { userData, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false); // large screen collapse
  const [drawerOpen, setDrawerOpen] = useState(false); // small screen

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Schedules", to: "/schedules", icon: <FaCalendarPlus /> },
    { label: "Buses", to: "/buses", icon: <FaBus /> },
    { label: "Routes", to: "/routes", icon: <FaRoute /> },
    { label: "Schedule Mode", to: "/schedule-mode", icon: <FaListCheck /> },
    { label: "Logs", to: "/logs", icon: <FaInfo /> },
  ];

  return (
    <>
      {/* Small device toggle button */}
      <button className="lg:hidden fixed top-4 left-4 z-50 btn btn-primary btn-sm" onClick={() => setDrawerOpen(true)}>
        ☰
      </button>

      {/* Sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-all duration-200
        ${drawerOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex h-full`}
      >
        <aside
          className={`${
            collapsed ? "w-20" : "w-72"
          } bg-slate-800 text-white flex flex-col justify-between min-h-screen shadow-lg transition-all duration-200`}
        >
          {/* Top section */}
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            {!collapsed && <h2 className="text-xl font-semibold">Cholo Admin</h2>}
            <div className="flex items-center gap-2">
              {/* Collapse toggle button for large screens */}
              <button
                className="hidden lg:flex btn btn-ghost btn-sm text-white p-1"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
              </button>

              {/* Close button for small screens */}
              <button className="lg:hidden btn btn-ghost btn-sm text-white p-1" onClick={() => setDrawerOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-4 space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150 text-sm
                  ${
                    isActive(item.to)
                      ? "bg-slate-700 text-white font-medium"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Bottom user info + logout */}
          <div className="p-4 border-t border-slate-700 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-2xl text-white" />
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{userData?.name}</span>
                  <span className="text-xs capitalize text-slate-300">{userData?.role}</span>
                </div>
              )}
            </div>
            {!collapsed && (
              <button className="btn btn-sm btn-error mt-2 flex items-center gap-2" onClick={logout}>
                <FaSignOutAlt /> Logout
              </button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

export default Sidebar;
