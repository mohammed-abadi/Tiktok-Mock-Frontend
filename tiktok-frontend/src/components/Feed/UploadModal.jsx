const handleUpload = async () => {
  try {
    const res = await axios.post("/posts/", {
      caption: caption,
      media_url: videoUrl,
      is_reel: true,
    })

    onUploadSuccess(res.data)
    onClose()
  } catch (err) {
    console.error("Upload unauthorized. Please log in.")
  }
}
