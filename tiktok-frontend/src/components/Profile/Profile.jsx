import React, { useState, useEffect } from "react"
import axios from "../../api/axios"
import VideoModal from "./VideoModal"

const Profile = ({ onLogout }) => {
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState("posts")
  const [content, setContent] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  // Custom Confirmation Modals
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
        // Main Tab strictly filters out reposts!
        if (activeTab === "posts")
          endpoint = `/posts/?author=${profile?.username}&is_repost=false`
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

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/profiles/delete_account/")
      onLogout() // Wipes frontend state and returns to login
    } catch (err) {
      alert("Failed to delete account.")
    }
  }

  // Triggered when a video is deleted from the VideoModal
  const handlePostDeleted = (deletedPostId) => {
    setContent(content.filter((post) => post.id !== deletedPostId))
    setSelectedPost(null) // Close modal
  }

  if (!profile)
    return <div className="text-center mt-20 text-white">Loading...</div>

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white pb-24 relative">
      {/* --- CUSTOM DELETE ACCOUNT MODAL --- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full border border-gray-700 shadow-2xl text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Delete Account?</h2>
            <p className="text-sm text-gray-400 mb-6">
              This will permanently delete your profile, videos, likes, and
              messages. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-700 py-3 rounded-md font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-md font-bold transition-colors"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center pt-10 w-full max-w-sm px-6">
        <img
          src={
            profile.profile_picture_url ||
            `https://ui-avatars.com/api/?name=${profile.username}&background=252525&color=fff`
          }
          className="w-24 h-24 rounded-full border-2 border-[#fe2c55] object-cover mb-4 bg-gray-800"
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
                className="px-4 border border-gray-800 py-2 rounded text-xs text-gray-500 hover:bg-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={editData.new_username}
              onChange={(e) =>
                setEditData({ ...editData, new_username: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-sm focus:border-[#fe2c55] outline-none"
            />
            <textarea
              placeholder="Bio"
              value={editData.bio}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-sm focus:border-[#fe2c55] outline-none min-h-[80px]"
            />
            <input
              type="text"
              placeholder="Location"
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-sm focus:border-[#fe2c55] outline-none"
            />
            <input
              type="url"
              placeholder="Profile Picture URL"
              value={editData.profile_picture_url}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  profile_picture_url: e.target.value,
                })
              }
              className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-sm focus:border-[#fe2c55] outline-none"
            />

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
            {/* The Delete Account trigger button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full text-red-500 text-xs font-bold underline mt-4 text-center"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>

      {!isEditing && (
        <>
          <div className="flex w-full mt-8 border-b border-gray-900 justify-around">
            {[
              { id: "posts", label: "Posts", icon: "☰" },
              { id: "reposts", label: "Reposts", icon: "🔁" },
              { id: "liked", label: "Liked", icon: "❤️" },
              { id: "favorites", label: "Private", icon: "🔒" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 w-1/4 flex flex-col items-center transition-all ${activeTab === tab.id ? "border-b-2 border-white text-white" : "text-gray-600 hover:text-gray-400"}`}
              >
                <span className="text-xl font-bold">{tab.icon}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-[1px] w-full mt-[1px]">
            {content.length > 0 ? (
              content.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPost(item)}
                  className="aspect-[9/16] bg-gray-900 relative overflow-hidden cursor-pointer group"
                >
                  {/* NATIVE HOVER VIDEO PLAYER */}
                  <video
                    src={item.media_url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause()
                      e.target.currentTime = 0 // Reset video on mouse leave
                    }}
                  />
                  <div className="absolute bottom-1 left-1 flex items-center gap-1 text-[12px] font-bold text-white drop-shadow-md z-10">
                    <span>▶</span> {item.view_count || 0}
                  </div>
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

      {selectedPost && (
        <VideoModal
          post={selectedPost}
          currentUser={profile} // Passed so VideoModal knows if we own the video
          onClose={() => setSelectedPost(null)}
          onDeleteSuccess={handlePostDeleted} // Removes it instantly without reloading page
        />
      )}
    </div>
  )
}

export default Profile
