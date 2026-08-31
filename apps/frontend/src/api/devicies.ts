import api from "./axios";

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