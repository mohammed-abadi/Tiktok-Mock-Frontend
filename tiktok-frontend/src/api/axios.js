import axios from "axios"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Redirecting to login...")
      localStorage.removeItem("token")
    }
    return Promise.reject(error)
  }
)

// Required because you set CORS_ALLOW_CREDENTIALS = True in Django
instance.defaults.withCredentials = true

export default instance
