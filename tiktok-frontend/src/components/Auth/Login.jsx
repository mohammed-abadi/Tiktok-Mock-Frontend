import React, { useState } from "react"
import axios from "../../api/axios"

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post("/token/", formData)
      localStorage.setItem("token", res.data.access)
      localStorage.setItem("refreshToken", res.data.refresh)
      localStorage.setItem("username", formData.username)

      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (err) {
      alert("Invalid username or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-white mb-2 text-center">Log in</h2>
      <input
        placeholder="Username"
        className="bg-gray-900 p-3 rounded border border-gray-800 text-white outline-none focus:border-[#fe2c55]"
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="bg-gray-900 p-3 rounded border border-gray-800 text-white outline-none focus:border-[#fe2c55]"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={`font-bold p-3 rounded text-white transition-all ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-[#fe2c55] active:scale-95"
        }`}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  )
}

export default Login
