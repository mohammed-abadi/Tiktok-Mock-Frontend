import React, { useState, useEffect } from "react"
import ReactPlayer from "react-player"
import axios from "../../api/axios"
const Profile = ({ onLogout }) => {
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState("posts")
  const [content, setContent] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    bio: "",
    location: "",
    new_username: "",
    profile_picture_url: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    const fetchTabContent = async () => {
      try {
        let endpoint = "/posts/"
        if (activeTab === "posts")
          endpoint = `/posts/?author=${profile?.username}`
        if (activeTab === "reposts")
          endpoint = `/posts/?is_repost=true&author=${profile?.username}`
        if (activeTab === "liked") endpoint = `/posts/?liked_by_me=true`
        if (activeTab === "favorites") endpoint = `/posts/?favorited_by_me=true`

        const res = await axios.get(endpoint)
        setContent(res.data.results || res.data)
      } catch (err) {
        console.error("Tab fetch failed", err)
      }
    }
    if (profile && !isEditing) fetchTabContent()
  }, [activeTab, profile, isEditing])

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/profiles/me/")
      setProfile(res.data)
      setEditData({
        bio: res.data.bio || "",
        location: res.data.location || "",
        new_username: res.data.username || "",
        profile_picture_url: res.data.profile_picture_url || "",
      })
    } catch (err) {
      console.error("Failed to fetch profile", err)
    }
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
        profile_picture_url: editData.profile_picture_url,
      })
      setIsEditing(false)
      fetchProfile()
    } catch (err) {
      alert(err.response?.data?.error || "Update failed")
    }
  }

  if (!profile) return <div className="text-center mt-20">Loading...</div>

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white pb-24">
      <div className="flex flex-col items-center pt-10 w-full max-w-sm px-6">
        <img
          src={profile.profile_picture_url}
          className="w-24 h-24 rounded-full border-2 border-[#fe2c55] object-cover mb-4"
          alt="Avatar"
        />

        {!isEditing ? (
          <div className="flex flex-col items-center w-full">
            <h2 className="text-xl font-bold">@{profile.username}</h2>
            <p className="text-gray-400 text-sm mb-2">{profile.name}</p>
            <p className="text-sm text-gray-200 text-center mb-1">
              {profile.bio || "No bio yet"}
            </p>
            <p className="text-[10px] text-gray-500 mb-4">
              📍 {profile.location || "Global"}
            </p>

            <div className="flex w-full gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 border border-gray-800 py-2 rounded font-bold text-sm hover:bg-gray-900"
              >
                Edit Profile
              </button>
              <button
                onClick={onLogout}
                className="px-4 border border-gray-800 py-2 rounded text-xs text-gray-500"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Username
              </label>
              <input
                className="w-full bg-gray-900 p-3 rounded border border-gray-800 outline-none focus:border-[#fe2c55]"
                value={editData.new_username}
                onChange={(e) =>
                  setEditData({ ...editData, new_username: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Profile Pic URL
              </label>
              <input
                className="w-full bg-gray-900 p-3 rounded border border-gray-800 outline-none focus:border-[#fe2c55]"
                value={editData.profile_picture_url}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    profile_picture_url: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Bio
              </label>
              <textarea
                className="w-full bg-gray-900 p-3 rounded border border-gray-800 outline-none h-20 resize-none focus:border-[#fe2c55]"
                value={editData.bio}
                onChange={(e) =>
                  setEditData({ ...editData, bio: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-[#fe2c55] py-2 rounded font-bold text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-800 py-2 rounded font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <>
          <div className="flex w-full mt-8 border-b border-gray-900 justify-around">
            {[
              { id: "posts", label: "Posts", icon: "📱" },
              { id: "reposts", label: "Reposts", icon: "🔁" },
              { id: "liked", label: "Liked", icon: "❤️" },
              { id: "favorites", label: "Private", icon: "🔒" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-2 flex flex-col items-center transition-all ${
                  activeTab === tab.id
                    ? "border-b-2 border-white text-white"
                    : "text-gray-500"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-[10px] font-bold uppercase mt-1">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-0.5 w-full mt-1">
            {content.length > 0 ? (
              content.map((item) => (
                <div
                  key={item.id}
                  className="aspect-[9/16] bg-gray-900 relative overflow-hidden"
                >
                  <ReactPlayer
                    url={item.media_url}
                    width="100%"
                    height="100%"
                    light={true}
                    playIcon={<></>}
                  />
                  {activeTab === "liked" && (
                    <div className="absolute bottom-1 left-1 text-[8px] bg-black/50 px-1 rounded z-10">
                      ❤️ {item.likes_count}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-gray-600 text-xs">
                No {activeTab} available.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Profile
