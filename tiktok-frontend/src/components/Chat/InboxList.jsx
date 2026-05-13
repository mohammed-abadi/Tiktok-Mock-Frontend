import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../api/axios"

const InboxList = () => {
  const [conversations, setConversations] = useState([])
  const navigate = useNavigate()
  const myId = parseInt(localStorage.getItem("userId"))

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get("/conversations/")
        setConversations(res.data.results || res.data)
      } catch (err) {
        console.error("Error fetching conversations:", err)
      }
    }
    fetchConversations()
  }, [])

  return (
    <div className="p-4 bg-black h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Messages</h2>
        <button className="bg-[#fe2c55] p-2 rounded-full text-white text-xs">
          New Chat
        </button>
      </div>

      <div className="space-y-3">
        {conversations.map((conv) => {
          const otherParticipants =
            conv.participants_details?.filter((p) => p.id !== myId) || []
          const chatName =
            otherParticipants.length > 1
              ? "Group Chat"
              : `@${otherParticipants[0]?.username || "User"}`

          return (
            <div
              key={conv.id}
              onClick={() => navigate(`/inbox/${conv.id}`)}
              className="flex items-center gap-4 p-4 bg-gray-900/40 border border-gray-800 rounded-2xl cursor-pointer hover:bg-gray-800 transition-all"
            >
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-400">
                {otherParticipants.length > 1 ? "👥" : "👤"}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{chatName}</p>
                <p className="text-xs text-gray-500 truncate">
                  {conv.last_message || "Open to view messages"}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InboxList
