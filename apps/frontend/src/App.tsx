import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashbosrd from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashbosrd />} />
          </Route>
          <Route path="*" element={<Navigate to="/login"/>} />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App