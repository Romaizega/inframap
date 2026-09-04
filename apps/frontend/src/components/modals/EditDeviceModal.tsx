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
  createdAt: string;
  updatedAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  device: DeviceData | null;
}

export default function EditDevice({
  isOpen,
  onClose,
  onSuccess,
  device,
}: Props) {
  const [name, setName] = useState("");
  const [ip_address, setIp_address] = useState("");
  const [mac_address, setMac_address] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [status, setStatus] = useState<DeviceStatus>("OFFLINE");
  const [type, setType] = useState<DeviceType>("OTHER");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");

  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!device) return;
    setName(device.name);
    setIp_address(device.ip_address ?? "");
    setMac_address(device.mac_address ?? "");
    setManufacturer(device.manufacturer ?? "");
    setStatus(device.status);
    setType(device.type);
    setModel(device.model ?? "");
    setSerialNumber(device.serialNumber ?? "");
    setDescription(device.description ?? "");
  }, [device]);

  const resetForm = () => {
    setName("");
    setIp_address("");
    setMac_address("");
    setManufacturer("");
    setStatus("OFFLINE");
    setType("OTHER");
    setModel("");
    setSerialNumber("");
    setDescription("");
    setLocalError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!device) return;
    if (!name.trim()) {
      setLocalError("Name is required");
      return;
    }
    try {
      setIsLoading(true);
      await updateDevice(device.id, {
        name: name.trim(),
        ip_address: ip_address.trim() || null,
        mac_address: mac_address.trim() || null,
        manufacturer: manufacturer.trim() || null,
        status,
        type,
        model: model.trim() || null,
        serialNumber: serialNumber.trim() || null,
        description: description.trim() || null,
      });

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
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60
        px-4
      "
    >
      <div
        className="
          w-full max-w-2xl
          rounded-lg
          border border-slate-800
          bg-slate-900
        "
      >
        {/* HEADER */}

        <div
          className="
            flex items-center justify-between
            border-b border-slate-800
            px-6 py-4
          "
        >
          <div>
            <h2 className="text-lg font-semibold text-white">Edit Device</h2>

            <p className="mt-1 text-xs text-slate-500">
              Update device information
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="
              text-slate-500
              transition
              hover:text-white
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <div
            className="
              max-h-[70vh]
              space-y-5
              overflow-y-auto
              px-6 py-5
            "
          >
            {/* ERROR */}

            {localError && (
              <div
                className="
                  rounded-md
                  border border-red-500/20
                  bg-red-500/10
                  px-3 py-2
                  text-sm text-red-400
                "
              >
                {localError}
              </div>
            )}

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Device Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Router Alpha"
                className="
                  w-full
                  rounded-md
                  border border-slate-700
                  bg-slate-950
                  px-3 py-2
                  text-sm text-white
                  outline-none
                  placeholder:text-slate-600
                  focus:border-cyan-600
                "
              />
            </div>

            {/* TYPE / STATUS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Device Type
                </label>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as DeviceType)}
                  className="
                    w-full
                    rounded-md
                    border border-slate-700
                    bg-slate-950
                    px-3 py-2
                    text-sm text-white
                    outline-none
                    focus:border-cyan-600
                  "
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
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DeviceStatus)}
                  className="
                    w-full
                    rounded-md
                    border border-slate-700
                    bg-slate-950
                    px-3 py-2
                    text-sm text-white
                    outline-none
                    focus:border-cyan-600
                  "
                >
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="DEGRADED">Degraded</option>
                </select>
              </div>
            </div>

            {/* IP / MAC */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  IP Address
                </label>

                <input
                  type="text"
                  value={ip_address}
                  onChange={(e) => setIp_address(e.target.value)}
                  placeholder="192.168.1.10"
                  className="
                    w-full
                    rounded-md
                    border border-slate-700
                    bg-slate-950
                    px-3 py-2
                    text-sm text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-cyan-600
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  MAC Address
                </label>

                <input
                  type="text"
                  value={mac_address}
                  onChange={(e) => setMac_address(e.target.value)}
                  placeholder="AA:BB:CC:DD:EE:FF"
                  className="
                    w-full
                    rounded-md
                    border border-slate-700
                    bg-slate-950
                    px-3 py-2
                    text-sm text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-cyan-600
                  "
                />
              </div>
            </div>

            {/* MANUFACTURER / MODEL */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Manufacturer
                </label>

                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="Cisco"
                  className="
                    w-full
                    rounded-md
                    border border-slate-700
                    bg-slate-950
                    px-3 py-2
                    text-sm text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-cyan-600
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Model
                </label>

                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="ISR 4331"
                  className="
                    w-full
                    rounded-md
                    border border-slate-700
                    bg-slate-950
                    px-3 py-2
                    text-sm text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-cyan-600
                  "
                />
              </div>
            </div>

            {/* SERIAL NUMBER */}

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Serial Number
              </label>

              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="SN12345678"
                className="
                  w-full
                  rounded-md
                  border border-slate-700
                  bg-slate-950
                  px-3 py-2
                  text-sm text-white
                  outline-none
                  placeholder:text-slate-600
                  focus:border-cyan-600
                "
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Device description..."
                rows={4}
                className="
                  w-full
                  resize-none
                  rounded-md
                  border border-slate-700
                  bg-slate-950
                  px-3 py-2
                  text-sm text-white
                  outline-none
                  placeholder:text-slate-600
                  focus:border-cyan-600
                "
              />
            </div>
          </div>

          {/* FOOTER */}

          <div
            className="
              flex justify-end gap-3
              border-t border-slate-800
              px-6 py-4
            "
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="
                rounded-md
                border border-slate-700
                px-4 py-2
                text-sm text-slate-300
                transition
                hover:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="
                rounded-md
                bg-cyan-600
                px-4 py-2
                text-sm font-medium text-white
                transition
                hover:bg-cyan-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
