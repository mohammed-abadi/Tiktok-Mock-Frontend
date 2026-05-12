import React, { useEffect, useState, useRef } from "react"
import axios from "../../api/axios"

const ChatBox = ({ roomId }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const socketRef = useRef(null)

  useEffect(() => {
    // Fetch History (Read CRUD)
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/conversations/${roomId}/`)
        setMessages(res.data.messages)
      } catch (err) {
        console.error(err)
      }
    }
    fetchHistory()

    // Connect WebSocket
    const wsUrl = `${import.meta.env.VITE_WS_URL}/${roomId}/`
    socketRef.current = new WebSocket(wsUrl)

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      setMessages((prev) => [...prev, data.message])
    }

    return () => socketRef.current.close()
  }, [roomId])

  const sendMessage = () => {
    if (input.trim()) {
      socketRef.current.send(JSON.stringify({ message: input }))
      setInput("")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4 pb-24">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[70%] ${msg.is_me ? "bg-[#fe2c55] self-end ml-auto" : "bg-gray-800 self-start"}`}
          >
            {msg.body}
          </div>
        ))}
      </div>
      <div className="flex p-2 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 bg-gray-900 rounded outline-none"
          placeholder="Send a message..."
        />
        <button onClick={sendMessage} className="bg-[#fe2c55] px-4 rounded">
          Send
        </button>
      </div>
    </div>
  )
}
export default ChatBox
