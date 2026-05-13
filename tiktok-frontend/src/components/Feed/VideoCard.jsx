import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../api/axios"

const VideoCard = ({ post, isAuthenticated, onInteractionRequirement }) => {
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const [isReposted, setIsReposted] = useState(post.is_repost || false)

  const [isVisible, setIsVisible] = useState(false)
  const [isManuallyPaused, setIsManuallyPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasRecordedView, setHasRecordedView] = useState(false)

  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!videoRef.current) return
    if (isVisible && !isManuallyPaused) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [isVisible, isManuallyPaused])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting && !hasRecordedView && isAuthenticated) {
          recordDistinctView()
        }
      },
      { threshold: 0.6 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [hasRecordedView, isAuthenticated])

  const recordDistinctView = async () => {
    try {
      await axios.post(`/posts/${post.id}/record_view/`)
      setHasRecordedView(true)
    } catch (err) {}
  }

  const handleAction = async (action) => {
    if (!isAuthenticated) return onInteractionRequirement()
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

  const handleProfileClick = (e) => {
    e.stopPropagation()
    const userId = typeof post.user === "object" ? post.user?.id : post.user
    if (userId) navigate(`/profile/${userId}`)
  }

  const handleFollowFromCard = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) return onInteractionRequirement()
    const userId = typeof post.user === "object" ? post.user?.id : post.user
    try {
      await axios.post(`/profiles/${userId}/follow/`)
      setIsFollowed(true)
    } catch (err) {}
  }

  const togglePlay = () => setIsManuallyPaused(!isManuallyPaused)

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full bg-black snap-start flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={post.media_url}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
        />
      </div>

      {isManuallyPaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-white text-7xl opacity-50 drop-shadow-2xl">
            ▶
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10"></div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsMuted(!isMuted)
        }}
        className="absolute top-20 right-4 z-20 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white backdrop-blur-md transition-all"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* FEED INFO OVERLAY */}
      <div className="absolute left-4 bottom-24 w-[70%] text-white z-20 flex flex-col gap-1 pointer-events-none drop-shadow-md">
        {/* THE REPOST BADGE */}
        {post.is_repost && (
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full w-max flex items-center mb-1">
            <span className="text-gray-200 text-[12px] font-bold">
              🔁 {post.user?.username} reposted
            </span>
          </div>
        )}

        <h3
          onClick={handleProfileClick}
          className="font-bold text-[17px] cursor-pointer hover:underline w-max pointer-events-auto"
        >
          @{post.user?.username || "creator"}
        </h3>

        {/* LINE CLAMP truncates long captions natively */}
        <p className="text-[14px] line-clamp-2 font-medium">
          {post.caption || "Check out this reel!"}
        </p>
      </div>

      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-20 text-white">
        <div
          className="relative cursor-pointer mb-2 group"
          onClick={handleProfileClick}
        >
          <img
            src={
              post.user?.profile_picture_url ||
              `https://ui-avatars.com/api/?name=${post.user?.username || "User"}&background=252525&color=fff&size=150`
            }
            alt="Profile"
            className="w-[48px] h-[48px] rounded-full border-[1.5px] border-white object-cover shadow-lg bg-gray-800"
          />
          {!isFollowed && (
            <div
              onClick={handleFollowFromCard}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#fe2c55] rounded-full w-5 h-5 flex items-center justify-center border-2 border-black hover:scale-110 transition-transform"
            >
              <span className="text-white text-lg font-bold leading-none mb-[2px]">
                +
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => handleAction("toggle_like")}
            className="text-[34px] transition-transform active:scale-75 drop-shadow-2xl"
          >
            {isLiked ? "❤️" : "🤍"}
          </button>
          <span className="text-[13px] font-semibold">{likesCount}</span>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => handleAction("toggle_favorite")}
            className="text-[34px] transition-transform active:scale-75 drop-shadow-2xl"
          >
            {isFavorited ? "🌟" : "⭐"}
          </button>
          <span className="text-[13px] font-semibold">Save</span>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => handleAction("repost")}
            className={`text-[34px] transition-transform active:scale-75 drop-shadow-2xl ${isReposted ? "text-[#fe2c55]" : ""}`}
          >
            🔁
          </button>
          <span className="text-[13px] font-semibold">Share</span>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
