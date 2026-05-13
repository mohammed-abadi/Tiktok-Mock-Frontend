import React, { useState } from "react"
import ReactPlayer from "react-player"

const VideoCard = ({ post, isAuthenticated, onInteractionRequirement }) => {
  const [isReady, setIsReady] = useState(false)

  return (
    <div className="relative h-screen w-full bg-black snap-start flex items-center justify-center overflow-hidden">
      <div className="w-full h-full">
        <ReactPlayer
          url={post.media_url}
          width="100%"
          height="100%"
          playing={isReady}
          loop={true}
          muted={true}
          playsinline={true}
          onReady={() => setIsReady(true)}
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                disablekb: 1,
                origin: window.location.origin,
              },
            },
          }}
          onError={(e) => console.log("Video playback interrupted", e)}
          className="react-player"
        />
      </div>

      <div className="absolute right-4 bottom-28 flex flex-col items-center space-y-6 z-10">
        <div className="flex flex-col items-center">
          <img
            src={post.user?.profile_pic || "https://via.placeholder.com/150"}
            className="w-12 h-12 rounded-full border-2 border-white mb-1 object-cover"
            alt="User"
          />
        </div>
        <div className="flex flex-col items-center">
          <button
            className="text-white text-2xl transition-transform active:scale-125"
            onClick={!isAuthenticated ? onInteractionRequirement : null}
          >
            ❤️
          </button>
          <span className="text-white text-xs font-bold">
            {post.likes_count?.toLocaleString() || 0}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="text-white text-2xl transition-transform active:scale-125"
            onClick={!isAuthenticated ? onInteractionRequirement : null}
          >
            💬
          </button>
          <span className="text-white text-xs font-bold">
            {post.comments_count?.toLocaleString() || 0}
          </span>
        </div>
      </div>

      <div className="absolute left-4 bottom-10 text-white max-w-[80%] z-10 pointer-events-none">
        <p className="font-bold text-lg mb-1 drop-shadow-lg">
          @{post.user?.username}
        </p>
        <p className="text-sm line-clamp-2 drop-shadow-md">{post.caption}</p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
            👁️ {post.view_count?.toLocaleString() || 0}
          </span>
          {post.topics?.map((topic) => (
            <span
              key={topic.id}
              className="text-xs font-semibold text-[#fe2c55] drop-shadow-sm"
            >
              #{topic.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoCard
