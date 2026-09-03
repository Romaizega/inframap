import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateLocation } from "../../api/locations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  location: LocationData | null;
}
interface LocationData {
  id: string;
  site: string;
  building: string | null;
  floor: string | null;
  latitude: number | null;
  longitude: number | null;
  accessinstruction: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}

export default function EditLocation({isOpen, onClose, onSuccess, location,}: Props) {
  const [site, setSite] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [accessinstruction, setAccessinstruction] = useState("");
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setSite("");
    setBuilding("");
    setFloor("");
    setLatitude("");
    setLongitude("");
    setAccessinstruction("");
    setDescription("");
    setLocalError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!location) return;
    setSite(location.site);
    setBuilding(location.building ?? "");
    setFloor(location.floor ?? "");
    setLatitude(location.latitude?.toString() ?? "");
    setLongitude(location.longitude?.toString() ?? "");
    setAccessinstruction(location.accessinstruction ?? "");
    setDescription(location.description ?? "");
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!site.trim()) {
      setLocalError("Site is required");
      return;
    }
    try {
      setIsLoading(true);
      await updateLocation(location.id, {
        site: site.trim(),
        building: building.trim() || null,
        floor: floor.trim() || null,
        latitude: latitude.trim() ? Number(latitude) : null,
        longitude: longitude.trim() ? Number(longitude) : null,
        accessinstruction: accessinstruction.trim() || null,
        description: description.trim() || null,
      });
      resetForm();
      onClose();
      onSuccess();
    } catch (error) {
      console.error(error);
      setLocalError("Failed to update location");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  if (!location) return null;

  return (
    <>
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
          w-full max-w-xl
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
              <h2 className="text-lg font-semibold text-white">Change Location</h2>

              <p className="mt-1 text-xs text-slate-500">
                Change the infrastructure site
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

              {/* SITE */}

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Site
                </label>

                <input
                  type="text"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  placeholder="Haifa Tower"
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

              {/* BUILDING / FLOOR */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Building
                  </label>

                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder="Building A"
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
                    Floor
                  </label>

                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="Roof"
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

              {/* COORDINATES */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="32.7940"
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
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="34.9896"
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

              {/* ACCESS */}

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Access Instructions
                </label>

                <textarea
                  value={accessinstruction}
                  onChange={(e) => setAccessinstruction(e.target.value)}
                  placeholder="Enter through gate 2..."
                  rows={3}
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

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Site description..."
                  rows={3}
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
                cursor-pointer
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
                cursor-pointer
              "
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
