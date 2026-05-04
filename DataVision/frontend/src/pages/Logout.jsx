import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem("user_id")
    localStorage.removeItem("user_name")

    const timer = setTimeout(() => {
      navigate("/login")
    }, 1200)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#03140f] to-[#052e1b] text-white">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl w-[420px] text-center">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Logged Out
        </h1>
        <p className="text-green-200/90">You have been logged out successfully.</p>
      </div>
    </div>
  )
}
