import React from "react"

const VideoCard = ({ post }) => {
  return (
    <div className="relative h-screen w-full bg-black snap-start flex items-center justify-center">
      <video
        src={post.media_url}
        className="h-full w-full object-contain"
        loop
        muted
        autoPlay
      />

      <div className="absolute right-4 bottom-28 flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center">
          <img
            src={post.user.profile_pic}
            className="w-12 h-12 rounded-full border-2 border-white mb-1"
            alt="User"
          />
        </div>
        <div className="flex flex-col items-center">
          <button className="text-white text-2xl">❤️</button>
          <span className="text-white text-xs font-bold">
            {post.likes_count}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <button className="text-white text-2xl">💬</button>
          <span className="text-white text-xs font-bold">
            {post.comments_count}
          </span>
        </div>
      </div>

      <div className="absolute left-4 bottom-10 text-white max-w-[80%]">
        <p className="font-bold text-lg mb-1">@{post.user.username}</p>
        <p className="text-sm line-clamp-2">{post.caption}</p>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
            👁️ {post.view_count.toLocaleString()}
          </span>
          {post.topics?.map((topic) => (
            <span
              key={topic.id}
              className="text-xs font-semibold text-[#fe2c55]"
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
