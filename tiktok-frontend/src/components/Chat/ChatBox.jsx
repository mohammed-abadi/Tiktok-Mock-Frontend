import { useState, useEffect, useRef } from "react"

const ChatBox = ({ roomId, currentUsername }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const socketRef = useRef(null)

  useEffect(() => {
    const wsUrl = `wss://tiktok-mock-db.onrender.com/ws/chat/${roomId}/`
    socketRef.current = new WebSocket(wsUrl)

    socketRef.current.onmessage = (e) => {
      const data = json.parse(e.data)
      setMessages((prev) => [...prev, data])
    }

    return () => socketRef.current.close()
  }, [roomId])

  const sendMessage = () => {
    socketRef.current.send(
      JSON.stringify({
        message: input,
        username: currentUsername,
        room_id: roomId,
      })
    )
    setInput("")
  }

  return (
    <div className="chat_container p-4 bg-white h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.username}:</strong> {m.message}
          </p>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border flex-1 p-2"
        />
        <button onClick={sendMessage} className="bg-red-500 text-white p-2">
          Send
        </button>
      </div>
    </div>
  )
}
