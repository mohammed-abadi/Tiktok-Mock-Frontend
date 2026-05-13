import React, { useState } from "react"
import axios from "../../api/axios"

const Signup = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    password_confirm: "",
    profile_picture_url: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.password_confirm) {
      return setError("Passwords do not match")
    }

    try {
      const res = await axios.post("/signup/", formData)

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("username", res.data.username)
        localStorage.setItem("userId", res.data.user_id || res.data.id)

        onLoginSuccess()
      } else {
        setError("Account created! Please switch to Log In.")
      }
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.username?.[0] ||
          err.response?.data?.email?.[0] ||
          "Signup failed"
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 text-white"
    >
      <h2 className="text-xl font-bold mb-2 text-center">Create Account</h2>

      {error && (
        <p className="text-red-500 text-xs bg-red-500/10 p-2 rounded border border-red-500/20">
          {error}
        </p>
      )}

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        className="bg-gray-900 p-2 rounded border border-gray-800 outline-none focus:border-[#fe2c55]"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="bg-gray-900 p-2 rounded border border-gray-800 outline-none focus:border-[#fe2c55]"
        required
      />
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        className="bg-gray-900 p-2 rounded border border-gray-800 outline-none focus:border-[#fe2c55]"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="bg-gray-900 p-2 rounded border border-gray-800 outline-none focus:border-[#fe2c55]"
        required
      />
      <input
        name="password_confirm"
        type="password"
        placeholder="Confirm Password"
        onChange={handleChange}
        className="bg-gray-900 p-2 rounded border border-gray-800 outline-none focus:border-[#fe2c55]"
        required
      />
      <input
        name="profile_picture_url"
        placeholder="Profile Pic URL (Optional)"
        onChange={handleChange}
        className="bg-gray-900 p-2 rounded border border-gray-800 outline-none focus:border-[#fe2c55]"
      />

      <button
        type="submit"
        className="bg-[#fe2c55] font-bold p-3 rounded-lg mt-2 hover:brightness-110 active:scale-95 transition-all"
      >
        Sign Up
      </button>
    </form>
  )
}

export default Signup
