import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getDeviceById } from "../api/devicies"
import {
  Server,
  Network,
  Cpu,
  Hash,
  MapPin,
  Calendar,
  Pencil,
  ArrowLeft,
  ScrollText
} from "lucide-react"

type DeviceStatus = "ONLINE" | "OFFLINE" | "DEGRADED"

interface Device {
  id: string
  name: string
  type: string
  ip_address: string | null
  mac_address: string | null
  manufacturer: string | null
  model: string | null
  serialNumber: string | null
  description: string | null
  status: DeviceStatus
  locationId: string | null
  createdAt: Date
  updatedAt: Date
}

export default function DeviceDetail() {
  const [localError, setLocalError] = useState("")
  const [device, setDevice] = useState<Device | null>(null)
  const navigate = useNavigate()

  const { id } = useParams()

  useEffect(() => {
    if (!id) return

    const loadDeviceId = async () => {
      try {
        const data = await getDeviceById(id)
        setDevice(data)
      } catch {
        setLocalError("Failed to load the device")
      }
    }

    loadDeviceId()
  }, [id])


  useEffect(() => {
    if (!localError) return
    const timer = setTimeout(() => {
      setLocalError("")
    }, 10000)
    return () => clearTimeout(timer)
  }, [localError])

  const getStatusStyle = (status: DeviceStatus) => {
    if (status === "ONLINE") {
      return {
        dot: "bg-green-500",
        text: "text-green-400",
        background: "bg-green-500/10",
        border: "border-green-500/20"
      }
    }

    if (status === "DEGRADED") {
      return {
        dot: "bg-yellow-500",
        text: "text-yellow-400",
        background: "bg-yellow-500/10",
        border: "border-yellow-500/20"
      }
    }

    return {
      dot: "bg-red-500",
      text: "text-red-400",
      background: "bg-red-500/10",
      border: "border-red-500/20"
    }
  }

  if (!device) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-slate-400">
        Loading device...
      </div>
    )
  }

  const statusStyle = getStatusStyle(device.status)

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">

      {/* HEADER */}
      <div className="mb-8 flex items-start justify-between">

        <div>

          <div className="mb-2 flex items-center gap-3">

            <h1 className="text-2xl font-semibold">
              {device.name}
            </h1>

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
              <span
                className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
              />

              {device.status}
            </div>

          </div>

          <p className="text-sm text-slate-500">
            Device details and infrastructure information
          </p>

        </div>


        <button
          className="
            flex items-center gap-2
            rounded-md
            bg-cyan-600
            px-4 py-2
            text-sm font-medium
            transition
            hover:bg-cyan-500
          "
        >
          <Pencil size={16} />

          Edit Device
        </button>

      </div>


      {/* ERROR */}
      {localError && (
        <div className="mb-6 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {localError}
        </div>
      )}
      <div className="">
        <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-6 cursor-pointer"
          onClick={() => navigate('/devices')}>
          <ArrowLeft size={24} />
          Back  to devices
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

        </div>


        {/* RIGHT SIDE */}
        <div className="space-y-6">


          {/* Maintenance */}
          <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">

            <div className="mb-5 flex items-center gap-2">
              <MapPin
                size={18}
                className="text-cyan-400"
              />

              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Location
              </h2>
            </div>

            {device.locationId ? (
              <>
                <p className="text-sm text-slate-300">
                  Location assigned
                </p>

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
                  onClick={() => navigate(`/locations/${device.locationId}`)}
                >
                  Open Location
                </button>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                No location assigned
              </p>
            )}

          </section>
          <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">

            <div className="mb-5 flex items-center gap-2">
              <ScrollText
                size={18}
                className="text-cyan-400"
              />

              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Maintenance Logs
              </h2>
            </div>

            <p className="mt-2 font-mono text-xs text-slate-500">
              {id}
            </p>

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
              <Calendar
                size={18}
                className="text-slate-400"
              />

              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                System
              </h2>
            </div>

            <div className="space-y-5">

              <div>
                <p className="text-xs text-slate-500">
                  Created
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  {new Date(device.createdAt).toLocaleString()}
                </p>
              </div>


              <div>
                <p className="text-xs text-slate-500">
                  Last Updated
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  {new Date(device.updatedAt).toLocaleString()}
                </p>
              </div>

            </div>

          </section>

        </div>

      </div>

    </div>
  )
}


interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string | null
  mono?: boolean
}

function InfoItem({
  icon,
  label,
  value,
  mono = false
}: InfoItemProps) {

  return (
    <div className="flex items-start gap-3">

      <div className="mt-1 text-slate-500">
        {icon}
      </div>

      <div>

        <p className="text-xs text-slate-500">
          {label}
        </p>

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
  )
}