import React, { useState } from "react"
import axios from "../../api/axios"

const Discovery = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState({ users: [], posts: [] })

  const handleSearch = async (e) => {
    setQuery(e.target.value)
    if (e.target.value.length > 2) {
      const [userRes, postRes] = await Promise.all([
        axios.get(`/profiles/?search=${e.target.value}`),
        axios.get(`/posts/?search=${e.target.value}`),
      ])
      setResults({ users: userRes.data, posts: postRes.data })
    }
  }

  return (
    <div className="p-4 bg-black min-h-screen text-white">
      <input
        placeholder="Search users, captions, or tags..."
        className="w-full p-3 bg-gray-900 rounded-full outline-none mb-6"
        onChange={handleSearch}
      />

      <section className="mb-8">
        <h3 className="text-gray-400 mb-4 uppercase text-xs font-bold tracking-widest">
          Users
        </h3>
        <div className="space-y-4">
          {results.users.map((u) => (
            <div key={u.id} className="flex items-center space-x-3">
              <img
                src={u.profile_picture_url}
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <p className="font-bold">@{u.username}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-gray-400 mb-4 uppercase text-xs font-bold tracking-widest">
          Videos
        </h3>
        <div className="grid grid-cols-3 gap-1">
          {results.posts.map((p) => (
            <div key={p.id} className="aspect-[9/16] bg-gray-800">
              <video
                src={p.media_url}
                className="h-full w-full object-cover"
                muted
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Discovery
