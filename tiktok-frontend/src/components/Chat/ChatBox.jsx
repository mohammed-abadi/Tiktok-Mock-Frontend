import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../../api/axios"

const ChatBox = ({ currentUsername }) => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [conversationInfo, setConversationInfo] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const [editingMsgId, setEditingMsgId] = useState(null)
  const [selectedMsgId, setSelectedMsgId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [msgRes, convRes] = await Promise.all([
          axios.get(`/messages/?conversation=${roomId}`),
          axios.get(`/conversations/${roomId}/`),
        ])
        setMessages(msgRes.data.results || msgRes.data)
        setConversationInfo(convRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchHistory()
  }, [roomId])

  useEffect(() => {
    const wsPath = `${import.meta.env.VITE_WS_URL}/${roomId}/`
    const newSocket = new WebSocket(wsPath)

    newSocket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.action === "send") {
        setMessages((prev) => [
          ...prev,
          {
            id: data.msg_id,
            content: data.message,
            sender_name: data.username,
            sent_at: new Date().toISOString(),
            is_edited: false,
          },
        ])
      } else if (data.action === "edit") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.msg_id
              ? { ...m, content: data.message, is_edited: true }
              : m
          )
        )
      } else if (data.action === "delete") {
        setMessages((prev) => prev.filter((m) => m.id !== data.msg_id))
      }
    }
    socketRef.current = newSocket
    return () => {
      if (socketRef.current) socketRef.current.close()
    }
  }, [roomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN && input.trim()) {
      if (editingMsgId) {
        socketRef.current.send(
          JSON.stringify({
            action: "edit",
            msg_id: editingMsgId,
            message: input,
          })
        )
        setEditingMsgId(null)
      } else {
        socketRef.current.send(
          JSON.stringify({
            action: "send",
            message: input,
            username: currentUsername,
            room_id: roomId,
          })
        )
      }
      setInput("")
    }
  }

  const handleDelete = (msgId) => {
    socketRef.current.send(JSON.stringify({ action: "delete", msg_id: msgId }))
    setConfirmDeleteId(null)
    setSelectedMsgId(null)
  }

  const handleBackgroundClick = () => {
    setSelectedMsgId(null)
    setConfirmDeleteId(null)
  }

  const otherParticipants =
    conversationInfo?.participants?.filter(
      (p) => p.username !== currentUsername
    ) || []
  const chatName =
    otherParticipants.length > 1
      ? "Group Chat"
      : otherParticipants[0]?.username
        ? `@${otherParticipants[0].username}`
        : "Chat"

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black text-white"
      onClick={handleBackgroundClick}
    >
      <div className="p-4 border-b border-gray-900 bg-gray-900/50 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/inbox")} className="text-3xl">
            ‹
          </button>
          <h3 className="font-bold">{chatName}</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.sender_name === currentUsername
          const isSelected = selectedMsgId === msg.id
          const isPendingDelete = confirmDeleteId === msg.id

          return (
            <div
              key={msg.id}
              className={`flex flex-col relative ${isMe ? "items-end" : "items-start"}`}
            >
              {!isMe && (
                <span className="text-[10px] text-gray-500 mb-1 ml-1">
                  @{msg.sender_name}
                </span>
              )}

              <div className="relative max-w-[80%]">
                {isMe && isSelected && !editingMsgId && (
                  <div className="absolute -top-10 right-0 bg-gray-800 rounded-lg shadow-2xl flex overflow-hidden border border-gray-700 z-30 animate-in fade-in zoom-in duration-100">
                    {!isPendingDelete ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingMsgId(msg.id)
                            setInput(msg.content)
                            setSelectedMsgId(null)
                          }}
                          className="px-4 py-2 text-xs font-bold hover:bg-gray-700 transition-colors border-r border-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setConfirmDeleteId(msg.id)
                          }}
                          className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-gray-700 transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center">
                        <span className="px-3 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          Confirm?
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(msg.id)
                          }}
                          className="px-4 py-2 text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setConfirmDeleteId(null)
                          }}
                          className="px-4 py-2 text-xs font-bold hover:bg-gray-700 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isMe) setSelectedMsgId(isSelected ? null : msg.id)
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-[15px] cursor-pointer transition-all active:scale-95 ${
                    isMe
                      ? "bg-[#fe2c55] text-white rounded-br-sm"
                      : "bg-gray-800 text-gray-200 rounded-bl-sm"
                  } ${isSelected ? "ring-2 ring-white/50" : ""}`}
                >
                  {msg.content}
                </div>

                {msg.is_edited && (
                  <span
                    className={`text-[9px] opacity-40 absolute -bottom-4 ${isMe ? "right-0" : "left-0"}`}
                  >
                    (edited)
                  </span>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div
        className="p-4 bg-gray-900 border-t border-gray-800 flex flex-col gap-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {editingMsgId && (
          <div className="flex justify-between items-center bg-gray-800 px-3 py-1 rounded-t-lg text-[10px] text-gray-400 font-bold uppercase">
            <span>Editing Message</span>
            <button
              onClick={() => {
                setEditingMsgId(null)
                setInput("")
              }}
              className="text-white"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className={`flex-1 bg-black p-3 text-sm text-white outline-none border transition-all ${editingMsgId ? "border-blue-500 rounded-lg" : "rounded-full border-gray-700"}`}
            placeholder={editingMsgId ? "Update your message..." : "Message..."}
          />
          <button
            onClick={handleSubmit}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${editingMsgId ? "bg-blue-600" : "bg-[#fe2c55]"}`}
          >
            {editingMsgId ? "✓" : "↑"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
