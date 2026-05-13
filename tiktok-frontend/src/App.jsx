import React, { useState, useEffect } from "react"
import Navbar from "./components/Navigation/Navbar"
import VideoCard from "./components/Feed/VideoCard"
import AuthModal from "./components/Auth/AuthModal"
import UploadModal from "./components/Feed/UploadModal"
import Discovery from "./components/Feed/Discovery"
import Profile from "./components/Profile/Profile"
import ChatBox from "./components/Chat/ChatBox"
import axios from "./api/axios"

function App() {
  const [view, setView] = useState("home")
  const [reels, setReels] = useState([])
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  )

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get("/posts/")
        setReels(res.data.results || res.data)
      } catch (err) {
        console.error("Error fetching reels", err)
      }
    }
    fetchReels()
  }, [view])

  // Centralized Guard
  const requireAuth = (action) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true)
    } else {
      action()
    }
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <div className="flex-1 overflow-hidden">
        {view === "home" && (
          <div className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth pb-16">
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

        {view === "discover" && <Discovery />}

        {view === "inbox" && <ChatBox roomId={1} />}

        {view === "profile" && (
          <Profile
            onLogout={() => {
              localStorage.removeItem("token")
              setIsAuthenticated(false)
              setView("home")
            }}
          />
        )}
      </div>

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
        currentView={view}
        onTabChange={(tab) => {
          if (tab === "inbox" || tab === "profile") {
            requireAuth(() => setView(tab))
          } else {
            setView(tab)
          }
        }}
        onUploadClick={() => requireAuth(() => setIsUploadOpen(true))}
      />
    </div>
  )
}

export default App
