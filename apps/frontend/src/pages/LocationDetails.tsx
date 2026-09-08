import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getLocationById,
  deleteLocation,
  uploadLocationPhoto,
  deletePhotoAPI,
} from "../api/locations";
import EditLocation from "../components/modals/EditLocationModal";
import type { Device } from "../types/device";
import RackView from "../components/RackView";

import {
  MapPin,
  Building2,
  Layers,
  Navigation,
  Info,
  Image as ImageIcon,
  Pencil,
  ArrowLeft,
  Trash2,
} from "lucide-react";

interface PhotoSite {
  id: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}

interface Location {
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
  devices?: Device[];

  photos?: PhotoSite[];
}

export default function LocationDetails() {
  const [localError, setLocalError] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const loadLocation = async () => {
    if (!id) return;
    try {
      const data = await getLocationById(id);
      console.log("LOCATION DATA:", data);
      setLocation(data);
    } catch (error) {
      console.error(error);
      setLocalError("Failed to load location");
    }
  };

  const handleDeleteLocation = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this location?"))
      return;
    try {
      await deleteLocation(id);
      navigate("/locations");
    } catch (error) {
      console.error(error);
      setLocalError("Failed to delete the location");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    try {
      await uploadLocationPhoto(id, file);
      await loadLocation();
    } catch (error) {
      console.error(error);
      setLocalError("Failed to upload photo");
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await deletePhotoAPI(id!, photoId);
      await loadLocation();
    } catch (error) {
      console.error(error);
      setLocalError("Failed to upload photo");
    }
  };

  useEffect(() => {
    if (!id) return;
    loadLocation();
  }, [id]);

  useEffect(() => {
    if (!localError) return;
    const timer = setTimeout(() => {
      setLocalError("");
    }, 10000);
    return () => clearTimeout(timer);
  }, [localError]);

  if (!location) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-slate-400">
        Loading location...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      {/* HEADER */}

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10
              items-center
              justify-center
              rounded-md
              bg-cyan-500/10
            "
          >
            <MapPin size={20} className="text-cyan-400" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{location.site}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Device location and access information
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="
            flex items-center gap-3
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
            Edit Location
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
            cursor-pointer
          "
            onClick={handleDeleteLocation}
          >
            <Trash2 size={16} />
            Delete Location
          </button>
        </div>
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
            text-sm
            text-red-400
          "
        >
          {localError}
        </div>
      )}
      <div className="">
        <button
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-6 cursor-pointer"
          onClick={() =>
            state?.fromDeviceId
              ? navigate(`/devices/${state.fromDeviceId}`)
              : navigate("/locations")
          }
        >
          <ArrowLeft size={24} />
          {state?.fromDeviceId ? "Back to device" : "Back to locations"}
        </button>
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* LEFT SIDE */}

        <div className="space-y-6 xl:col-span-2">
          {/* LOCATION INFORMATION */}

          <section
            className="
              rounded-lg
              border border-slate-800
              bg-slate-900
              p-6
            "
          >
            <h2
              className="
                mb-6
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
              "
            >
              Location Information
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem
                icon={<MapPin size={18} />}
                label="Site"
                value={location.site}
              />

              <InfoItem
                icon={<Building2 size={18} />}
                label="Building"
                value={location.building}
              />

              <InfoItem
                icon={<Layers size={18} />}
                label="Floor"
                value={location.floor}
              />

              <InfoItem
                icon={<Navigation size={18} />}
                label="Coordinates"
                value={
                  location.latitude !== null && location.longitude !== null
                    ? `${location.latitude}, ${location.longitude}`
                    : null
                }
              />
            </div>
          </section>

          {/* ACCESS INSTRUCTIONS */}

          <section
            className="
              rounded-lg
              border border-slate-800
              bg-slate-900
              p-6
            "
          >
            <h2
              className="
                mb-4
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
              "
            >
              Access Instructions
            </h2>

            <p className="text-sm leading-6 text-slate-300">
              {location.accessinstruction || "No access instructions provided."}
            </p>
          </section>

          {/* DESCRIPTION */}

          <section
            className="
              rounded-lg
              border border-slate-800
              bg-slate-900
              p-6
            "
          >
            <div className="mb-4 flex items-center gap-2">
              <Info size={17} className="text-slate-500" />

              <h2
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Description
              </h2>
            </div>

            <p className="text-sm leading-6 text-slate-300">
              {location.description || "No description provided."}
            </p>
          </section>

          {/* PHOTOS */}

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
                    Site and access photos
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

            {!location.photos?.length ? (
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
                {location.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative overflow-hidden rounded-md border border-slate-800 bg-slate-950"
                  >
                    <img
                      src={`${API_URL}${photo.path}`}
                      alt="Location"
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
          {/* MAP */}

          <section
            className="
              rounded-lg
              border border-slate-800
              bg-slate-900
              p-6
            "
          >
            <h2
              className="
                mb-4
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
              "
            >
              Map
            </h2>

            {location.latitude !== null && location.longitude !== null ? (
              <div
                className="
                    flex
                    h-44
                    items-center
                    justify-center
                    rounded-md
                    border border-slate-800
                    bg-slate-950
                  "
              >
                <div className="text-center">
                  <MapPin
                    size={28}
                    className="
                        mx-auto
                        mb-2
                        text-cyan-400
                      "
                  />

                  <p className="text-sm text-slate-300">{location.latitude}</p>

                  <p className="text-sm text-slate-300">{location.longitude}</p>
                </div>
              </div>
            ) : (
              <div
                className="
                    flex
                    h-44
                    items-center
                    justify-center
                    rounded-md
                    border border-slate-800
                    bg-slate-950
                  "
              >
                <p className="text-sm text-slate-500">
                  Coordinates are not available
                </p>
              </div>
            )}
          </section>

          {/* SYSTEM */}

          <section
            className="
              rounded-lg
              border border-slate-800
              bg-slate-900
              p-6
            "
          >
            <h2
              className="
                mb-5
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
              "
            >
              System
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-slate-500">Created</p>

                <p className="mt-1 text-sm text-slate-300">
                  {new Date(location.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Last Updated</p>

                <p className="mt-1 text-sm text-slate-300">
                  {new Date(location.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </section>
          <RackView devices={location.devices ?? []} />
        </div>
      </div>
      <EditLocation
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={loadLocation}
        location={location}
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
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-slate-500">{icon}</div>

      <div>
        <p className="text-xs text-slate-500">{label}</p>

        <p className="mt-1 text-sm text-slate-200">{value || "—"}</p>
      </div>
    </div>
  );
}
