import React, { useState, useEffect } from "react"
import axios from "../../api/axios"

const Discovery = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/profiles/")
        setUsers(res.data.results || res.data)
      } catch (err) {
        console.error("Discovery error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleFollow = async (userId) => {
    try {
      const res = await axios.post(`/profiles/${userId}/follow/`)
      alert(`User ${res.data.status}`)
    } catch (err) {
      console.error("Follow failed:", err)
    }
  }

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value)
    try {
      const res = await axios.get(`/profiles/?search=${e.target.value}`)
      setUsers(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="p-4 bg-black min-h-screen pb-24">
      <div className="sticky top-0 bg-black pb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-3 text-white outline-none focus:border-[#fe2c55]"
        />
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-gray-900/40 p-4 rounded-3xl border border-gray-800"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  user.profile_picture_url || "https://via.placeholder.com/150"
                }
                className="w-12 h-12 rounded-full object-cover"
                alt=""
              />
              <span className="font-bold">@{user.username}</span>
            </div>
            <button
              onClick={() => handleFollow(user.id)}
              className="bg-[#fe2c55] text-white text-xs font-bold px-6 py-2 rounded-xl"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Discovery
