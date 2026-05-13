import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../api/axios"

const InboxList = () => {
  const [conversations, setConversations] = useState([])
  const [followedUsers, setFollowedUsers] = useState([])
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const navigate = useNavigate()

  const currentUsername = localStorage.getItem("username")

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await axios.get("/conversations/")
      setConversations(res.data.results || res.data)
    } catch (err) {
      console.error("Error fetching conversations:", err)
    }
  }

  const handleOpenNewChat = async () => {
    try {
      const res = await axios.get("/profiles/?followed_by_me=true")
      setFollowedUsers(res.data.results || res.data)
      setShowNewChatModal(true)
    } catch (err) {
      alert("Could not load friends list.")
    }
  }

  const startChat = async (userId) => {
    try {
      const res = await axios.post("/conversations/get_or_create_direct/", {
        user_id: userId,
      })
      navigate(`/inbox/${res.data.id}`)
    } catch (err) {
      alert("Failed to start chat.")
    }
  }

  return (
    <div className="bg-black h-[100dvh] overflow-y-auto relative pb-20">
      <div className="flex justify-between items-center p-5 pt-8 bg-gray-900/50 sticky top-0 z-10 backdrop-blur-md border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white tracking-tight">Chats</h2>
        <button
          onClick={handleOpenNewChat}
          className="bg-[#fe2c55] px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
        >
          <span>✎</span> New Chat
        </button>
      </div>

      <div className="flex flex-col">
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            const otherParticipants =
              conv.participants?.filter(
                (p) => p.username !== currentUsername
              ) || []
            const isGroup = otherParticipants.length > 1
            const chatName = isGroup
              ? "Group Chat"
              : otherParticipants.length === 1
                ? `@${otherParticipants[0].username}`
                : "Just You"
            const chatAvatar =
              !isGroup && otherParticipants[0]?.profile_picture_url
                ? otherParticipants[0].profile_picture_url
                : `https://ui-avatars.com/api/?name=${chatName}&background=252525&color=fff`

            const lastMessageObj =
              conv.messages && conv.messages.length > 0
                ? conv.messages[conv.messages.length - 1]
                : null
            const lastMessageText = lastMessageObj
              ? lastMessageObj.content
              : "Tap to start chatting..."
            const lastMessageTime = lastMessageObj
              ? new Date(lastMessageObj.sent_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""

            return (
              <div
                key={conv.id}
                onClick={() => navigate(`/inbox/${conv.id}`)}
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-900 transition-colors active:bg-gray-800"
              >
                <div className="relative">
                  <img
                    src={chatAvatar}
                    className="w-14 h-14 rounded-full object-cover bg-gray-800"
                    alt="avatar"
                  />
                  {isGroup && (
                    <div className="absolute -bottom-1 -right-1 bg-gray-700 rounded-full p-1 text-[10px]">
                      👥
                    </div>
                  )}
                </div>

                <div className="flex-1 border-b border-gray-900 pb-4 pt-2 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-[16px] text-white tracking-wide">
                      {chatName}
                    </p>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {lastMessageTime}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate max-w-[220px]">
                    {lastMessageObj?.sender_name === currentUsername
                      ? `You: ${lastMessageText}`
                      : lastMessageText}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-32 text-gray-500 flex flex-col items-center">
            <span className="text-6xl mb-4 opacity-50">💬</span>
            <p className="font-bold text-xl text-gray-300">No chats yet</p>
            <p className="text-sm mt-2">
              Click New Chat to message your friends.
            </p>
          </div>
        )}
      </div>

      {showNewChatModal && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewChatModal(false)}
          />

          <div className="relative bg-gray-900 w-full h-[75vh] rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="font-bold text-white text-xl">Select Friend</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-gray-300 font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {followedUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => startChat(u.user_id)}
                  className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-2xl cursor-pointer transition-colors"
                >
                  <img
                    src={
                      u.profile_picture_url ||
                      `https://ui-avatars.com/api/?name=${u.username}&background=252525&color=fff`
                    }
                    className="w-12 h-12 rounded-full object-cover"
                    alt="avatar"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-white text-md">
                      @{u.username}
                    </span>
                  </div>
                </div>
              ))}
              {followedUsers.length === 0 && (
                <p className="text-gray-500 text-center mt-10 px-6">
                  You aren't following anyone yet. Go to Discover to find
                  creators!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InboxList
