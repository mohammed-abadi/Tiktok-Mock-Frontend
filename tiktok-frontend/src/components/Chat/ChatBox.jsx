import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"

const ChatBox = ({ currentUsername }) => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const socketRef = useRef(null)

  useEffect(() => {
    const wsPath = `${import.meta.env.VITE_WS_URL}/${roomId}/`
    const newSocket = new WebSocket(wsPath)

    newSocket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.message) setMessages((prev) => [...prev, data])
    }

    socketRef.current = newSocket
    return () => {
      if (socketRef.current) socketRef.current.close()
    }
  }, [roomId])

  const sendMessage = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN && input.trim()) {
      socketRef.current.send(
        JSON.stringify({
          message: input,
          username: currentUsername,
          conversation_id: roomId,
        })
      )
      setInput("")
    }
  }

  return (
    <div className="flex flex-col h-full bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center gap-4">
        <button onClick={() => navigate("/inbox")} className="text-white">
          ←
        </button>
        <h3 className="text-sm font-bold text-white lowercase">
          Conversation #{roomId}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.username === currentUsername ? "items-end" : "items-start"}`}
          >
            <span className="text-[10px] text-gray-500 mb-1">
              {msg.username}
            </span>
            <div
              className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${
                msg.username === currentUsername
                  ? "bg-[#fe2c55] text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-900/50 border-t border-gray-800 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-black py-2 px-4 text-sm text-white outline-none rounded-full border border-gray-700"
          placeholder="Send a message..."
        />
        <button
          onClick={sendMessage}
          className="text-[#fe2c55] font-bold text-sm"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatBox
