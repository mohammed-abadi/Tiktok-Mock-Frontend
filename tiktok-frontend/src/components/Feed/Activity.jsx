import React, { useState, useEffect } from "react"
import axios from "../../api/axios"

const Activity = () => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/notifications/")
        setNotifications(res.data.results || res.data)
        await axios.post("/notifications/mark_all_read/")
      } catch (err) {
        console.error("Error fetching activity:", err)
      }
    }
    fetchNotifications()
  }, [])

  return (
    <div className="p-4 bg-black min-h-screen pb-24 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-6 pt-4">Activity</h2>
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center gap-4 p-3 rounded-2xl border ${notif.is_read ? "bg-gray-900/40 border-gray-800" : "bg-blue-900/20 border-blue-900/40"}`}
            >
              <img
                src={
                  notif.sender_avatar ||
                  `https://ui-avatars.com/api/?name=${notif.sender_name}&background=252525&color=fff`
                }
                className="w-12 h-12 rounded-full bg-gray-800 object-cover"
                alt="Avatar"
              />
              <div className="flex-1">
                <p className="text-[15px]">
                  <span className="font-bold text-white">
                    @{notif.sender_name}
                  </span>
                  <span className="text-gray-400">
                    {notif.notification_type === "like" && " liked your video."}
                    {notif.notification_type === "comment" &&
                      " commented on your video."}
                    {notif.notification_type === "follow" &&
                      " started following you."}
                    {notif.notification_type === "repost" &&
                      " reposted your video."}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm">
            No recent activity.
          </div>
        )}
      </div>
    </div>
  )
}
export default Activity
