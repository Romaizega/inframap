import api from "./axios";

interface CreateLocationDTO {
  site: string
  building?: string | null
  floor?: string | null
  latitude?: number | null
  longitude?: number | null
  accessinstruction?: string | null
  description?: string | null
}

interface UpdateLocationDTO {
  site?: string
  building?: string | null
  floor?: string | null
  latitude?: number | null
  longitude?: number | null
  accessinstruction?: string | null
  description?: string | null
}

export const getLocations = async () => {
    const result = await api.get('/locations')
    return result.data
}

export const getLocationById = async (id: string) => {
    const result = await api.get(`/locations/${id}`)
    return result.data
}

export const createLocation = async (data: CreateLocationDTO) => {
    const result = await api.post('/locations', data)
    return result.data
}

export const updateLocation = async (id: string, data: UpdateLocationDTO) => {
    const result = await api.patch(`/locations/${id}`, data)
    return result.data
}