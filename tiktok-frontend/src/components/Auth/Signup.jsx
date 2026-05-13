import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../api/axios"

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    password_confirm: "",
    profile_picture_url: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.password_confirm) {
      return setError("Passwords do not match")
    }
    try {
      await axios.post("/signup/", formData)
      navigate("/login")
    } catch (err) {
      setError(
        err.response?.data?.email ||
          err.response?.data?.username ||
          "Signup failed"
      )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-2 bg-gray-900 rounded border border-gray-700"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full p-2 bg-gray-900 rounded border border-gray-700"
          required
        />
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 bg-gray-900 rounded border border-gray-700"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 bg-gray-900 rounded border border-gray-700"
          required
        />
        <input
          name="password_confirm"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full p-2 bg-gray-900 rounded border border-gray-700"
          required
        />
        <input
          name="profile_picture_url"
          placeholder="Profile Picture URL (Optional)"
          onChange={handleChange}
          className="w-full p-2 bg-gray-900 rounded border border-gray-700"
        />
        <button
          type="submit"
          className="w-full p-2 bg-[#fe2c55] rounded font-bold"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default Signup
