import { useState, useEffect } from "react"
import Navbar from "./components/Navigation/Navbar"
import VideoCard from "./components/Feed/VideoCard"
import AuthModal from "./components/Auth/AuthModal" // New combined modal
import UploadModal from "./components/Feed/UploadModal"
import axios from "./api/axios"

function App() {
  const [view, setView] = useState("home")
  const [reels, setReels] = useState([])
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  )

  // Fetch reels regardless of auth status (Guest Read CRUD)
  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get("/reels/")
        setReels(res.data.results)
      } catch (err) {
        console.error("Error fetching reels", err)
      }
    }
    fetchReels()
  }, [])

  // Centralized "Guard" function
  const requireAuth = (action) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true)
    } else {
      action()
    }
  }

  return (
    <div className="bg-black min-h-screen">
      {view === "home" && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth pb-16">
          {reels.map((reel) => (
            <VideoCard
              key={reel.id}
              reel={reel}
              onInteractionRequirement={() => setIsAuthModalOpen(true)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}

      {/* Auth Modal handles Login/Signup toggling */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => setIsAuthenticated(true)}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={(newPost) => setReels([newPost, ...reels])}
      />

      <Navbar
        onTabChange={(tab) => requireAuth(() => setView(tab))}
        onUploadClick={() => requireAuth(() => setIsUploadOpen(true))}
      />
    </div>
  )
}
export default App
