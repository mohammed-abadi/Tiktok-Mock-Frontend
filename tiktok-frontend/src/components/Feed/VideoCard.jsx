import React, { useRef, useEffect, useState } from "react"
import { Heart, MessageCircle, Share2, Music } from "lucide-react"
import axios from "../../api/axios"
import CommentDrawer from "./CommentDrawer" // Ensure you created this file

const VideoCard = ({ reel }) => {
  const [playing, setPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(reel.is_liked)
  const [likesCount, setLikesCount] = useState(reel.likes_count)
  const [showHeart, setShowHeart] = useState(false)
  const [lastTap, setLastTap] = useState(0)

  // Comment Drawer State
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [currentComments, setCurrentComments] = useState(reel.comments || [])

  const videoRef = useRef(null)

  useEffect(() => {
    const options = { threshold: 0.8 }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current.play()
          setPlaying(true)
        } else {
          videoRef.current.pause()
          setPlaying(false)
        }
      })
    }, options)

    if (videoRef.current) observer.observe(videoRef.current)
    return () => observer.disconnect()
  }, [])

  const handleLikeAction = async () => {
    const wasLiked = isLiked
    setIsLiked(!wasLiked)
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1))

    try {
      const response = await axios.post(`/posts/${reel.id}/toggle_like/`)
      setLikesCount(response.data.likes_count)
    } catch (err) {
      setIsLiked(wasLiked)
      setLikesCount(reel.likes_count)
      console.error("Like failed:", err)
    }
  }

  const handleAddComment = async (postId, text) => {
    try {
      const response = await axios.post("/comments/", {
        post: postId,
        body: text,
      })
      // Prepend the new comment so it shows at the top
      setCurrentComments([response.data, ...currentComments])
    } catch (err) {
      console.error("Failed to post comment:", err)
    }
  }

  const handleVideoInteraction = (e) => {
    const now = Date.now()
    const DOUBLE_PRESS_DELAY = 300

    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 800)
      if (!isLiked) {
        handleLikeAction()
      }
    } else {
      if (playing) {
        videoRef.current.pause()
        setPlaying(false)
      } else {
        videoRef.current.play()
        setPlaying(true)
      }
    }
    setLastTap(now)
  }

  return (
    <div className="relative h-screen w-full snap-start bg-black flex items-center justify-center overflow-hidden">
      {/* 1. The Video Component */}
      <video
        ref={videoRef}
        onClick={handleVideoInteraction}
        loop
        playsInline
        muted
        className="h-full w-full object-contain cursor-pointer"
        src={reel.media_url}
      />

      {/* Double Tap Heart Animation Overlay */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <Heart
            size={120}
            fill="#fe2c55"
            color="#fe2c55"
            className="animate-ping opacity-80"
          />
        </div>
      )}

      {/* 2. Right Sidebar (Action Icons) */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-5 text-white z-20">
        <div className="relative mb-4">
          <img
            src={
              reel.user?.profile?.profile_picture_url ||
              "https://via.placeholder.com/150"
            }
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
            alt="user-avatar"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#fe2c55] rounded-full p-0.5">
            <span className="text-xs">+</span>
          </div>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={handleLikeAction}
        >
          <Heart
            size={35}
            fill={isLiked ? "#fe2c55" : "none"}
            color={isLiked ? "#fe2c55" : "white"}
          />
          <span className="text-xs font-semibold">{likesCount}</span>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setIsCommentOpen(true)}
        >
          <MessageCircle size={35} color="white" />
          <span className="text-xs font-semibold">
            {currentComments.length}
          </span>
        </div>

        <div className="flex flex-col items-center cursor-pointer">
          <Share2 size={35} color="white" />
          <span className="text-xs font-semibold">Share</span>
        </div>

        <div className="animate-spin-slow pt-4">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-black rounded-full border-4 border-gray-700 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Footer (Info) */}
      <div className="absolute bottom-6 left-4 text-white w-full pr-20 z-10 pointer-events-none">
        <h3 className="font-bold mb-2 text-lg pointer-events-auto">
          @{reel.user?.username}
        </h3>
        <p className="text-sm mb-3 line-clamp-2 leading-snug pointer-events-auto">
          {reel.caption}
        </p>

        <div className="flex flex-wrap gap-2 mb-3 pointer-events-auto">
          {reel.topics?.map((t) => (
            <span
              key={t.id}
              className="text-xs font-bold hover:underline cursor-pointer"
            >
              #{t.name}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <Music size={15} />
          <div className="overflow-hidden w-40">
            <p className="text-sm whitespace-nowrap animate-marquee">
              Original Sound - {reel.user?.username}
            </p>
          </div>
        </div>
      </div>

      {/* Shadow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

      {/* Comment Drawer Component */}
      <CommentDrawer
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        comments={currentComments}
        reelId={reel.id}
        onAddComment={handleAddComment}
      />
    </div>
  )
}

export default VideoCard
