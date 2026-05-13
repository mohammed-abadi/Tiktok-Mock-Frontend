import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom"
import Navbar from "./components/Navigation/Navbar"
import VideoCard from "./components/Feed/VideoCard"
import AuthModal from "./components/Auth/AuthModal"
import UploadModal from "./components/Feed/UploadModal"
import Discovery from "./components/Feed/Discovery"
import Profile from "./components/Profile/Profile"
import ChatBox from "./components/Chat/ChatBox"
import InboxList from "./components/Chat/InboxList"
import Activity from "./components/Feed/Activity"
import axios from "./api/axios"

const AppContent = () => {
  const [reels, setReels] = useState([])
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  )
  const location = useLocation()

  useEffect(() => {
    if (location.state?.openLogin) setIsAuthModalOpen(true)
  }, [location])

  useEffect(() => {
    const handleStorageChange = () =>
      setIsAuthenticated(!!localStorage.getItem("token"))
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get("/posts/")
        setReels(res.data.results || res.data)
      } catch (err) {}
    }
    fetchReels()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setIsAuthenticated(false)
    window.location.href = "/"
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col font-sans">
      <div className="flex-1 overflow-hidden relative">
        <Routes>
          <Route
            path="/"
            element={
              <div className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar bg-black pb-16">
                {reels.map((reel) => (
                  <VideoCard
                    key={reel.id}
                    post={reel}
                    isAuthenticated={isAuthenticated}
                    onInteractionRequirement={() => setIsAuthModalOpen(true)}
                  />
                ))}
              </div>
            }
          />
          <Route path="/discover" element={<Discovery />} />
          <Route
            path="/activity"
            element={
              isAuthenticated ? (
                <Activity />
              ) : (
                <Navigate to="/" state={{ openLogin: true }} replace />
              )
            }
          />
          <Route
            path="/inbox"
            element={
              isAuthenticated ? (
                <InboxList />
              ) : (
                <Navigate to="/" state={{ openLogin: true }} replace />
              )
            }
          />
          <Route
            path="/inbox/:roomId"
            element={
              isAuthenticated ? (
                <div className="p-4 h-[100dvh]">
                  <ChatBox currentUsername={localStorage.getItem("username")} />
                </div>
              ) : (
                <Navigate to="/" state={{ openLogin: true }} replace />
              )
            }
          />
          <Route
            path="/profile/:id?"
            element={
              isAuthenticated ? (
                <Profile onLogout={handleLogout} />
              ) : (
                <Navigate to="/" state={{ openLogin: true }} replace />
              )
            }
          />
        </Routes>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => {
          setIsAuthenticated(true)
          setIsAuthModalOpen(false)
        }}
      />
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={(newPost) => {
          setReels([newPost, ...reels])
          setIsUploadOpen(false)
        }}
      />
      <Navbar
        isAuthenticated={isAuthenticated}
        openAuth={() => setIsAuthModalOpen(true)}
        openUpload={() => setIsUploadOpen(true)}
      />
    </div>
  )
}
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
