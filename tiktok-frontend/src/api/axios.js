import axios from "axios"

const instance = axios.create({
  // This pulls the URL from your .env file
  baseURL: import.meta.env.VITE_API_URL,
})

// Optional: This ensures cookies/sessions work if you use standard Django Auth
instance.defaults.withCredentials = true

export default instance
