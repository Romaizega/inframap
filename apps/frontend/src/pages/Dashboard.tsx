import { useState, useEffect } from "react"
import { getDevices } from "../api/devicies"
import { getLocations } from "../api/locations";
import { Server, Factory, TriangleAlert, X } from 'lucide-react';
import SiteMap from "../components/map/SiteMap"


type DeviceStatus = "ONLINE" | "OFFLINE" | "DEGRADED"

interface Device {
  id: string,
  name: string,
  type: string,
  ip_address: string | null,
  status: DeviceStatus
  locationId: string | null
}

interface SiteLocation {
    id: string
    site: string
    latitude: number | null
    longitude: number | null
    devices: { status: string }[]
}

export default function Dashboard() {

  const [devices, setDevices] = useState<Device[]>([])
  const [localError, setLocalError] = useState('')
  const [locations, setLocations] = useState<SiteLocation[]>([])

  useEffect(() => {
    getDevices().then(data => setDevices(data))
  }, [])

  useEffect(() => {
    getLocations().then(data => setLocations(data))

  }, [])

  useEffect(() => {
    const eventSource = new EventSource('/api/events')

    eventSource.onmessage = (e) => {
      const { deviceId, status } = JSON.parse(e.data)
      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId
            ? { ...device, status }
            : device
        )
      )
    }

    return () => eventSource.close()
  }, [])

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  // const getStatusStyle = (status: string) => {
  //   if (status === 'ONLINE') return 'bg-green-500'
  //   if (status === 'DEGRADED') return 'bg-yellow-500'
  //   return 'bg-red-500'
  // }

  const totalDevices = devices.length
  const onlineDevice = devices.filter(dev => dev.status === 'ONLINE').length
  const offlineDevice = devices.filter(dev => dev.status === 'OFFLINE').length
  const degradedDevice = devices.filter(dev => dev.status === 'DEGRADED').length

  const locationsWithDevices = locations.map(location => ({
    ...location,
    devices: devices.filter(d => d.locationId === location.id)
}))

  return (
    <>
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <h1 className="mb-6 text-2xl font-semibold">
          Dashboard
        </h1>

        {localError && (
          <p className="mb-4 text-red-400">
            {localError}
          </p>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Devices */}
          <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
              <Server className="text-blue-400" size={24} />
            </div>

            <div>
              <p className="text-2xl font-semibold text-white">
                {totalDevices}
              </p>

              <p className="text-xs text-slate-400">
                Total Devices
              </p>
            </div>

          </div>


          {/* Online */}
          <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <Factory className="text-green-400" size={24} />
            </div>

            <div>
              <p className="text-2xl font-semibold text-white">
                {onlineDevice}
              </p>

              <p className="text-xs text-slate-400">
                Online
              </p>
            </div>

          </div>


          {/* Degraded */}
          <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
              <TriangleAlert className="text-yellow-400" size={24} />
            </div>

            <div>
              <p className="text-2xl font-semibold text-white">
                {degradedDevice}
              </p>

              <p className="text-xs text-slate-400">
                Degraded
              </p>
            </div>

          </div>


          {/* Offline */}
          <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <X className="text-red-400" size={24} />
            </div>

            <div>
              <p className="text-2xl font-semibold text-white">
                {offlineDevice}
              </p>

              <p className="text-xs text-slate-400">
                Offline
              </p>
            </div>

          </div>

        </div>
        {/* <SiteMap locations={locations} /> */}
        <SiteMap locations={locationsWithDevices} />

        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="rounded-lg border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">
                  {device.name}
                </h2>

                <div
                  className={`h-3 w-3 rounded-full ${getStatusStyle(
                    device.status
                  )}`}
                />
              </div>

              <p className="mt-2 text-sm text-slate-400">
                {device.type}
              </p>

              {device.ip_address && (
                <p className="mt-1 text-sm text-slate-500">
                  {device.ip_address}
                </p>
              )}

              <p className="mt-4 text-xs text-slate-400">
                {device.status}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </>
  )
}