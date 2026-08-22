import Fastify from "fastify";
import prisma from "./lib/prisma"
import { authRoutes } from "./modules/auth/auth_routes";
import { deviceRoutes } from "./modules/devices/device_routes";
import { locationRoutes } from "./modules/locations/location_routes";
import { logRoutes } from "./modules/maintenance/maintenance_routes"
import jwt from '@fastify/jwt'
import './queue/worker'
import { startScheduler } from './queue/scheduler'
import { eventRoutes } from "./modules/events/routes";
import cors from '@fastify/cors'

const app = Fastify({
    logger: true
})

app.addHook('onClose', async () => {
    await prisma.$disconnect()
})

app.get('/health', async () => {
    return { status: 'ok', service: 'inframap-backend' }
})

const start = async () => {
    try {
        await app.register(cors, {
            origin: 'http://localhost:5174',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
        })

        await app.register(jwt, {
            secret: process.env.JWT_SECRET ?? 'fallback-secret'
        })
        await app.register(authRoutes, { prefix: '/auth' })
        await app.register(deviceRoutes, { prefix: '/devices' })
        await app.register(locationRoutes, { prefix: '/locations' })
        await app.register(logRoutes)
        await app.register(eventRoutes)

        await startScheduler()
        await app.listen({ port: 3001, host: '0.0.0.0' })
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()