import { FastifyInstance } from "fastify";
import eventBus from "../../lib/eventBus";

export async function eventRoutes(app: FastifyInstance) {
    app.get('/events', async (request, reply) => {
        reply.raw.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        })
        reply.raw.flushHeaders()

        const handleStatusUpdate = (payload: unknown) => {
            reply.raw.write(`data: ${JSON.stringify(payload)}\n\n`)
        }

        eventBus.on('device-status-changed', handleStatusUpdate) 
        request.raw.on('close', () => {
            eventBus.off('device-status-changed', handleStatusUpdate)
        })
    })
}