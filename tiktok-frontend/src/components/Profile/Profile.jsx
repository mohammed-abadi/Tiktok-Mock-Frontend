import React, { useEffect, useState } from "react"
import axios from "../../api/axios"

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const res = await axios.get("/profiles/me/")
        setProfile(res.data)
      } catch (err) {
        console.error("Profile fetch failed", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyData()
  }, [])

  const handleDelete = async (postId) => {
    if (window.confirm("Delete this reel?")) {
      try {
        await axios.delete(`/posts/${postId}/`)
        setProfile({
          ...profile,
          posts: profile.posts.filter((p) => p.id !== postId),
        })
      } catch (err) {
        console.error("Delete failed", err)
      }
    }
  }

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    )

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <div className="flex flex-col items-center pt-10 pb-6">
        <img
          src={profile.profile_picture_url || "https://via.placeholder.com/150"}
          className="w-24 h-24 rounded-full border-2 border-gray-800"
        />
        <h2 className="text-xl font-bold mt-4">@{profile.user.username}</h2>
        <p className="text-gray-400 mt-2 px-10 text-center text-sm italic">
          {profile.bio || "No bio yet."}
        </p>

        <div className="flex space-x-10 mt-6 font-semibold">
          <div className="text-center">
            <span>{profile.followers_count || 0}</span>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <span>{profile.total_likes || 0}</span>
            <p className="text-xs text-gray-500">Likes</p>
          </div>
        </div>

        <button className="mt-6 border border-gray-700 px-10 py-2 rounded font-bold text-sm">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-3 gap-0.5 mt-4">
        {profile.posts?.map((post) => (
          <div key={post.id} className="relative aspect-[3/4] group">
            <video
              src={post.media_url}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleDelete(post.id)}
              className="absolute top-1 right-1 bg-black/50 text-red-500 p-1 rounded hidden group-hover:block"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Profile
