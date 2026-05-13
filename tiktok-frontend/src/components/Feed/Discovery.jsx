// src/components/Feed/Discovery.jsx
import React, { useState, useEffect } from "react"
import axios from "../../api/axios"

const Discovery = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Fetch users, optional search query handles filtering on the backend
  const fetchUsers = async (query = "") => {
    try {
      const endpoint = query ? `/profiles/?search=${query}` : `/profiles/`
      const res = await axios.get(endpoint)
      setUsers(res.data.results || res.data)
    } catch (err) {
      console.error("Discovery error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle Search typing
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    fetchUsers(e.target.value)
  }

  // Handle Follow button click
  const handleFollow = async (profileId) => {
    try {
      const res = await axios.post(`/profiles/${profileId}/follow/`)
      alert(`You just ${res.data.status} this user!`)
      // Refresh the list to reflect any backend changes
      fetchUsers(searchTerm)
    } catch (err) {
      console.error("Follow failed:", err)
      alert("Failed to follow. Are you logged in?")
    }
  }

  if (loading)
    return <div className="p-10 text-center text-gray-500">Loading...</div>

  return (
    <div className="p-4 bg-black min-h-screen pb-24 overflow-y-auto">
      {/* Search Input */}
      <div className="sticky top-0 bg-black pt-2 pb-6 z-20">
        <input
          type="text"
          placeholder="Search for creators..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-3 text-sm text-white outline-none focus:border-[#fe2c55] transition-colors"
        />
      </div>

      <section className="mb-10">
        <h3 className="text-gray-400 text-xs font-black mb-4 uppercase">
          Suggested Users
        </h3>
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-gray-900/30 p-4 rounded-3xl border border-gray-800/50"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.profile_picture_url ||
                      `https://ui-avatars.com/api/?name=${user.username || "User"}&background=252525&color=fff&size=150`
                    }
                    className="w-12 h-12 rounded-full object-cover border border-gray-700 bg-gray-800"
                    alt={user.username}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">@{user.username}</span>
                    {/* Optional: Add logic to show if they follow you back here later */}
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  className="bg-[#fe2c55] text-white text-xs font-bold px-6 py-2 rounded-xl active:scale-90 transition-transform"
                >
                  Follow
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 text-sm italic">No users found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Discovery
