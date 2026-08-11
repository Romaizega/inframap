import Fastify from "fastify";
import prisma from "./lib/prisma"
import { authRoutes } from "./modules/auth/auth_routes";

const app = Fastify({
    logger: true
})

app.addHook('onClose', async () => {
    await prisma.$disconnect()
})

app.get('/health', async () => {
    return { status: 'ok', service: 'inframap-backend' }
})

app.register(authRoutes, {prefix:'/auth'})

const start = async () => {
    try {
        await app.listen({ port: 3001, host: '0.0.0.0' })
    } catch (error) {
        app.log.error(error)
        process.exit(1)

    }
}

start()