// src/components/Navigation/Navbar.jsx
import React from "react"
import { NavLink } from "react-router-dom"

const Navbar = ({ isAuthenticated, openAuth, openUpload }) => {
  return (
    <nav className="fixed bottom-0 w-full bg-black border-t border-gray-900 flex justify-around items-center py-2 z-50">
      {/* ... Home, Discover, and Upload buttons stay the same ... */}

      {/* Home Icon */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? "text-white" : "text-gray-500"}`
        }
      >
        <span className="text-xl">🏠</span>
        <span className="text-[10px] font-bold uppercase mt-1">Home</span>
      </NavLink>

      {/* Discover Icon */}
      <NavLink
        to="/discover"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? "text-white" : "text-gray-500"}`
        }
      >
        <span className="text-xl">🔍</span>
        <span className="text-[10px] font-bold uppercase mt-1">Discover</span>
      </NavLink>

      {/* Upload Button */}
      <button
        onClick={isAuthenticated ? openUpload : openAuth}
        className="bg-white text-black px-4 py-1 rounded-md hover:bg-gray-200"
      >
        <span className="text-2xl font-bold">+</span>
      </button>

      {/* Inbox Icon - Also requires Login check */}
      <NavLink
        to={isAuthenticated ? "/inbox" : "#"}
        onClick={(e) => {
          if (!isAuthenticated) {
            e.preventDefault()
            openAuth()
          }
        }}
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? "text-white" : "text-gray-500"}`
        }
      >
        <span className="text-xl">💬</span>
        <span className="text-[10px] font-bold uppercase mt-1">Inbox</span>
      </NavLink>

      {/* Profile Icon - Intercepts click if logged out */}
      <NavLink
        to={isAuthenticated ? "/profile" : "#"}
        onClick={(e) => {
          if (!isAuthenticated) {
            e.preventDefault() // Stop navigation to "#"
            openAuth() // Open the login modal instead
          }
        }}
        className={({ isActive }) =>
          `flex flex-col items-center transition-all ${
            isActive ? "text-white" : "text-gray-500"
          }`
        }
      >
        <span className="text-xl">👤</span>
        <span className="text-[10px] font-bold uppercase mt-1">Profile</span>
      </NavLink>
    </nav>
  )
}

export default Navbar
