export type DeviceStatus = 'online' | 'offline' | 'degraded'
export type DeviceType =
    | 'router'
    | 'switch'
    | 'access-point'
    | 'server'
    | 'camera'
    | 'nvr'
    | 'ups'
    | 'repeater'
    | 'antenna'
    | 'sensor'
    | 'controller'
    | 'other';

export interface Device {
    id: string
    name: string
    ip_address: string
    mac_address: string
    manufacturer: string
    status: DeviceStatus
    type: DeviceType
    locationId: string
    model: string
    serialNumber?: string
    createdAt: Date
    updatedAt: Date
    description?: string

}

export interface CreateDeviceDTO extends Omit<Device, 'id' | 'status' | 'createdAt' | 'updatedAt'> {

}

export interface Location {
    id: string
    site: string
    building: string
    floor?: string
    room?: string
    latitude?: number
    longitude?: number
    accessinstruction?: string
    description?: string
    createdAt: Date
    updatedAt: Date
    organizationId: string
}


export interface PhotoSite {
    id: string
    locationId: string
    path: string
    createdAt: Date
    updatedAt: Date
}

export interface DevicePhoto {
    id: string
    deviceId: string
    path: string
    createdAt: Date
    updatedAt: Date
}

export interface DeviceWithDetails extends Device {
    location: Location
    photos: DevicePhoto[]
}

export interface LocationWithPhoto extends Location {
    photos: PhotoSite[]
}


