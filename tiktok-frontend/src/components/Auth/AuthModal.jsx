import React, { useState } from "react"
import axios from "../../api/axios"
import { X } from "lucide-react"

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true)
  const [formData, setFormData] = useState({ username: "", password: "" })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const endpoint = isLoginView ? "/token/" : "/signup/"
    try {
      const res = await axios.post(endpoint, formData)
      if (isLoginView) {
        localStorage.setItem("token", res.data.access)
        onLoginSuccess()
        onClose()
      } else {
        alert("Signup successful! Now please log in.")
        setIsLoginView(true)
      }
    } catch (err) {
      alert("Error: Check your credentials or network.")
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4">
      <div className="bg-[#121212] w-full max-w-md p-8 rounded-2xl relative border border-gray-800">
        <X
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 cursor-pointer"
        />

        <h2 className="text-2xl font-bold text-white text-center mb-8">
          {isLoginView ? "Log in to TikTok" : "Sign up for TikTok"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded text-white"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded text-white"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button className="w-full bg-[#fe2c55] p-3 rounded font-bold text-white mt-2">
            {isLoginView ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-[#fe2c55] font-bold ml-2 cursor-pointer"
          >
            {isLoginView ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  )
}
export default AuthModal
