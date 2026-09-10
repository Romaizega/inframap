import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

interface Location {
  id: string;
  site: string;
  latitude: number | null;
  longitude: number | null;
  devices: {
    id: string
    name: string
    status: string;
  }[];
}

interface Props {
  locations: Location[];
}

export default function SiteMap({ locations }: Props) {
  const firstLocation = locations.find((l) => l.latitude && l.longitude);
  const center = firstLocation
    ? ([firstLocation.latitude!, firstLocation.longitude!] as [number, number])
    : ([32.0, 34.8] as [number, number]);

  const navigate = useNavigate();

  const getMarkerColor = (devices: { status: string }[] | undefined) => {
    if (!devices || devices.length === 0) return "gray";
    if (devices.some((d) => d.status === "OFFLINE")) return "red";
    if (devices.some((d) => d.status === "DEGRADED")) return "orange";
    return "green";
  };
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "700px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {locations
        .filter((l) => l.latitude && l.longitude && l.devices)
        .map((location) => (
          <CircleMarker
            key={location.id}
            center={[location.latitude!, location.longitude!]}
            radius={12}
            color={getMarkerColor(location.devices)}
          >
            <Popup>
              {location.site}
              <br />
              {location.devices.map((d) => (
                <div key={d.id}>
                  <button onClick={() => navigate(`/devices/${d.id}`)}
                    className="cursor-pointer">
                    {d.name} — {d.status}
                  </button>
                </div>
              ))}
              <button
                onClick={() => navigate(`/locations/${location.id}`)}
                className="cursor-pointer"
              >
                View location
              </button>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
