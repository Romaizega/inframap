import { useEffect, useState } from "react";
import { getDevices } from "../api/devicies";
import { useNavigate } from "react-router-dom";
import AddDevice from "../components/modals/AddDeviceModal";
import { Server, Factory, TriangleAlert, X, Search, Plus } from "lucide-react";

type DeviceStatus = "ONLINE" | "OFFLINE" | "DEGRADED";

interface Device {
  id: string;
  name: string;
  type: string;
  ip_address: string | null;
  status: DeviceStatus;
  locationId: string | null;
}

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [localError, setLocalError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Load devices
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const data = await getDevices();
        setDevices(data);
      } catch {
        setLocalError("Failed to load devices");
      }
    };

    loadDevices();
  }, []);

  // SSE realtime status
  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      const {
        deviceId,
        status,
      }: {
        deviceId: string;
        status: DeviceStatus;
      } = JSON.parse(event.data);

      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId ? { ...device, status } : device,
        ),
      );
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Error timer
  useEffect(() => {
    if (!localError) return;
    const timer = setTimeout(() => {
      setLocalError("");
    }, 10000);
    return () => clearTimeout(timer);
  }, [localError]);

  const getStatusStyle = (status: DeviceStatus) => {
    if (status === "ONLINE") return "bg-green-500";
    if (status === "DEGRADED") return "bg-yellow-500";

    return "bg-red-500";
  };

  const filtered = devices
    .filter(
      (device) => statusFilter === "ALL" || device.status === statusFilter,
    )
    .filter(
      (device) =>
        device.name.toLowerCase().includes(search.toLowerCase()) ||
        device.ip_address?.toLowerCase().includes(search.toLowerCase()),
    );

  const totalDevices = devices.length;

  const onlineDevice = devices.filter(
    (device) => device.status === "ONLINE",
  ).length;

  const offlineDevice = devices.filter(
    (device) => device.status === "OFFLINE",
  ).length;

  const degradedDevice = devices.filter(
    (device) => device.status === "DEGRADED",
  ).length;

  return (
    <div className="min-h-screen p-8 text-white bg-slate-950">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Devices</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and monitor infrastructure devices
          </p>
        </div>

        <button
          className="
            flex items-center gap-2
            rounded-md
            bg-cyan-600
            px-4 py-2
            text-sm font-medium
            transition
            hover:bg-cyan-500
            cursor-pointer
          "
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={17} />
          Add Device
        </button>
      </div>

      {/* ERROR */}
      {localError && (
        <div
          className="
            mb-6
            rounded-md
            border border-red-500/20
            bg-red-500/10
            px-4 py-3
            text-sm text-red-400
          "
        >
          {localError}
        </div>
      )}

      {/* STATISTICS */}
      <div
        className="
          mb-8
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {/* TOTAL */}
        <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/20">
            <Server className="text-blue-400" size={21} />
          </div>

          <div>
            <p className="text-xl font-semibold">{totalDevices}</p>

            <p className="text-xs text-slate-400">Total Devices</p>
          </div>
        </div>

        {/* ONLINE */}
        <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/20">
            <Factory className="text-green-400" size={21} />
          </div>

          <div>
            <p className="text-xl font-semibold">{onlineDevice}</p>

            <p className="text-xs text-slate-400">Online</p>
          </div>
        </div>

        {/* DEGRADED */}
        <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-500/20">
            <TriangleAlert className="text-yellow-400" size={21} />
          </div>

          <div>
            <p className="text-xl font-semibold">{degradedDevice}</p>

            <p className="text-xs text-slate-400">Degraded</p>
          </div>
        </div>

        {/* OFFLINE */}
        <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/20">
            <X className="text-red-400" size={21} />
          </div>

          <div>
            <p className="text-xl font-semibold">{offlineDevice}</p>

            <p className="text-xs text-slate-400">Offline</p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* SEARCH */}
        <div className="relative">
          <Search
            size={16}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-500
            "
          />

          <input
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-72
              rounded-md
              border border-slate-700
              bg-slate-900
              py-2
              pl-9
              pr-3
              text-sm
              text-white
              outline-none
              placeholder:text-slate-500
              focus:border-cyan-500
            "
          />
        </div>

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="
            rounded-md
            border border-slate-700
            bg-slate-900
            px-3 py-2
            text-sm
            text-white
            outline-none
            focus:border-cyan-500
          "
        >
          <option value="ALL">All statuses</option>
          <option value="ONLINE">Online</option>
          <option value="DEGRADED">Degraded</option>
          <option value="OFFLINE">Offline</option>
        </select>
        <span className="ml-auto text-xs text-slate-500">
          {filtered.length} devices
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/70">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">IP Address</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((device) => (
              <tr
                key={device.id}
                className="
                  border-t border-slate-800
                  transition
                  hover:bg-slate-900/70
                "
              >
                <td className="px-4 py-4 font-medium">{device.name}</td>
                <td className="px-4 py-4 text-slate-400">{device.type}</td>
                <td className="px-4 py-4 font-mono text-xs text-slate-400">
                  {device.ip_address ?? "—"}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        h-2
                        w-2
                        rounded-full
                        ${getStatusStyle(device.status)}
                      `}
                    />

                    <span
                      className={
                        device.status === "ONLINE"
                          ? "text-green-400"
                          : device.status === "DEGRADED"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }
                    >
                      {device.status}
                    </span>
                  </div>
                </td>
                <td
                  className="cursor-pointer"
                  onClick={() => navigate(`/devices/${device.id}`)}
                >
                  View details
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-16 text-center text-slate-500">
                  No devices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddDevice
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => getDevices().then((data) => setDevices(data))}
      />
    </div>
  );
}
