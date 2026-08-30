import api from "./axios";

export const getMaintenanceByDevice = async (deviceId: string) => {
    const result = await api.get(`/devices/${deviceId}/maintenance-logs`)
    return result.data
}