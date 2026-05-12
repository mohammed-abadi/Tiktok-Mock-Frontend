import axios from "axios"

const instance = axios.create({
  // Pulls https://tiktok-mock-db.onrender.com/api from your .env
  baseURL: import.meta.env.VITE_API_URL,
})

/**
 * REQUEST INTERCEPTOR
 * Before every request leaves React, this function runs.
 */
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      // Attach the JWT to the Authorization header
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * RESPONSE INTERCEPTOR
 * Handles global errors like expired tokens (401 Unauthorized)
 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the token is expired or invalid, log the user out
      console.warn("Session expired. Redirecting to login...")
      localStorage.removeItem("token")
      // Optional: window.location.href = "/login";
    }
    return Promise.reject(error)
  }
)

// Required because you set CORS_ALLOW_CREDENTIALS = True in Django
instance.defaults.withCredentials = true

export default instance
