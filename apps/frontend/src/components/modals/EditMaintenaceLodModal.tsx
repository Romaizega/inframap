import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { updateMaintenceLog } from "../../api/maintenance";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  maintenanceLog: MaintenanceLogData | null;
}

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
  | "EMERGENCY";

type MaintenanceResult =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "DELAYED";

interface MaintenanceLogData {
  id: string;
  workType: MaintenanceType;
  workResult: MaintenanceResult;
  description: string;
  plannedAt: string | null;
}

export default function EditLog({
  isOpen,
  onClose,
  onSuccess,
  maintenanceLog,
}: Props) {

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultDate = now.toISOString().slice(0, 16);

  const [workType, setWorkType] = useState<MaintenanceType>("INSPECTION");
  const [workResult, setWorkResult] = useState<MaintenanceResult>("SCHEDULED");
  const [description, setDescription] = useState("");
  const [plannedAt, setPlannedAt] = useState(defaultDate);
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setWorkType("INSPECTION");
    setWorkResult("SCHEDULED");
    setDescription("");
    setPlannedAt("");
    setLocalError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!maintenanceLog) return;
    console.log("plannedAt raw:", maintenanceLog.plannedAt)

    setWorkType(maintenanceLog.workType);
    setWorkResult(maintenanceLog.workResult);
    setDescription(maintenanceLog.description);

    if (maintenanceLog.plannedAt) {
      const date = new Date(maintenanceLog.plannedAt);

      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

      setPlannedAt(date.toISOString().slice(0, 16));
    } else {
      setPlannedAt("");
    }
  }, [maintenanceLog]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLocalError("");

    if (!maintenanceLog) return;

    if (!description.trim()) {
      setLocalError("Description is required");
      return;
    }

    try {
      setIsLoading(true);

      await updateMaintenceLog(maintenanceLog.id, {
        workType,
        workResult,
        description: description.trim(),

        plannedAt: plannedAt ? new Date(plannedAt).toISOString() : null,
      });

      onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);

      setLocalError("Failed to update maintenance record");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !maintenanceLog) return null;

  return (
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
            <h2 className="text-lg font-semibold text-white">
              Edit Maintenance
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Update maintenance record
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="
              text-slate-500
              transition
              hover:text-white
              cursor-pointer
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
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

            {/* TYPE */}

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Maintenance Type
              </label>

              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as MaintenanceType)}
                className="
                  w-full
                  rounded-md
                  border border-slate-700
                  bg-slate-950
                  px-3 py-2
                  text-sm text-white
                  outline-none
                  focus:border-cyan-600
                "
              >
                <option value="INSTALLATION">Installation</option>

                <option value="COMMISSIONING">Commissioning</option>

                <option value="INSPECTION">Inspection</option>

                <option value="PREVENTIVE">Preventive</option>

                <option value="REPAIR">Repair</option>

                <option value="REPLACEMENT">Replacement</option>

                <option value="UPGRADE">Upgrade</option>

                <option value="CONFIGURATION">Configuration</option>

                <option value="RELOCATION">Relocation</option>

                <option value="DECOMMISSION">Decommission</option>

                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>

            {/* RESULT */}

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Result
              </label>

              <select
                value={workResult}
                onChange={(e) =>
                  setWorkResult(e.target.value as MaintenanceResult)
                }
                className="
                  w-full
                  rounded-md
                  border border-slate-700
                  bg-slate-950
                  px-3 py-2
                  text-sm text-white
                  outline-none
                  focus:border-cyan-600
                "
              >
                <option value="SCHEDULED">Scheduled</option>

                <option value="IN_PROGRESS">In Progress</option>

                <option value="COMPLETED">Completed</option>

                <option value="DELAYED">Delayed</option>

                <option value="FAILED">Failed</option>

                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* PLANNED DATE */}

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Planned Date
              </label>

              <input
                type="datetime-local"
                value={plannedAt}
                onChange={(e) => setPlannedAt(e.target.value)}
                className="
                  w-full
                  rounded-md
                  border border-slate-700
                  bg-slate-950
                  px-3 py-2
                  text-sm text-white
                  outline-none
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
                rows={4}
                placeholder="Describe the maintenance work..."
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
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
