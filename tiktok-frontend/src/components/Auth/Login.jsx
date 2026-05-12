import React, { useState } from "react"
import axios from "../../api/axios"

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: "", password: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Hits TokenObtainPairView in your Django urls.py
      const res = await axios.post("/token/", formData)
      localStorage.setItem("token", res.data.access)
      localStorage.setItem("refresh", res.data.refresh)
      onLoginSuccess()
    } catch (err) {
      alert("Invalid username or password.")
    }
  }

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <h2 className="text-3xl font-bold mb-8">Log in</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-4 bg-gray-900 border border-gray-800 rounded-lg outline-none focus:border-[#fe2c55]"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 bg-gray-900 border border-gray-800 rounded-lg outline-none focus:border-[#fe2c55]"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button className="w-full bg-[#fe2c55] p-4 rounded-lg font-bold text-lg hover:brightness-110">
          Log In
        </button>
      </form>
    </div>
  )
}

export default Login
