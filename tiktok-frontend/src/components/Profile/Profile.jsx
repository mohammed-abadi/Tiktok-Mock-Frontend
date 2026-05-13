import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../../api/axios"
import VideoModal from "./VideoModal"

const Profile = ({ onLogout }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [content, setContent] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [isFollowed, setIsFollowed] = useState(false)

  const [editData, setEditData] = useState({
    bio: "",
    location: "",
    new_username: "",
    profile_picture_url: "",
  })

  const [passwordData, setPasswordData] = useState({
    new_password: "",
    password_confirm: "",
  })

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const meRes = await axios.get("/profiles/me/")
        const myProfile = meRes.data
        const myUserId = myProfile.user_id?.toString()

        if (!id || id === myUserId) {
          setProfile(myProfile)
          setIsOwnProfile(true)
          setEditData({
            bio: myProfile.bio || "",
            location: myProfile.location || "",
            new_username: myProfile.username || "",
            profile_picture_url: myProfile.profile_picture_url || "",
          })
        } else {
          const publicRes = await axios.get(`/profiles/?user=${id}`)
          const foundProfile = publicRes.data.results?.[0] || publicRes.data[0]
          setProfile(foundProfile)
          setIsOwnProfile(false)
          setIsFollowed(foundProfile?.is_followed_by_me)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfileData()
  }, [id])

  useEffect(() => {
    const fetchTabContent = async () => {
      try {
        let endpoint = "/posts/"
        if (activeTab === "posts")
          endpoint = `/posts/?author=${profile?.username}&is_repost=false`
        if (activeTab === "reposts")
          endpoint = `/posts/?is_repost=true&author=${profile?.username}`
        if (activeTab === "favorites" && isOwnProfile)
          endpoint = `/posts/?favorited_by_me=true`

        const res = await axios.get(endpoint)
        setContent(res.data.results || res.data)
      } catch (err) {
        console.error(err)
      }
    }
    if (profile && !isEditing) fetchTabContent()
  }, [activeTab, profile, isEditing, isOwnProfile])

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
      if (passwordData.new_password) {
        await axios.post("/profiles/change_password/", passwordData)
      }

      setIsEditing(false)
      window.location.reload()
    } catch (err) {
      alert(err.response?.data?.error || "Update failed")
    }
  }

  const handleFollow = async () => {
    try {
      await axios.post(`/profiles/${profile.id}/follow/`)
      setIsFollowed(!isFollowed)
      setProfile((prev) => ({
        ...prev,
        followers_count: isFollowed
          ? prev.followers_count - 1
          : prev.followers_count + 1,
      }))
    } catch (err) {}
  }

  const handleMessage = async () => {
    try {
      if (!profile || !profile.user_id) return
      const res = await axios.post("/conversations/get_or_create_direct/", {
        user_id: profile.user_id,
      })
      navigate(`/inbox/${res.data.id}`)
    } catch (err) {
      alert("Failed to start chat")
    }
  }

  const onPostDeleted = (postId) => {
    setContent(content.filter((p) => p.id !== postId))
    setSelectedPost(null)
  }

  if (!profile)
    return <div className="text-center mt-20 text-white">Loading...</div>

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white pb-24 relative">
      <div className="flex flex-col items-center pt-10 w-full max-w-sm px-6">
        <img
          src={
            profile.profile_picture_url ||
            `https://ui-avatars.com/api/?name=${profile.username}`
          }
          className="w-24 h-24 rounded-full border-2 border-[#fe2c55] object-cover mb-4 bg-gray-800"
          alt="Avatar"
        />

        {!isEditing ? (
          <div className="flex flex-col items-center w-full text-center">
            <h2 className="text-xl font-bold">@{profile.username}</h2>
            <p className="text-sm text-gray-200 mb-1">
              {profile.bio || "No bio yet"}
            </p>
            <p className="text-[10px] text-gray-500 mb-2">
              📍 {profile.location || "Global"}
            </p>

            <div className="flex gap-6 mb-4 mt-2">
              <div className="flex flex-col items-center">
                <span className="font-bold">
                  {profile.following_count || 0}
                </span>
                <span className="text-gray-500 text-[11px]">Following</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">
                  {profile.followers_count || 0}
                </span>
                <span className="text-gray-500 text-[11px]">Followers</span>
              </div>
            </div>

            <div className="flex w-full gap-2">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 border border-gray-800 py-2 rounded font-bold text-sm hover:bg-gray-900 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={onLogout}
                    className="px-4 border border-gray-800 py-2 rounded text-xs text-gray-500 hover:bg-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFollow}
                    className={`flex-1 py-2 rounded font-bold text-sm transition-all ${isFollowed ? "bg-gray-800" : "bg-[#fe2c55]"}`}
                  >
                    {isFollowed ? "Following" : "Follow"}
                  </button>
                  <button
                    onClick={handleMessage}
                    className="flex-1 border border-gray-800 py-2 rounded font-bold text-sm hover:bg-gray-900 transition-colors"
                  >
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Account Info
            </h3>
            <input
              type="text"
              placeholder="Username"
              value={editData.new_username}
              onChange={(e) =>
                setEditData({ ...editData, new_username: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-sm text-white outline-none"
            />
            <input
              type="text"
              placeholder="Profile Image URL"
              value={editData.profile_picture_url}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  profile_picture_url: e.target.value,
                })
              }
              className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-sm text-white outline-none"
            />
            <textarea
              placeholder="Bio"
              value={editData.bio}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-sm min-h-[80px] text-white outline-none"
            />
            <input
              type="text"
              placeholder="Location"
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-sm text-white outline-none"
            />

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-2">
              Security
            </h3>
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password: e.target.value,
                })
              }
              className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-sm text-white outline-none"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.password_confirm}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  password_confirm: e.target.value,
                })
              }
              className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-sm text-white outline-none"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-[#fe2c55] py-2 rounded font-bold"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-800 py-2 rounded font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <>
          <div className="flex w-full mt-6 border-b border-gray-900 justify-around">
            <button
              onClick={() => setActiveTab("posts")}
              className={`pb-3 px-4 font-bold text-sm transition-all ${activeTab === "posts" ? "border-b-2 border-white text-white" : "text-gray-500"}`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("reposts")}
              className={`pb-3 px-4 font-bold text-sm transition-all ${activeTab === "reposts" ? "border-b-2 border-white text-white" : "text-gray-500"}`}
            >
              Reposts
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab("favorites")}
                className={`pb-3 px-4 font-bold text-sm transition-all ${activeTab === "favorites" ? "border-b-2 border-white text-white" : "text-gray-500"}`}
              >
                Favorites
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-[2px] w-full mt-1">
            {content.length > 0 ? (
              content.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPost(item)}
                  className="aspect-[9/16] bg-gray-900 overflow-hidden cursor-pointer relative group"
                >
                  {item.media_url.includes("youtube") ||
                  item.media_url.includes("youtu.be") ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-[10px] text-gray-400">
                      YouTube
                    </div>
                  ) : (
                    <video
                      src={item.media_url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-gray-600 text-sm italic">
                No videos here yet.
              </div>
            )}
          </div>
        </>
      )}

      {selectedPost && (
        <VideoModal
          post={selectedPost}
          currentUser={profile}
          onClose={() => setSelectedPost(null)}
          onDeleteSuccess={onPostDeleted}
        />
      )}
    </div>
  )
}
export default Profile
