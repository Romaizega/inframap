export type UserRole = 'admin' | 'dispatcher' | 'engineer' | 'technician' | 'viewer'

export interface User {
    id: string
    email: string
    username: string
    first_name: string
    last_name: string
    role: UserRole
    organizationId: string
    createdAt: Date
    updatedAt: Date
}

export interface CreateUserDTO extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    password: string
}

export interface Organization {
    id: string
    name: string
    country: string
    city: string
    phone_number: string
    createdAt: Date
    updatedAt: Date
}

export interface UserWithOrganization extends User {
    organization: Organization
}