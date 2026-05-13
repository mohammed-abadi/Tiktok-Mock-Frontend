import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import axios from "../../api/axios"

const Navbar = ({ isAuthenticated, openAuth, openUpload }) => {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) return
    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get("/notifications/unread_count/")
        setUnreadCount(res.data.unread_count)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 15000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  return (
    <nav className="fixed bottom-0 w-full bg-black border-t border-gray-900 flex justify-around items-center py-2 z-50">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? "text-white" : "text-gray-500"}`
        }
      >
        <span className="text-xl">🏠</span>
        <span className="text-[10px] font-bold uppercase mt-1">Home</span>
      </NavLink>
      <NavLink
        to="/discover"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? "text-white" : "text-gray-500"}`
        }
      >
        <span className="text-xl">🔍</span>
        <span className="text-[10px] font-bold uppercase mt-1">Discover</span>
      </NavLink>
      <button
        onClick={isAuthenticated ? openUpload : openAuth}
        className="bg-white text-black px-4 py-1 rounded-md hover:bg-gray-200"
      >
        <span className="text-2xl font-bold">+</span>
      </button>
      <NavLink
        to={isAuthenticated ? "/activity" : "#"}
        onClick={(e) => {
          if (!isAuthenticated) {
            e.preventDefault()
            openAuth()
          } else {
            setUnreadCount(0)
          }
        }}
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? "text-white" : "text-gray-500"}`
        }
      >
        <div className="relative">
          <span className="text-xl">🔔</span>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-2 bg-[#fe2c55] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-black shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase mt-1">Activity</span>
      </NavLink>
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
      <NavLink
        to={isAuthenticated ? "/profile" : "#"}
        onClick={(e) => {
          if (!isAuthenticated) {
            e.preventDefault()
            openAuth()
          }
        }}
        className={({ isActive }) =>
          `flex flex-col items-center transition-all ${isActive ? "text-white" : "text-gray-500"}`
        }
      >
        <span className="text-xl">👤</span>
        <span className="text-[10px] font-bold uppercase mt-1">Profile</span>
      </NavLink>
    </nav>
  )
}
export default Navbar
