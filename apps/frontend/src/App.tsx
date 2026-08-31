import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashbosrd from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Devices from './pages/Devices'
import DeviceDetail from './pages/DeviceDetail'
import MaintenanceLog from './pages/MaintenanceLogs'
import LocationDetails from './pages/LocationDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashbosrd />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/devices/:id" element={<DeviceDetail />} />
            <Route path="/devices/:id/maintenance-logs" element={<MaintenanceLog />} />
            <Route path="/locations/:id" element={<LocationDetails />} />
          </Route>
          <Route path="*" element={<Navigate to="/login"/>} />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App