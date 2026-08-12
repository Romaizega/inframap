import bcrypt from "bcrypt"
import prisma from "../../lib/prisma"
import { RegisterDTO, LoginDTO } from "./auth_schema"

export const registerService = async (data: RegisterDTO) => {
    const existUser = await prisma.user.findUnique({
        where: { email: data.email }
    })
    if (existUser) {
        throw new Error('Email already exist')
    }
    const hashPassword = await bcrypt.hash(data.password, 10)

    const newOrganization = await prisma.organization.create({
        data: {
            name: data.name,
            country: data.country,
            city: data.city,
            phone_number: data.phone_number

        }
    })

    const newUser = await prisma.user.create({
        data: {
            email: data.email,
            password: hashPassword,
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            role: "OWNER",
            organizationId: newOrganization.id
        }
    })

    const { password, ...userWithoutPassword } = newUser
    return { user: userWithoutPassword, organization: newOrganization }
}


export const loginService = async (data: LoginDTO) => {
    const existUser = await prisma.user.findUnique({
        where: { email: data.email }
    })
    if (!existUser) {
        throw new Error('Email not found')
    }

    const isCorrectPassword = await bcrypt.compare(
        data.password, existUser.password)
    if(!isCorrectPassword){
        throw new Error ('Invalid credentials')
    }
    const {password,...userWithoutPassword} = existUser
    return userWithoutPassword
}