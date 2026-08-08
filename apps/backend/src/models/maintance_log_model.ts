import { Location } from "./device_model"

export type MaintenanceType =
    | 'installation'
    | 'commissioning'
    | 'inspection'
    | 'preventive'
    | 'repair'
    | 'replacement'
    | 'upgrade'
    | 'configuration'
    | 'relocation'
    | 'decommission'
    | 'emergency'

export type MaintenanceResult =
    | 'scheduled'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'failed'
    | 'delayed'


export interface MaintenanceLog {
    id: string
    userId: string
    deviceId?: string
    workType: MaintenanceType
    workResult: MaintenanceResult
    descriptionJob: string
    locationId?: string
    createdAt: Date
    updatedAt: Date
    plannedAt?: Date
}

export interface CreateMaintenanceLogDTO extends Omit<MaintenanceLog, 'id' | 'createdAt' | 'updatedAt' | 'plannedAt'> {

}

export interface MaintenanceLogWithLocation extends MaintenanceLog {
    location: Location
}