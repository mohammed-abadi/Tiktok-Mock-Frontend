import React, { useState } from "react"
import Login from "./Login"
import Signup from "./Signup"

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-md bg-black border border-gray-800 rounded-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          ✕
        </button>

        {isLoginView ? (
          <Login onLoginSuccess={onLoginSuccess} />
        ) : (
          <Signup onLoginSuccess={onLoginSuccess} />
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="ml-2 text-[#fe2c55] font-bold"
          >
            {isLoginView ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
