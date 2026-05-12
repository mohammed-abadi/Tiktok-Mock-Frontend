import React, { useState } from "react"

const CommentDrawer = ({ isOpen, onClose, comments, reelId, onAddComment }) => {
  const [text, setText] = useState("")

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#121212]/95 backdrop-blur-xl rounded-t-2xl h-[70vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-800 text-center font-bold text-sm text-white">
          {comments.length} comments
          <button onClick={onClose} className="absolute right-4 text-gray-400">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-white">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <img
                src={
                  c.user?.profile?.profile_picture_url ||
                  "https://via.placeholder.com/150"
                }
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-xs text-gray-500 font-bold">
                  @{c.user?.username}
                </p>
                <p className="text-sm mt-1">{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-gray-900 p-2 rounded-full px-4 text-sm outline-none text-white"
            placeholder="Add comment..."
          />
          <button
            onClick={() => {
              onAddComment(reelId, text)
              setText("")
            }}
            className="text-[#fe2c55] font-bold px-2"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentDrawer
