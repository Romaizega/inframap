import api from "./axios";

export const getDevices = async () => {
    const result = await api.get('/devices')
    return result.data
}