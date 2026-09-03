import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getLocations } from "../api/locations";
import AddLocation from "../components/modals/AddLocationModal";
import {
  MapPin,
  Building2,
  Layers,
  Navigation,
  Search,
  Plus,
} from "lucide-react";

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
}

export default function Locations() {
  const [localError, setLocalError] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const loadLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error(error);
      setLocalError("Failed to load locations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    if (!localError) return;

    const timer = setTimeout(() => {
      setLocalError("");
    }, 10000);

    return () => clearTimeout(timer);
  }, [localError]);

  const filteredLocations = locations.filter((location) => {
    const value = search.toLowerCase();

    return (
      location.site.toLowerCase().includes(value) ||
      location.building?.toLowerCase().includes(value) ||
      location.floor?.toLowerCase().includes(value)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-slate-400">
        Loading locations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      {/* HEADER */}

      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Locations</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage infrastructure sites and equipment locations
          </p>
        </div>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-md
            bg-cyan-600
            px-4 py-2
            text-sm
            font-medium
            transition
            hover:bg-cyan-500
            cursor-pointer
          "
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add Location
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
            text-sm
            text-red-400
          "
        >
          {localError}
        </div>
      )}

      {/* SEARCH */}

      <div className="mb-6 flex items-center justify-between">
        <div className="relative">
          <Search
            size={15}
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
            placeholder="Search locations..."
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

        <p className="text-xs text-slate-500">
          {filteredLocations.length} locations
        </p>
      </div>

      {/* EMPTY STATE */}

      {filteredLocations.length === 0 ? (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            rounded-lg
            border border-slate-800
            bg-slate-900
            py-20
          "
        >
          <MapPin size={32} className="mb-3 text-slate-600" />

          <p className="text-sm text-slate-400">No locations found</p>

          <p className="mt-1 text-xs text-slate-600">
            Add your first infrastructure location
          </p>
        </div>
      ) : (
        /* LOCATION GRID */

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              onClick={() => navigate(`/locations/${location.id}`)}
              className="
                cursor-pointer
                rounded-lg
                border border-slate-800
                bg-slate-900
                p-5
                transition
                hover:border-slate-700
                hover:bg-slate-900/80
              "
            >
              {/* CARD HEADER */}

              <div className="mb-5 flex items-start gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-cyan-500/10
                  "
                >
                  <MapPin size={19} className="text-cyan-400" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-medium text-white">
                    {location.site}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Infrastructure location
                  </p>
                </div>
              </div>

              {/* LOCATION DETAILS */}

              <div className="space-y-3">
                <LocationRow
                  icon={<Building2 size={15} />}
                  label="Building"
                  value={location.building}
                />

                <LocationRow
                  icon={<Layers size={15} />}
                  label="Floor"
                  value={location.floor}
                />

                <LocationRow
                  icon={<Navigation size={15} />}
                  label="Coordinates"
                  value={
                    location.latitude !== null && location.longitude !== null
                      ? `${location.latitude}, ${location.longitude}`
                      : null
                  }
                />
              </div>

              {/* DESCRIPTION */}

              {location.description && (
                <div className="mt-5 border-t border-slate-800 pt-4">
                  <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                    {location.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <AddLocation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadLocations}
      />
    </div>
  );
}

interface LocationRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}

function LocationRow({ icon, label, value }: LocationRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-600">{icon}</div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="text-xs text-slate-500">{label}</span>

        <span className="truncate text-xs text-slate-300">{value || "—"}</span>
      </div>
    </div>
  );
}
