import api from "./axios";

export const getMaintenanceByDevice = async (deviceId: string) => {
    const result = await api.get(`/devices/${deviceId}/maintenance-logs`)
    return result.data
}

export const createMaintenanceLog = async (deviceId: string, data: {
  workType: string
  workResult: string
  description: string
  plannedAt?: string
}) => {
  const result = await api.post(`/devices/${deviceId}/maintenance-logs`, data)
  return result.data
}