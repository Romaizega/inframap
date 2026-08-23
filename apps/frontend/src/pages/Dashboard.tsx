import { useState, useEffect } from "react"
import { getDevices } from "../api/devicies"

type DeviceStatus = "ONLINE" | "OFFLINE" | "DEGRADED"

interface Device  {
  id: string,
  name: string,
  type: string,
  ip_address: string | null,
  status: DeviceStatus
}

export default function Dashboard() {

  const [devices, setDevices] = useState<Device[]>([])
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    getDevices().then(data => setDevices(data))
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

  const getStatusStyle = (status: string) => {
    if (status === 'ONLINE') return 'bg-green-500'
    if (status === 'DEGRADED') return 'bg-yellow-500'
    return 'bg-red-500'
}

  return (
    <>
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <h1 className="mb-6 text-2xl font-semibold">
          Devices
        </h1>

        {localError && (
          <p className="mb-4 text-red-400">
            {localError}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </div>
    </>
  )
}