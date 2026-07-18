import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext.js'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api.js'

function Home() {
  const [posts, setPosts] = useState([])
  const [commentText, setCommentText] = useState("")
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    getPosts();
  }, [])

  const getPosts = async() => {
    try{
      const response = await api.get("/posts")

      console.log(response.data.message);
      setPosts(response.data.message)
    }catch(error){
      console.log(error);
    }
  }

  const handleLike = async(postId) => {
    try{
      const token = localStorage.getItem("accessToken");
      const response = await api.post(`/likes/toggle/${postId}`,{},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data);
      
      getPosts()
    }catch(error){
      console.log(error);
    }
  }

  const addComment = async(postId) => {
    try{
      const token = localStorage.getItem("accessToken");

      const response = await api.post(`/comments/add/${postId}`, {content: commentText}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCommentText("");
      getPosts()
    }catch(error){
      console.log(error);
    }
  }

  const toggleComments = (postId) => {
      if (selectedPost === postId) {
        setSelectedPost(null);
      } else {
        setSelectedPost(postId);
      }
    };

  return (
  <>
    <Navbar />

    <div className="max-w-7xl mx-auto px-6 py-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        Trending Now
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {posts.map((post) => (

          <div
            key={post._id}
            className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-lg hover:scale-105 transition-all duration-300"
          >

            {post.mediaType === "image" ? (
              <img
                src={post.media}
                alt="post"
                className="w-full h-72 object-cover"
              />
            ) : (
              <video
                src={post.media}
                controls
                className="w-full h-72 object-cover"
              />
            )}

            <div className="p-4">

              <div className="flex items-center gap-3 mb-3">

                <img
                  src={post.owner.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <h3 className="text-white font-semibold">
                  @{post.owner.username}
                </h3>

              </div>

              <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                {post.caption}
              </p>

              <div className="flex items-center justify-between text-lg">

                <span
                  onClick={() => handleLike(post._id)}
                  className="cursor-pointer hover:text-red-500 transition"
                >
                  ❤️ {post.likesCount ?? 0}
                </span>

                <span
                  onClick={() => toggleComments(post._id)}
                  className="cursor-pointer hover:text-blue-400 transition"
                >
                  💬 {post.commentsCount ?? 0}
                </span>

              </div>

              {selectedPost === post._id && (

                <div className="mt-4">

                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-600 text-white px-3 py-2 outline-none"
                  />

                  <button
                    onClick={() => addComment(post._id)}
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    Post Comment
                  </button>

                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>

  </>
)
}

export default Home
