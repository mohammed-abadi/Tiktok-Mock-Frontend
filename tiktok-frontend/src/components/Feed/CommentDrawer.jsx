import React, { useState } from "react"
import { X, Send } from "lucide-react"

const CommentDrawer = ({ isOpen, onClose, comments, reelId, onAddComment }) => {
  const [newComment, setNewComment] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    onAddComment(reelId, newComment)
    setNewComment("")
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40">
      {/* Click overlay to close */}
      <div className="flex-1" onClick={onClose}></div>

      {/* Drawer Content */}
      <div className="bg-white rounded-t-xl h-[70%] flex flex-col text-black animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-sm">{comments.length} comments</span>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img
                src={
                  comment.user.profile?.profile_picture_url ||
                  "https://via.placeholder.com/150"
                }
                className="w-8 h-8 rounded-full object-cover"
                alt="user"
              />
              <div>
                <p className="text-xs font-bold text-gray-500">
                  @{comment.user.username}
                </p>
                <p className="text-sm">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Add comment..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="text-[#fe2c55]">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default CommentDrawer
