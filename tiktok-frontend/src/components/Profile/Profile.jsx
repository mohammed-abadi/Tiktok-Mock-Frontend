import React, { useState, useEffect } from "react"
import axios from "../../api/axios"

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    bio: "",
    location: "",
    new_username: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const res = await axios.get("/profiles/me/")
    setProfile(res.data)
    setEditData({
      bio: res.data.bio,
      location: res.data.location,
      new_username: res.data.username,
    })
  }

  const handleUpdate = async () => {
    try {
      if (editData.new_username !== profile.username) {
        await axios.post("/profiles/update_username/", {
          new_username: editData.new_username,
        })
      }
      await axios.patch(`/profiles/${profile.id}/`, {
        bio: editData.bio,
        location: editData.location,
      })
      setIsEditing(false)
      fetchProfile()
    } catch (err) {
      alert(err.response?.data?.error || "Update failed")
    }
  }

  if (!profile) return null

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="flex items-center space-x-6">
        <img
          src={profile.profile_picture_url}
          className="w-24 h-24 rounded-full border-2 border-gray-700"
          alt="Avatar"
        />
        <div>
          {isEditing ? (
            <input
              className="bg-gray-800 p-1 rounded text-xl font-bold"
              value={editData.new_username}
              onChange={(e) =>
                setEditData({ ...editData, new_username: e.target.value })
              }
            />
          ) : (
            <h2 className="text-2xl font-bold">@{profile.username}</h2>
          )}
          <p className="text-gray-400">{profile.name}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {isEditing ? (
          <>
            <textarea
              className="w-full bg-gray-800 p-2 rounded"
              value={editData.bio}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
            />
            <input
              className="w-full bg-gray-800 p-2 rounded"
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
            />
            <button
              onClick={handleUpdate}
              className="bg-[#fe2c55] px-4 py-2 rounded font-bold"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <p>{profile.bio || "No bio yet."}</p>
            <p className="text-sm text-gray-500">
              📍 {profile.location || "Earth"}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="border border-gray-700 px-4 py-2 rounded font-bold"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile
