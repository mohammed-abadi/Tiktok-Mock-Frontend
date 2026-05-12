import { useState, useEffect } from "react"
import Navbar from "./components/Navigation/Navbar"
import VideoCard from "./components/Feed/VideoCard"
import Profile from "./components/Profile/Profile"
import UploadModal from "./components/Feed/UploadModal"
import Login from "./components/Auth/Login"
import axios from "./api/axios"

function App() {
  const [view, setView] = useState("home")
  const [reels, setReels] = useState([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  )

  useEffect(() => {
    if (isAuthenticated && view === "home") {
      axios.get("/reels/").then((res) => setReels(res.data.results))
    }
  }, [view, isAuthenticated])

  if (!isAuthenticated)
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />

  return (
    <div className="bg-black min-h-screen">
      {view === "home" && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth pb-16">
          {reels.map((reel) => (
            <VideoCard key={reel.id} reel={reel} />
          ))}
        </div>
      )}

      {view === "profile" && <Profile />}
      {view === "chat" && (
        <div className="text-white text-center pt-20">
          Chat Feature Coming Next!
        </div>
      )}

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={(newPost) => setReels([newPost, ...reels])}
      />

      <Navbar
        onTabChange={setView}
        onUploadClick={() => setIsUploadOpen(true)}
      />
    </div>
  )
}
export default App
