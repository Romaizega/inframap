import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { updateDevice } from "../../api/devicies";

type DeviceStatus = "ONLINE" | "OFFLINE" | "DEGRADED";

type DeviceType =
  | "ROUTER"
  | "SWITCH"
  | "ACCESS_POINT"
  | "SERVER"
  | "CAMERA"
  | "NVR"
  | "UPS"
  | "REPEATER"
  | "ANTENNA"
  | "SENSOR"
  | "CONTROLLER"
  | "OTHER";

interface DeviceData {
  id: string;
  name: string;
  ip_address: string | null;
  mac_address: string | null;
  manufacturer: string | null;
  status: DeviceStatus;
  type: DeviceType;
  locationId: string;
  model: string | null;
  serialNumber: string | null;
  description: string | null;
  rackUnit: number;
  rackSize: number;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  device: DeviceData | null;
}

export default function RackPosition({ isOpen, onClose, onSuccess, device }: Props) {
  const [rackUnit, setRackUnit] = useState<number>(1);
  const [rackSize, setRackSize] = useState<number>(1);
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!device) return;
    setRackUnit(device.rackUnit ?? 1);
    setRackSize(device.rackSize ?? 1);
  }, [device]);

  const resetForm = () => {
    setRackSize(1);
    setRackUnit(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!device) return;
    try {
      setIsLoading(true);
      await updateDevice(device.id, { rackUnit, rackSize });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
      setLocalError("Failed to update device");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Rack Position</h2>
            <p className="mt-1 text-xs text-slate-500">Add device into the rack</p>
          </div>
          <button type="button" onClick={handleClose} className="text-slate-500 transition hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
            
            {/* ERROR */}
            {localError && (
              <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {localError}
              </div>
            )}

            {/* RACK UNIT */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">Rack Unit (1–42)</label>
              <input
                type="number"
                min={1}
                max={42}
                value={rackUnit}
                onChange={(e) => setRackUnit(Number(e.target.value))}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-600"
              />
            </div>

            {/* RACK SIZE */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">Size (U)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={rackSize}
                onChange={(e) => setRackSize(Number(e.target.value))}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-600"
              />
            </div>

          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}