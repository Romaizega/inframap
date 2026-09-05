import api from "./axios";

interface UpdateMaintenceLogDTO {
  workType: string;
  workResult: string;
  description: string;
  plannedAt: string | null;
}

export const getMaintenanceByDevice = async (deviceId: string) => {
  const result = await api.get(`/devices/${deviceId}/maintenance-logs`);
  return result.data;
};

export const createMaintenanceLog = async (
  deviceId: string,
  data: {
    workType: string;
    workResult: string;
    description: string;
    plannedAt?: string;
  },
) => {
  const result = await api.post(`/devices/${deviceId}/maintenance-logs`, data);
  return result.data;
};

export const updateMaintenceLog = async (
  id: string,
  data: UpdateMaintenceLogDTO,
) => {
  const result = await api.patch(`/maintenance-logs/${id}`, data);
  return result.data;
};
