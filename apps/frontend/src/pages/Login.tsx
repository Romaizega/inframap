import  { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { login } from "../api/auth";
import {useNavigate} from 'react-router-dom'
import { EyeOff, Eye } from "lucide-react";



export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const setAuth = useAuthStore(state => state.setAuth)
  const navigate = useNavigate()

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    if(!email || !password) {
      setLocalError("Please fill in all the field")
      return
    }
    try {
      const resultLogin = await login(email, password)
      setAuth(resultLogin.token, resultLogin.user)
      navigate('/dashboard')
      
    } catch  {
      setLocalError('Invalid email or password')
      
    }
  }

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [localError]);


  return (
    <>
     <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-96 rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

        <h1 className="mb-1 text-center text-2xl font-semibold text-white">
          InfraMap
        </h1>

        <p className="mb-6 text-center text-sm text-slate-500">
          Infrastructure Management
        </p>

        {localError && (
          <p className="mb-4 text-center text-sm text-red-400">
            {localError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />

          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800 focus-within:border-cyan-500">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent px-4 py-3 text-white outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="mr-3 text-slate-500 hover:text-white"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-cyan-600 py-3 font-medium text-white hover:bg-cyan-500"
          >
            Login
          </button>

        </form>
      </div>
    </div>
    </>
  )
}