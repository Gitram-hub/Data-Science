import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
  e.preventDefault()

  if (!form.name || !form.email || !form.password) {
    setError("All fields required")
    return
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Signup failed")
    }

    alert("Signup successful")
    navigate("/login")
  } catch (err) {
    setError(err.message)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#03140f] to-[#052e1b] text-white">

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl w-[400px]">

        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Signup
        </h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-green-400/20"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-green-400/20"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-green-400/20"
          />

          <button className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl text-black font-bold hover:scale-105 transition">
            Create Account
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-green-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  )
}