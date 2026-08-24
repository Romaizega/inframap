import {useAuthStore} from '../store/authStore'
import { Outlet, Navigate} from "react-router-dom"


export default function ProtectedRoute () {
  const {token} = useAuthStore()

  if(!token) {
    return <Navigate to='/login' />
  }
    return <Outlet/>
}