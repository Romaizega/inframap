import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDeviceById,
  deleteDevice,
  uploadDEvicePhoto,
  deletePhotoDEvice,
} from "../api/devicies";
import EditDevice from "../components/modals/EditDeviceModal";
import RackPosition from "../components/modals/RackPositionModal";
import {
  Server,
  Network,
  Cpu,
  Hash,
  MapPin,
  Calendar,
  Pencil,
  ArrowLeft,
  ScrollText,
  Trash2,
  ImageIcon,
} from "lucide-react";

type DeviceStatus = "ONLINE" | "OFFLINE" | "DEGRADED";

interface PhotoDEvice {
  id: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}
interface Device {
  id: string;
  name: string;
  type: string;
  ip_address: string | null;
  mac_address: string | null;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  description: string | null;
  status: DeviceStatus;
  locationId: string | null;
  rackUnit: number | null;
  rackSize: number | null;
  createdAt: Date;
  updatedAt: Date;

  photos?: PhotoDEvice[];
}

export default function DeviceDetail() {
  const [localError, setLocalError] = useState("");
  const [device, setDevice] = useState<Device | null>(null);
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const { id } = useParams();

  const loadDeviceId = async () => {
    if (!id) return;
    try {
      const data = await getDeviceById(id);
      setDevice(data);
    } catch (error) {
      console.error(error);
      setLocalError("Failed to load the device");
    }
  };

  const handleDeleteDevice = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this device?")) return;
    try {
      await deleteDevice(id);
      navigate("/devices");
    } catch (error) {
      console.error(error);
      setLocalError("Failed to delete the device");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    try {
      await uploadDEvicePhoto(id, file);
      loadDeviceId();
    } catch (error) {
      console.error(error);
      setLocalError("Failed to upload photo");
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await deletePhotoDEvice(id!, photoId);
      loadDeviceId();
    } catch (error) {
      console.error(error);
      setLocalError("Failed to upload photo");
    }
  };

  useEffect(() => {
    if (!id) return;
    loadDeviceId();
  }, [id]);

  useEffect(() => {
    if (!localError) return;
    const timer = setTimeout(() => {
      setLocalError("");
    }, 10000);
    return () => clearTimeout(timer);
  }, [localError]);

  const getStatusStyle = (status: DeviceStatus) => {
    if (status === "ONLINE") {
      return {
        dot: "bg-green-500",
        text: "text-green-400",
        background: "bg-green-500/10",
        border: "border-green-500/20",
      };
    }

    if (status === "DEGRADED") {
      return {
        dot: "bg-yellow-500",
        text: "text-yellow-400",
        background: "bg-yellow-500/10",
        border: "border-yellow-500/20",
      };
    }

    return {
      dot: "bg-red-500",
      text: "text-red-400",
      background: "bg-red-500/10",
      border: "border-red-500/20",
    };
  };

  if (!device) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-slate-400">
        Loading device...
      </div>
    );
  }

  const statusStyle = getStatusStyle(device.status);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      {/* HEADER */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{device.name}</h1>

            <div
              className={`
                flex items-center gap-2
                rounded-full
                border
                px-3 py-1
                text-xs font-medium
                ${statusStyle.background}
                ${statusStyle.border}
                ${statusStyle.text}
              `}
            >
              <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />

              {device.status}
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Device details and infrastructure information
          </p>
        </div>

        <div className="flex flex-col gap-2">
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
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil size={16} />
            Edit Device
          </button>
          <button
            className="
            flex items-center gap-2
            rounded-md
            bg-red-600
            hover:bg-red-500
            px-4 py-2
            text-sm font-medium
            transition
            hover:bg-cyan-500
            cursor-pointer
          "
            onClick={handleDeleteDevice}
          >
            <Trash2 size={16} />
            Delete Device
          </button>
        </div>
      </div>

      {/* ERROR */}
      {localError && (
        <div className="mb-6 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {localError}
        </div>
      )}
      <div className="">
        <button
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-6 cursor-pointer"
          onClick={() => navigate("/devices")}
        >
          <ArrowLeft size={24} />
          Back to devices
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* LEFT SIDE */}
        <div className="space-y-6 xl:col-span-2">
          {/* DEVICE INFO */}
          <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Device Information
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem
                icon={<Server size={18} />}
                label="Type"
                value={device.type}
              />

              <InfoItem
                icon={<Cpu size={18} />}
                label="Manufacturer"
                value={device.manufacturer}
              />

              <InfoItem
                icon={<Cpu size={18} />}
                label="Model"
                value={device.model}
              />

              <InfoItem
                icon={<Hash size={18} />}
                label="Serial Number"
                value={device.serialNumber}
              />
            </div>
          </section>

          {/* NETWORK */}
          <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Network
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem
                icon={<Network size={18} />}
                label="IP Address"
                value={device.ip_address}
                mono
              />

              <InfoItem
                icon={<Network size={18} />}
                label="MAC Address"
                value={device.mac_address}
                mono
              />
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Description
            </h2>

            <p className="text-sm leading-6 text-slate-300">
              {device.description || "No description provided."}
            </p>
          </section>
          <section
            className="
              rounded-lg
              border border-slate-800
              bg-slate-900
              p-6
            "
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-slate-500" />

                <div>
                  <h2
                    className="
                      text-sm
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Photos
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Device photos
                  </p>
                </div>
              </div>

              <button
                className="
                  rounded-md
                  bg-cyan-600
                  px-3 py-2
                  text-sm
                  font-medium
                  transition
                  hover:bg-cyan-500
                  cursor-pointer
                "
                onClick={() => photoInputRef.current?.click()}
              >
                + Add Photo
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            {/* NO PHOTOS */}

            {!device.photos?.length ? (
              <div
                className="
                  flex
                  h-40
                  flex-col
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-dashed
                  border-slate-700
                  bg-slate-950
                "
              >
                <ImageIcon size={28} className="mb-2 text-slate-600" />

                <p className="text-sm text-slate-500">No photos added</p>

                <p className="mt-1 text-xs text-slate-600">
                  Add photos to help technicians find the location
                </p>
              </div>
            ) : (
              /* PHOTO GRID */

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {device.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative overflow-hidden rounded-md border border-slate-800 bg-slate-950"
                  >
                    <img
                      src={`${API_URL}${photo.path}`}
                      alt="device"
                      className="h-40 w-full object-cover transition hover:scale-[1.02] cursor-pointer"
                      onClick={() =>
                        setSelectedPhoto(`${API_URL}${photo.path}`)
                      }
                    />

                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-2 right-2 rounded-md bg-red-600/80 p-1.5 text-white transition hover:bg-red-500 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="px-3 py-2">
                      <p className="text-xs text-slate-500">
                        {new Date(photo.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Maintenance */}
          <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-2">
              <MapPin size={18} className="text-cyan-400" />

              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Location
              </h2>
            </div>

            {device.locationId ? (
              <>
                <p className="text-sm text-slate-300">Location assigned</p>

                <p className="mt-2 font-mono text-xs text-slate-500">
                  {device.locationId}
                </p>

                <button
                  className="
                    mt-5
                    w-full
                    rounded-md
                    border border-slate-700
                    bg-slate-800
                    px-3 py-2
                    text-sm
                    transition
                    hover:border-cyan-500
                    cursor-pointer
                  "
                  onClick={() =>
                    navigate(`/locations/${device.locationId}`, {
                      state: { fromDeviceId: id },
                    })
                  }
                >
                  Open Location
                </button>
              </>
            ) : (
              <p className="text-sm text-slate-500">No location assigned</p>
            )}
          </section>
          {/* RACK POSITION */}
          <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-2">
              <Server size={18} className="text-cyan-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Rack Position
              </h2>
            </div>

            {device.rackUnit ? (
              <>
                <p className="text-sm text-slate-300">
                  Unit: U{device.rackUnit} — U
                  {device.rackUnit + (device.rackSize ?? 1) - 1}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Size: {device.rackSize}U
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500">Not assigned to a rack</p>
            )}

            <button
              className="mt-5 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm transition hover:border-cyan-500 cursor-pointer"
              onClick={() => {
                setIsRackModalOpen(true);
              }}
            >
              {device.rackUnit ? "Edit Rack Position" : "Add to Rack"}
            </button>
          </section>
          <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-2">
              <ScrollText size={18} className="text-cyan-400" />

              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Maintenance Logs
              </h2>
            </div>

            <p className="mt-2 font-mono text-xs text-slate-500">{id}</p>

            <button
              onClick={() => navigate(`/devices/${id}/maintenance-logs`)}
              className="
                mt-5
                w-full
                rounded-md
                border border-slate-700
                bg-slate-800
                px-3 py-2
                text-sm
                transition
                hover:border-cyan-500
                cursor-pointer
              "
            >
              Open Maintenance Logs
            </button>
          </section>

          {/* SYSTEM */}
          <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-2">
              <Calendar size={18} className="text-slate-400" />

              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                System
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-slate-500">Created</p>

                <p className="mt-1 text-sm text-slate-300">
                  {new Date(device.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Last Updated</p>

                <p className="mt-1 text-sm text-slate-300">
                  {new Date(device.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <EditDevice
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={loadDeviceId}
        device={device}
      />
      <RackPosition
        isOpen={isRackModalOpen}
        onClose={() => setIsRackModalOpen(false)}
        onSuccess={loadDeviceId}
        device={device}
      />
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Full size"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  mono?: boolean;
}

function InfoItem({ icon, label, value, mono = false }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-slate-500">{icon}</div>

      <div>
        <p className="text-xs text-slate-500">{label}</p>

        <p
          className={`
            mt-1 text-sm text-slate-200
            ${mono ? "font-mono" : ""}
          `}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
