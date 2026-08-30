import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMaintenanceByDevice } from "../api/maintenance"
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft
} from "lucide-react"

type MaintenanceType =
  | "INSTALLATION"
  | "COMMISSIONING"
  | "INSPECTION"
  | "PREVENTIVE"
  | "REPAIR"
  | "REPLACEMENT"
  | "UPGRADE"
  | "CONFIGURATION"
  | "RELOCATION"
  | "DECOMMISSION"
  | "EMERGENCY"

type MaintenanceResult =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "DELAYED"

interface MaintenanceLog {
  id: string
  workType: MaintenanceType
  workResult: MaintenanceResult
  description: string
  createdAt: string
  plannedAt: string | null
}

export default function MaintenanceLog() {

  const [localError, setLocalError] = useState("")
  const [logs, setLogs] = useState<MaintenanceLog[]>([])

  const { id } = useParams()
  const navigate = useNavigate()


  useEffect(() => {
    if (!id) return

    const loadMaintenance = async () => {
      try {
        const data = await getMaintenanceByDevice(id)
        setLogs(data)
      } catch {
        setLocalError("Failed to load maintenance history")
      }
    }

    loadMaintenance()
  }, [id])

  useEffect(() => {
    if (!localError) return

    const timer = setTimeout(() => {
      setLocalError("")
    }, 10000)

    return () => clearTimeout(timer)
  }, [localError])


  const getResultStyle = (result: MaintenanceResult) => {

    if (result === "COMPLETED") {
      return "bg-green-500/10 text-green-400 border-green-500/20"
    }

    if (result === "IN_PROGRESS") {
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    }

    if (result === "SCHEDULED") {
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
    }

    if (result === "FAILED" || result === "CANCELLED") {
      return "bg-red-500/10 text-red-400 border-red-500/20"
    }

    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
  }


  const getResultIcon = (result: MaintenanceResult) => {

    if (result === "COMPLETED") {
      return <CheckCircle2 size={14} />
    }

    if (result === "FAILED" || result === "CANCELLED") {
      return <XCircle size={14} />
    }

    if (result === "DELAYED") {
      return <AlertTriangle size={14} />
    }

    return <Clock size={14} />
  }


  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">

      {/* HEADER */}

      <div className="mb-8 flex items-start justify-between">

        <div>
          <h1 className="text-2xl font-semibold">
            Maintenance History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Service and maintenance records
          </p>
        </div>

        <button
          className="
            rounded-md
            bg-cyan-600
            px-4 py-2
            text-sm font-medium
            transition
            hover:bg-cyan-500
          "
        >
          + Add Maintenance
        </button>

      </div>


      {/* ERROR */}

      {localError && (
        <div className="
          mb-6
          rounded-md
          border border-red-500/20
          bg-red-500/10
          px-4 py-3
          text-sm text-red-400
        ">
          {localError}
        </div>
      )}
      <div className="">
        <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-6 cursor-pointer"
          onClick={() => navigate(`/devices/${id}`)}>
          <ArrowLeft size={24} />
          Back  to devices
        </button>
      </div>

      {/* EMPTY STATE */}

      {logs.length === 0 && (
        <div className="
          flex
          flex-col
          items-center
          justify-center
          rounded-lg
          border border-slate-800
          bg-slate-900
          py-16
        ">

          <Wrench
            size={32}
            className="mb-3 text-slate-600"
          />

          <p className="text-sm text-slate-400">
            No maintenance records
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Maintenance history will appear here
          </p>

        </div>
      )}


      {/* HISTORY */}

      <div className="space-y-3">

        {logs.map(log => (

          <div
            key={log.id}
            className="
              rounded-lg
              border border-slate-800
              bg-slate-900
              p-5
              transition
              hover:border-slate-700
            "
          >

            {/* TOP */}

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="
                  flex h-9 w-9
                  items-center
                  justify-center
                  rounded-md
                  bg-slate-800
                ">
                  <Wrench
                    size={17}
                    className="text-slate-400"
                  />
                </div>


                <div>

                  <p className="text-sm font-medium text-white">
                    {log.workType.replaceAll("_", " ")}
                  </p>

                  <div className="
                    mt-1
                    flex
                    items-center
                    gap-1
                    text-xs
                    text-slate-500
                  ">

                    <Calendar size={12} />

                    {new Date(log.createdAt).toLocaleDateString()}

                  </div>

                </div>

              </div>


              {/* RESULT */}

              <div
                className={`
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  px-3 py-1
                  text-xs
                  ${getResultStyle(log.workResult)}
                `}
              >

                {getResultIcon(log.workResult)}

                {log.workResult.replaceAll("_", " ")}

              </div>

            </div>


            {/* DESCRIPTION */}

            <p className="
              mt-4
              text-sm
              leading-6
              text-slate-300
            ">
              {log.description}
            </p>


            {/* PLANNED DATE */}

            {log.plannedAt && (

              <div className="
                mt-4
                flex
                items-center
                gap-2
                border-t
                border-slate-800
                pt-4
                text-xs
                text-slate-500
              ">

                <Clock size={13} />

                Planned:

                <span className="text-slate-400">
                  {new Date(log.plannedAt).toLocaleDateString()}
                </span>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  )
}