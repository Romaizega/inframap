import { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, Search, User, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllLogs } from "../api/maintenance";

type MaintenanceType =
  | "INSTALLATION"
  | "COMMISSIONING"
  | "INSPECTION"
  | "PREVENTIVE"
  | "REPAIR"
  | "REPLACEMENT"
  | "UPGRADE"
  | "CONFIGURATION"
  | "RELOCATION"
  | "DECOMMISSION"
  | "EMERGENCY";

type MaintenanceResult =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "DELAYED";

interface MaintenanceLog {
  id: string;
  workType: MaintenanceType;
  workResult: MaintenanceResult;
  description: string;
  createdAt: string;
  updatedAt: string;
  plannedAt: string | null;

  device: {
    id: string;
    name: string;
    type: string;
    location: {
      id: string;
      site: string;
      building: string | null;
      floor: string | null;
    };
  };

  user: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
  };
}

export default function AllLogs() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const data = await getAllLogs();
        setLogs(data);
      } catch (error) {
        console.error(error);
        setLocalError("Failed to load maintenance logs");
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const value = search.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesSearch =
        !value ||
        log.description.toLowerCase().includes(value) ||
        log.device.name.toLowerCase().includes(value) ||
        log.device.location.site.toLowerCase().includes(value) ||
        log.workType.toLowerCase().includes(value);

      const matchesResult =
        resultFilter === "ALL" || log.workResult === resultFilter;

      return matchesSearch && matchesResult;
    });
  }, [logs, search, resultFilter]);

  const getResultStyle = (result: MaintenanceResult) => {
    switch (result) {
      case "COMPLETED":
        return "border-green-500/30 bg-green-500/10 text-green-400";
      case "IN_PROGRESS":
        return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
      case "SCHEDULED":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
      case "DELAYED":
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
      case "FAILED":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      case "CANCELLED":
        return "border-slate-600 bg-slate-800 text-slate-400";
      default:
        return "border-slate-700 bg-slate-800 text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-8 py-7 text-white">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold">Maintenance Logs</h1>

        <p className="mt-1 text-sm text-slate-500">
          Maintenance activity across all devices
        </p>
      </div>

      <div
        className="
          mb-5
          flex flex-col gap-3
          rounded-lg
          border border-slate-800
          bg-slate-900
          p-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div className="relative w-full md:max-w-md">
          <Search
            size={16}
            className="
              absolute
              left-3 top-1/2
              -translate-y-1/2
              text-slate-500
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="
              w-full
              rounded-md
              border border-slate-700
              bg-slate-950
              py-2
              pl-9 pr-3
              text-sm
              text-white
              outline-none
              placeholder:text-slate-600
              focus:border-cyan-600
            "
          />
        </div>

        <select
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
          className="
            rounded-md
            border border-slate-700
            bg-slate-950
            px-3 py-2
            text-sm
            text-slate-300
            outline-none
            focus:border-cyan-600
          "
        >
          <option value="ALL">All Results</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="DELAYED">Delayed</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {localError && (
        <div
          className="
            mb-5
            rounded-md
            border border-red-500/20
            bg-red-500/10
            px-4 py-3
            text-sm
            text-red-400
          "
        >
          {localError}
        </div>
      )}

      <div
        className="
          overflow-hidden
          rounded-lg
          border border-slate-800
          bg-slate-900
        "
      >
        {isLoading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading maintenance logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center">
            <Wrench size={32} className="mx-auto mb-3 text-slate-700" />

            <p className="text-sm text-slate-400">No maintenance logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className="
                  border-b
                  border-slate-800
                  bg-slate-950/40
                "
              >
                <tr
                  className="
                    text-left
                    text-xs
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  <th className="px-5 py-3">Device</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Result</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Performed by</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => navigate(`/devices/${log.device.id}`)}
                    className="
                      cursor-pointer
                      border-b
                      border-slate-800
                      transition
                      last:border-b-0
                      hover:bg-slate-800/50
                    "
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-200">
                        {log.device.name}
                      </div>

                      <div className="mt-1 text-xs text-slate-600">
                        {log.device.type.replaceAll("_", " ")}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      {log.workType.replaceAll("_", " ")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          border
                          px-2.5 py-1
                          text-xs
                          ${getResultStyle(log.workResult)}
                        `}
                      >
                        {log.workResult.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="max-w-xs px-5 py-4">
                      <p
                        className="truncate text-sm text-slate-400"
                        title={log.description}
                      >
                        {log.description}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <MapPin size={14} />

                        {log.device.location.site}
                      </div>

                      {log.device.location.building && (
                        <div className="mt-1 text-xs text-slate-600">
                          {log.device.location.building}

                          {log.device.location.floor &&
                            ` · ${log.device.location.floor}`}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <User size={14} />
                        {log.user.first_name} {log.user.last_name}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 whitespace-nowrap text-sm text-slate-400">
                        <Calendar size={14} />

                        {new Date(log.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoading && (
        <div className="mt-3 text-xs text-slate-600">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      )}
    </div>
  );
}
