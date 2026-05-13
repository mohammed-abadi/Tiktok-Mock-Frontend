import React, { useState, useRef, useEffect } from "react"
import axios from "../../api/axios"

const VideoModal = ({ post, currentUser, onClose, onDeleteSuccess }) => {
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isReposted, setIsReposted] = useState(post.is_repost || false)
  const [isMuted, setIsMuted] = useState(false)

  // Custom Delete Confirm State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const videoRef = useRef(null)

  // Start playing immediately when opened
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log(e))
    }
  }, [])

  const handleAction = async (action) => {
    try {
      const res = await axios.post(`/posts/${post.id}/${action}/`)
      if (action === "toggle_like") {
        setLikesCount(res.data.likes_count)
        setIsLiked(res.data.status === "liked")
      } else if (action === "toggle_favorite") {
        setIsFavorited(res.data.status === "favorited")
      } else if (action === "repost") {
        setIsReposted(res.data.status === "reposted")
      }
    } catch (err) {
      console.error("Action failed:", err)
    }
  }

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/posts/${post.id}/`)
      onDeleteSuccess(post.id) // Tells Profile.jsx to remove it from the grid
    } catch (err) {
      alert("Failed to delete video.")
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      {/* CUSTOM DELETE POST CONFIRMATION */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80">
          <div className="bg-gray-900 rounded-xl p-6 w-[80%] max-w-sm border border-gray-700 shadow-2xl text-center">
            <h2 className="text-xl font-bold mb-2 text-white">Delete Video?</h2>
            <p className="text-sm text-gray-400 mb-6">
              This video will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-700 text-white py-3 rounded-md font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 text-white text-3xl z-50 hover:scale-110 drop-shadow-md"
      >
        ✕
      </button>

      <div className="relative w-full max-w-[400px] h-[80vh] bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col justify-center">
        <video
          ref={videoRef}
          src={post.media_url}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
        />

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white backdrop-blur-md"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        {/* Video Info Overlay */}
        <div className="absolute bottom-4 left-4 w-[75%] text-white z-20 pointer-events-none drop-shadow-lg">
          <h3 className="font-bold text-[16px]">
            @{post.user?.username || "creator"}
          </h3>
          <p className="text-[14px] line-clamp-3">
            {post.caption || "Check out this reel!"}
          </p>
        </div>

        {/* Interaction Sidebar */}
        <div className="absolute right-4 bottom-4 flex flex-col items-center gap-5 z-20 text-white">
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleAction("toggle_like")}
              className="text-[30px] transition-transform active:scale-75 drop-shadow-2xl"
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
            <span className="text-[12px] font-semibold drop-shadow-md">
              {likesCount}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => handleAction("toggle_favorite")}
              className="text-[30px] transition-transform active:scale-75 drop-shadow-2xl"
            >
              {isFavorited ? "🌟" : "⭐"}
            </button>
            <span className="text-[12px] font-semibold drop-shadow-md">
              Save
            </span>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => handleAction("repost")}
              className={`text-[30px] transition-transform active:scale-75 drop-shadow-2xl ${isReposted ? "text-[#fe2c55]" : ""}`}
            >
              🔁
            </button>
            <span className="text-[12px] font-semibold drop-shadow-md">
              Share
            </span>
          </div>

          {/* TRASH ICON: Only shows if the logged-in user owns this video */}
          {currentUser?.username === post.user?.username && (
            <div className="flex flex-col items-center mt-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-[26px] opacity-80 hover:opacity-100 hover:scale-110 drop-shadow-2xl transition-all"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoModal
