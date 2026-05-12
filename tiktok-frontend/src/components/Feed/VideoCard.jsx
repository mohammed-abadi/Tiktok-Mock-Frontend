import React, { useState, useRef } from "react"
import { Heart, MessageCircle, Share2, Music } from "lucide-react"
import CommentDrawer from "./CommentDrawer"
import axios from "../../api/axios"

const VideoCard = ({ reel, onInteractionRequirement, isAuthenticated }) => {
  const [playing, setPlaying] = useState(false)
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [likes, setLikes] = useState(reel.likes_count || 0)
  const [isLiked, setIsLiked] = useState(reel.is_user_liked || false)
  const videoRef = useRef(null)

  // Toggle Video Play/Pause
  const onVideoPress = () => {
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  // CRUD: Update (Toggle Like)
  const handleLike = async () => {
    if (!isAuthenticated) {
      return onInteractionRequirement() // Trigger Auth Modal for guests
    }

    try {
      const res = await axios.post(`/posts/${reel.id}/toggle_like/`)
      setIsLiked(res.data.status === "liked")
      setLikes(res.data.likes_count)
    } catch (err) {
      console.error("Error toggling like", err)
    }
  }

  // Interaction Guard for Comments
  const handleCommentClick = () => {
    if (!isAuthenticated) {
      onInteractionRequirement() // Trigger Auth Modal for guests
    } else {
      setIsCommentOpen(true)
    }
  }

  return (
    <div className="relative h-screen w-full bg-black snap-start flex items-center justify-center">
      <video
        ref={videoRef}
        onClick={onVideoPress}
        className="h-full w-full object-contain cursor-pointer"
        loop
        src={reel.media_url}
      ></video>

      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-40">
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={handleLike}
        >
          <Heart
            size={36}
            fill={isLiked ? "#fe2c55" : "transparent"}
            color={isLiked ? "#fe2c55" : "white"}
          />
          <span className="text-white text-xs font-bold mt-1">{likes}</span>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={handleCommentClick}
        >
          <MessageCircle size={36} color="white" />
          <span className="text-white text-xs font-bold mt-1">
            {reel.comments_count || 0}
          </span>
        </div>

        <div className="flex flex-col items-center cursor-pointer">
          <Share2 size={36} color="white" />
          <span className="text-white text-xs font-bold mt-1">Share</span>
        </div>
      </div>

      <div className="absolute bottom-8 left-4 text-white space-y-3 z-40 max-w-[80%]">
        <h3 className="font-bold text-lg">@{reel.user?.username || "user"}</h3>
        <p className="text-sm line-clamp-2">{reel.caption}</p>

        <div className="flex items-center space-x-2">
          <Music size={14} />
          <marquee className="w-32 text-xs">
            Original Sound - {reel.user?.username}
          </marquee>
        </div>
      </div>

      <CommentDrawer
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        reelId={reel.id}
        comments={reel.comments || []}
        onAddComment={(id, text) => {
          console.log(`Adding comment to ${id}: ${text}`)
        }}
      />

      {!playing && (
        <div
          onClick={onVideoPress}
          className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none"
        >
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
            <Heart size={48} color="white" className="opacity-50" />
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoCard
