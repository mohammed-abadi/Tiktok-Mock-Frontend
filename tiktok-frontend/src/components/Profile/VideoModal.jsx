import React, { useState, useRef, useEffect } from "react"
import axios from "../../api/axios"

const VideoModal = ({ post, currentUser, onClose, onDeleteSuccess }) => {
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isReposted, setIsReposted] = useState(post.is_repost || false)
  const [isMuted, setIsMuted] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0)

  const videoRef = useRef(null)

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
      onDeleteSuccess(post.id)
    } catch (err) {
      alert("Failed to delete video.")
      setShowDeleteConfirm(false)
    }
  }

  const toggleComments = async (e) => {
    e.stopPropagation()
    setShowComments(!showComments)
    if (!showComments) {
      try {
        const res = await axios.get(`/comments/?post=${post.id}`)
        setComments(res.data.results || res.data)
      } catch (err) {
        console.error("Failed to load comments", err)
      }
    }
  }

  const handlePostComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const res = await axios.post("/comments/", {
        post: post.id,
        body: newComment,
      })
      setComments([res.data, ...comments])
      setNewComment("")
      setCommentsCount((prev) => prev + 1)
    } catch (err) {
      console.error("Failed to post comment", err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
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

      {!showComments && (
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-white text-3xl z-50 hover:scale-110 drop-shadow-md"
        >
          ✕
        </button>
      )}

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

        <div className="absolute bottom-4 left-4 w-[75%] text-white z-20 pointer-events-none drop-shadow-lg">
          <h3 className="font-bold text-[16px]">
            @{post.user?.username || "creator"}
          </h3>
          <p className="text-[14px] line-clamp-3">
            {post.caption || "Check out this reel!"}
          </p>
        </div>

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
              onClick={toggleComments}
              className="text-[30px] transition-transform active:scale-75 drop-shadow-2xl"
            >
              💬
            </button>
            <span className="text-[12px] font-semibold drop-shadow-md">
              {commentsCount}
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

        {showComments && (
          <>
            <div
              className="absolute inset-0 z-30"
              onClick={() => setShowComments(false)}
            />
            <div className="absolute bottom-0 left-0 w-full h-[65%] bg-gray-900 rounded-t-2xl z-40 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <h3 className="text-white font-bold text-sm">
                  {commentsCount} comments
                </h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-gray-400 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${comment.user?.username || "User"}&background=252525&color=fff`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-gray-400 text-xs font-bold">
                        @{comment.user?.username || "user"}
                      </p>
                      <p className="text-white text-sm mt-1">{comment.body}</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-gray-500 text-center text-sm mt-10">
                    No comments yet. Be the first!
                  </p>
                )}
              </div>

              <form
                onSubmit={handlePostComment}
                className="p-4 border-t border-gray-800 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Add comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm outline-none focus:border focus:border-gray-600"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="text-[#fe2c55] font-bold px-2 disabled:opacity-50"
                >
                  Post
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VideoModal
