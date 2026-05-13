import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../api/axios"
import VideoModal from "../Profile/VideoModal"

const Discovery = () => {
  const [users, setUsers] = useState([])
  const [videos, setVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("users")
  const [selectedPost, setSelectedPost] = useState(null)

  const navigate = useNavigate()

  const fetchData = async (query = "") => {
    setLoading(true)
    try {
      const userEndpoint = query ? `/profiles/?search=${query}` : `/profiles/`
      const userRes = await axios.get(userEndpoint)
      setUsers(userRes.data.results || userRes.data)

      const videoEndpoint = query ? `/posts/?search=${query}` : `/posts/`
      const videoRes = await axios.get(videoEndpoint)
      setVideos(videoRes.data.results || videoRes.data)
    } catch (err) {
      console.error("Discovery error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    fetchData(e.target.value)
  }

  const handleFollowToggle = async (profileId, index) => {
    try {
      const updatedUsers = [...users]
      const isCurrentlyFollowing = updatedUsers[index].is_followed_by_me
      updatedUsers[index].is_followed_by_me = !isCurrentlyFollowing
      setUsers(updatedUsers)

      await axios.post(`/profiles/${profileId}/follow/`)
    } catch (err) {
      alert("Failed to follow/unfollow.")
      fetchData(searchTerm)
    }
  }

  const handleProfileClick = (userId) => {
    if (userId) navigate(`/profile/${userId}`)
  }

  const handleMessageClick = () => {
    navigate("/inbox")
  }

  const topVideos = videos
    .filter((v) => v.view_count > 10000)
    .sort((a, b) => b.view_count - a.view_count)
  const discoverVideos = videos
    .filter((v) => v.view_count <= 10000)
    .sort(() => 0.5 - Math.random())

  return (
    <div className="bg-black min-h-screen pb-24 overflow-y-auto">
      <div className="sticky top-0 bg-black/90 backdrop-blur-md pt-6 pb-2 px-4 z-20">
        <input
          type="text"
          placeholder="Search creators or videos..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-3 text-sm text-white outline-none focus:border-[#fe2c55] transition-colors shadow-lg"
        />

        <div className="flex w-full mt-4 border-b border-gray-900 justify-around text-white">
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-3 flex-1 font-bold transition-all ${activeTab === "users" ? "border-b-2 border-white text-white" : "text-gray-600"}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-3 flex-1 font-bold transition-all ${activeTab === "videos" ? "border-b-2 border-white text-white" : "text-gray-600"}`}
          >
            Videos
          </button>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">
            Searching...
          </div>
        ) : (
          <>
            {activeTab === "users" && (
              <div className="space-y-3 mt-2">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between bg-gray-900/30 p-4 rounded-3xl border border-gray-800/50"
                    >
                      <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => handleProfileClick(user.user_id)}
                      >
                        <img
                          src={
                            user.profile_picture_url ||
                            `https://ui-avatars.com/api/?name=${user.username || "User"}&background=252525&color=fff`
                          }
                          className="w-12 h-12 rounded-full object-cover border border-gray-700 bg-gray-800"
                          alt="Avatar"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white hover:underline">
                            @{user.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {user.followers_count || 0} followers
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {user.is_followed_by_me && (
                          <button
                            onClick={handleMessageClick}
                            className="bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-xl active:scale-90 transition-transform"
                          >
                            ✉️
                          </button>
                        )}
                        <button
                          onClick={() => handleFollowToggle(user.id, index)}
                          className={`text-xs font-bold px-6 py-2 rounded-xl active:scale-90 transition-all ${
                            user.is_followed_by_me
                              ? "bg-gray-800 text-gray-300 border border-gray-700"
                              : "bg-[#fe2c55] text-white"
                          }`}
                        >
                          {user.is_followed_by_me ? "Unfollow" : "Follow"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-600 text-sm italic">
                    No users found.
                  </div>
                )}
              </div>
            )}

            {activeTab === "videos" && (
              <div className="space-y-6 mt-2">
                {topVideos.length > 0 && (
                  <section>
                    <h3 className="text-white text-sm font-black mb-3 flex items-center gap-2">
                      🔥 Top Videos{" "}
                      <span className="text-gray-500 text-[10px] font-normal uppercase">
                        &gt;10k Views
                      </span>
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-4 snap-x">
                      {topVideos.map((video) => (
                        <div
                          key={video.id}
                          onClick={() => setSelectedPost(video)}
                          className="min-w-[120px] aspect-[9/16] bg-gray-900 rounded-lg relative overflow-hidden cursor-pointer snap-start flex-shrink-0"
                        >
                          <video
                            src={video.media_url}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => {
                              e.target.pause()
                              e.target.currentTime = 0
                            }}
                          />
                          <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-white z-10 backdrop-blur-sm">
                            ▶ {(video.view_count / 1000).toFixed(1)}k
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <h3 className="text-white text-sm font-black mb-3">
                    ✨ Discover
                  </h3>
                  {discoverVideos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1">
                      {discoverVideos.map((video) => (
                        <div
                          key={video.id}
                          onClick={() => setSelectedPost(video)}
                          className="aspect-[9/16] bg-gray-900 relative overflow-hidden cursor-pointer"
                        >
                          <video
                            src={video.media_url}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => {
                              e.target.pause()
                              e.target.currentTime = 0
                            }}
                          />
                          <div className="absolute bottom-1 left-1 text-[10px] font-bold text-white z-10 drop-shadow-md">
                            ▶ {video.view_count || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-600 text-sm italic">
                      No videos to discover.
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPost && (
        <VideoModal
          post={selectedPost}
          currentUser={null}
          onClose={() => setSelectedPost(null)}
          onDeleteSuccess={() => {}}
        />
      )}
    </div>
  )
}

export default Discovery
