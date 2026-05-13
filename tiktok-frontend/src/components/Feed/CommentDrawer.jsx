import React, { useState } from "react"

const CommentDrawer = ({ comments, onPostComment }) => {
  const [newComment, setNewComment] = useState("")

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white rounded-t-xl p-4">
      <div className="text-center font-bold border-b border-gray-800 pb-3 mb-4">
        Comments
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400">
                @{comment.user.username}
              </p>
              <p className="text-sm">{comment.body}</p>
              {comment.has_replies && (
                <button className="text-xs text-gray-500 mt-1 font-bold">
                  — View replies
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800 pt-4 flex space-x-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add comment..."
          className="flex-1 bg-gray-900 p-2 rounded-full outline-none text-sm"
        />
        <button
          onClick={() => {
            onPostComment(newComment)
            setNewComment("")
          }}
          className="text-[#fe2c55] font-bold px-2"
        >
          Post
        </button>
      </div>
    </div>
  )
}

export default CommentDrawer
