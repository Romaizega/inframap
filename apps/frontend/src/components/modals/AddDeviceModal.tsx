import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getLocations } from "../../api/locations";
import { createDevice } from "../../api/devicies";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Location {
  id: string;
  site: string;
  building: string | null;
}

export default function AddDevice({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("OTHER");
  const [locationId, setLocationId] = useState("");
  const [ip_address, setIpAddress] = useState("");
  const [localError, setLocalError] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    getLocations().then((data) => setLocations(data));
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!name || !locationId) {
      setLocalError("Name and location are required");
      return;
    }

    try {
      await createDevice({ name, type, locationId, ip_address });
      onSuccess();
      onClose();
    } catch {
      setLocalError("Failed to create device");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-slate-800 bg-slate-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Add Device</h2>
            <p className="mt-1 text-xs text-slate-500">
              Add new infrastructure equipment
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 transition hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
            {localError && (
              <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {localError}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Device name
              </label>
              <input
                type="text"
                placeholder="Router Alpha"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Device type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-600"
              >
                <option value="ROUTER">Router</option>
                <option value="SWITCH">Switch</option>
                <option value="ACCESS_POINT">Access Point</option>
                <option value="SERVER">Server</option>
                <option value="CAMERA">Camera</option>
                <option value="NVR">NVR</option>
                <option value="UPS">UPS</option>
                <option value="REPEATER">Repeater</option>
                <option value="ANTENNA">Antenna</option>
                <option value="SENSOR">Sensor</option>
                <option value="CONTROLLER">Controller</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Location
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-600"
              >
                <option value="">Select location...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.site} — {loc.building}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                IP Address
              </label>
              <input
                type="text"
                placeholder="192.168.1.10"
                value={ip_address}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500 cursor-pointer"
            >
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
