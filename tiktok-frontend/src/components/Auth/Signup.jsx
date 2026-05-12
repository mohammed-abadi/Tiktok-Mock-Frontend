import React, { useState } from "react"
import axios from "../../api/axios"

const Signup = ({ onToggle }) => {
  const [formData, setFormData] = useState({ username: "", password: "" })

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/signup/", formData)
      alert("Account created! Please log in.")
      onToggle() // Switch to login view
    } catch (err) {
      alert("Signup failed. Username might be taken.")
    }
  }

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <h2 className="text-3xl font-bold mb-8">Sign up</h2>
      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Choose Username"
          className="w-full p-4 bg-gray-900 border border-gray-800 rounded-lg outline-none"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Choose Password"
          className="w-full p-4 bg-gray-900 border border-gray-800 rounded-lg outline-none"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button className="w-full bg-[#fe2c55] p-4 rounded-lg font-bold">
          Sign Up
        </button>
        <p
          className="text-center text-sm text-gray-400 mt-4 cursor-pointer"
          onClick={onToggle}
        >
          Already have an account? Log in
        </p>
      </form>
    </div>
  )
}
export default Signup
