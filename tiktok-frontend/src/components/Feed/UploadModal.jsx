import React, { useState } from "react"
import axios from "../../api/axios"
import { X } from "lucide-react"

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [caption, setCaption] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleUpload = async () => {
    if (!videoUrl) return alert("Please provide a video URL")

    setIsSubmitting(true)
    try {
      const res = await axios.post("/posts/", {
        caption: caption,
        media_url: videoUrl,
        is_reel: true,
      })
      onUploadSuccess(res.data)
      onClose()
    } catch (err) {
      console.error("Upload failed", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col p-6 text-white">
      <div className="flex justify-between items-center mb-8">
        <X onClick={onClose} className="cursor-pointer" size={28} />
        <button
          onClick={handleUpload}
          disabled={isSubmitting}
          className={`font-bold ${isSubmitting ? "text-gray-500" : "text-[#fe2c55]"}`}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>

      <div className="space-y-6">
        <input
          placeholder="Video URL (.mp4)"
          className="w-full bg-transparent border-b border-gray-800 p-2 outline-none"
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <textarea
          placeholder="Write a caption..."
          className="w-full bg-transparent border-b border-gray-800 p-2 h-32 outline-none resize-none"
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
    </div>
  )
}

export default UploadModal
