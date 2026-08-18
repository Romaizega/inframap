import Fastify from "fastify";
import prisma from "./lib/prisma"
import { authRoutes } from "./modules/auth/auth_routes";
import { deviceRoutes } from "./modules/devices/device_routes";
import { locationRoutes } from "./modules/locations/location_routes";
import {logRoutes} from "./modules/maintenance/maintenance_routes"
import jwt from '@fastify/jwt'

const app = Fastify({
    logger: true
})

app.addHook('onClose', async () => {
    await prisma.$disconnect()
})

app.get('/health', async () => {
    return { status: 'ok', service: 'inframap-backend' }
})

app.register(jwt, {
    secret:process.env.JWT_SECRET ?? 'fallback-secret'
})
app.register(authRoutes, {prefix:'/auth'})
app.register(deviceRoutes, {prefix: '/devices'})
app.register(locationRoutes, {prefix: '/locations'})
app.register(logRoutes)

const start = async () => {
    try {
        await app.listen({ port: 3001, host: '0.0.0.0' })
    } catch (error) {
        app.log.error(error)
        process.exit(1)

    }
}

start()