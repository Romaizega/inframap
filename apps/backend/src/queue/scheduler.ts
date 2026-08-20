import { deviceStatusQueue } from "./queue";

export const startScheduler = async () => {
    await deviceStatusQueue.upsertJobScheduler(
        'check-device-status',    
        { every: 30000 }, 
        {
            name: 'check-device-status',
            data: {}
        }
    )
    console.log('Scheduler started')
}