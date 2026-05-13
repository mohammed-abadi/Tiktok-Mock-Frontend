import React, { useState, useEffect } from "react"

const ChatBox = ({ roomId, currentUsername }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const wsPath = `wss://your-app-name.onrender.com/ws/chat/${roomId}/`
    const newSocket = new WebSocket(wsPath)

    newSocket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      setMessages((prev) => [...prev, data])
    }

    setSocket(newSocket)
    return () => newSocket.close()
  }, [roomId])

  const sendMessage = () => {
    if (socket && input) {
      socket.send(
        JSON.stringify({
          message: input,
          username: currentUsername,
          room_id: roomId,
        })
      )
      setInput("")
    }
  }

  return (
    <div className="flex flex-col h-[400px] bg-gray-900 p-4 rounded-lg">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${msg.username === currentUsername ? "bg-blue-600 ml-auto" : "bg-gray-700"} max-w-[80%]`}
          >
            <p className="text-xs text-gray-400">{msg.username}</p>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-black p-2 rounded outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#fe2c55] px-4 rounded font-bold"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatBox
