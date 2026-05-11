import { useState, useEffect } from "react"
import axios from "./api/axios"
import VideoCard from "./components/Feed/VideoCard"

function App() {
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true)
        // This hits https://tiktok-mock-db.onrender.com/api/reels/
        const response = await axios.get("/reels/")

        // Verification: Ensure the results exist before setting state
        if (response.data && response.data.results) {
          setReels(response.data.results)
        } else {
          setError("Data received but format was unexpected.")
        }
      } catch (err) {
        console.error("Failed to fetch feed:", err)
        setError(
          "Could not connect to the backend. Is the Render service awake?"
        )
      } finally {
        setLoading(false)
      }
    }
    fetchReels()
  }, [])

  // 1. Loading State (Crucial for Render Free Tier)
  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fe2c55] mb-4"></div>
        <p className="animate-pulse">Waking up the server...</p>
      </div>
    )
  }

  // 2. Error State
  if (error) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white text-center p-6">
        <p className="text-[#fe2c55] text-xl mb-4 font-bold">
          ⚠️ Connection Error
        </p>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#fe2c55] px-6 py-2 rounded-md font-bold"
        >
          Retry Connection
        </button>
      </div>
    )
  }

  return (
    <div className="app_videos">
      {/* Container for vertical scrolling */}
      <div className="relative h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black no-scrollbar">
        {reels.length > 0 ? (
          reels.map((reel) => <VideoCard key={reel.id} reel={reel} />)
        ) : (
          <div className="h-screen flex items-center justify-center text-white">
            <p>No reels found in the database.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
