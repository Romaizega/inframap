import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'


interface Location {
  id: string
  site: string;
  latitude: number | null
  longitude: number | null
  devices: {
    status: string
  }[]
}

interface Props {
  locations: Location[]
}


export default function SiteMap({ locations }: Props) {

const getMarkerColor = (devices: { status: string }[] | undefined) => {
    if (!devices || devices.length === 0) return 'gray'
    if (devices.some(d => d.status === 'OFFLINE')) return 'red'
    if (devices.some(d => d.status === 'DEGRADED')) return 'orange'
    return 'green'
}
  return (
    <MapContainer center={[32.0, 34.8]} zoom={13} style={{ height: '400px', width: '100%' }}    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {locations.filter(l => l.latitude && l.longitude && l.devices).map(location => (
        <CircleMarker
        key={location.id}
          center={[location.latitude!, location.longitude!]}
          radius={10}
          color={getMarkerColor(location.devices)}
        >
          <Popup>
            {location.site} — {location.devices.length} {location.devices.length === 1 ? 'device' : 'devices'}
          </Popup>
        </CircleMarker>
      ))}

    </MapContainer>

  )
}


