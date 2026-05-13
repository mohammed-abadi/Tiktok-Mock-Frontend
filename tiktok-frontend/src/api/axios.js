// src/api/axios.js
import axios from "axios"

// Update this to your actual backend URL
const baseURL = "http://127.0.0.1:8000/api"

const axiosInstance = axios.create({
  baseURL: baseURL,
})
// 1. Attach the Access Token to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 2. Catch 401 errors and try to Refresh the token
axiosInstance.interceptors.response.use(
  (response) => response, // If the request succeeds, just return it
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 Unauthorized and we haven't already retried this exact request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        // Ask the backend for a fresh access token
        const res = await axios.post(`${baseURL}/token/refresh/`, {
          refresh: refreshToken,
        })

        // Save the new token
        const newAccessToken = res.data.access
        localStorage.setItem("token", newAccessToken)

        // Update the original failed request with the new token and try again
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // If the refresh token is ALSO expired, clear everything and force logout
        console.error("Session completely expired. Logging out...")
        localStorage.clear()

        // Dispatch a storage event so App.jsx knows to update the UI to logged-out state
        window.dispatchEvent(new Event("storage"))

        // Optional: Redirect to home page
        window.location.href = "/"

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
