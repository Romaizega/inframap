import { useAuthStore } from "../store/authStore";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  MapPin,
  Wrench,
  LogOut,
} from "lucide-react";

export default function SideBar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
      isActive
        ? "bg-cyan-600 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 p-4 text-white">

      <div className="mb-8">
        <h1 className="text-xl font-semibold">
          InfraMap
        </h1>
        <p className="text-xs text-slate-500">
          Infrastructure Management
        </p>
      </div>

      <nav className="flex flex-col gap-2">

        <NavLink to="/dashboard" className={linkStyle}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/devices" className={linkStyle}>
          <Server size={18} />
          Devices
        </NavLink>

        <NavLink to="/locations" className={linkStyle}>
          <MapPin size={18} />
          Locations
        </NavLink>

        <NavLink to="/maintenance" className={linkStyle}>
          <Wrench size={18} />
          Maintenance
        </NavLink>

      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4">

        <div className="mb-3">
          <p className="text-sm text-white">
            {user?.first_name} {user?.last_name}
          </p>

          <p className="text-xs text-slate-500">
            {user?.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}