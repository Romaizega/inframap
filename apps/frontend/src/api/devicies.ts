import api from "./axios";


interface UpdateDeviceDTO {
  name?: string
  type?: string
  status?: string
  ip_address?: string
  mac_address?: string
  manufacturer?: string
  model?: string
  serialNumber?: string
  description?: string
  locationId?: string
}

export const getDevices = async () => {
    const result = await api.get('/devices')
    return result.data
}

export const getDeviceById = async (id: string) => {
    const result = await api.get(`/devices/${id}`)
    return result.data
}

export const createDevice = async (data: {
    name: string
    type: string
    locationId:string
    ip_address?: string
}) => {
    const result = await api.post('/devices/create-device', data)
    return result.data
}


export const updateDevice = async (id: string, data: UpdateDeviceDTO) => {
    const result = await api.patch(`/devices/${id}`, data)
    return result.data
}

export const deleteDevice = async (id: string) => {
    const result = await api.delete(`/devices/${id}`)
    return result.data
}