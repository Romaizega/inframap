export interface Device {
  id: string
  name: string
  status: string
  rackUnit: number | null
  rackSize: number | null
  type: string
}