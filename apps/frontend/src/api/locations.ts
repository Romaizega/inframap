import api from "./axios";

export const getLocations = async () => {
    const result = await api.get('/locations')
    return result.data
}

export const getLocationById = async (id: string) => {
    const result = await api.get(`/locations/${id}`)
    return result.data
}