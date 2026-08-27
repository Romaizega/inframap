import api from "./axios";

export const getLocations = async () => {
    const result = await api.get('/locations')
    return result.data
}