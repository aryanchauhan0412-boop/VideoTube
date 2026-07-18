import React, { useContext, useEffect, useState } from 'react'
import AuthContext from "../context/AuthContext"
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import MenuBar from "../components/MenuBar";
import { useParams } from "react-router-dom";

function Profile() {
  const {user} = useContext(AuthContext)
  const { username } = useParams();

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([]);
  
  const navigate = useNavigate()
  
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // edit the post
  const [editPost, setEditPost] = useState(null);
  const [newCaption, setNewCaption] = useState("");

  const [isSubscribed, setIsSubscribed] = useState(false);

  const isOwnProfile = user?._id === profile?._id;

    const getProfile = async () => {
      try {
        const response = await api.get(`/users/c/${username}`);
        setProfile(response.data.data);
        setIsSubscribed(response.data.data.isSubscribed);
      } catch (error) {
        console.log(error);
      }
    };

  // useEffect(() => {
  //   console.log("User from context:", user)
  //   if(user){
  //     getProfile()
  //   }
  // },[user])

  useEffect(() => {
    if (username) {
      getProfile();
    }
  }, [username]);
  
  useEffect(() => {
    if(profile){
      getUserPosts();
    }
  }, [profile])
  
  if(!profile){
    return <h1>Loading...</h1>
  }
  
  const getUserPosts = async() => {
    try{
      const token = localStorage.getItem("accessToken");

      const response = await api.get(`/posts/user/${profile._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log("response: ", response.data.message);
      setPosts(response.data.message)
    }catch(error){
      console.log(error);
    }
  }

  const getComments = async(postId) => {
    try{
      const response = await api.get(`/comments/${postId}`);
      setComments(response.data.data);
      setSelectedPost(postId)
    }catch(error){
      console.log(error)
    }
  }

  const deletePost = async(postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post")

    if(!confirmDelete) return;

    try{
      const token = localStorage.getItem("accessToken");

      await api.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setPosts(post.filter(post => post._id !== postId))
    }catch(error){
      console.log(error);
    }
  }

  const openEdit = (post) => {
    setEditPost(post._id);
    setNewCaption(post.caption);
  };

    const updatePost = async (postId) => {
      console.log("Save clicked");
      console.log("postId:", postId);
      console.log("newCaption:", newCaption);
      try {
        const token = localStorage.getItem("accessToken");

        await api.patch(
          `/posts/edit/${postId}`,
          {
            caption: newCaption,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        getUserPosts();

        setEditPost(null);
        setNewCaption("")
        } catch (error) {
          console.log(error);
        }
      };

      const toggleSubscription = async () => {
          try {
            await api.post(`/subscriptions/c/${profile._id}`);

            setIsSubscribed((prev) => !prev);

            setProfile((prev) => ({
              ...prev,
              subscribersCount: isSubscribed
                ? prev.subscribersCount - 1
                : prev.subscribersCount + 1,
            }));
          } catch (error) {
            console.log(error);
          }
        };


  return (
    <div className="bg-slate-950 text-white min-h-screen">

      <div className="relative">
        <img
          src={profile.coverImage}
          alt="cover"
          className="w-full h-48 object-cover rounded-xl"
        />

        <div className="absolute left-10 -bottom-16">
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-36 h-36 rounded-full border-4 border-white object-cover bg-white"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-10">

      <div className="flex items-center justify-between">
        <div>

        <h1 className="text-3xl font-bold">
          {profile.fullName}
        </h1>

        <p className="text-gray-500 text-lg">
          @{profile.username}
        </p>
       </div>
        <div>
  {isOwnProfile ? (
    <MenuBar />
  ) : (
    <button
      onClick={toggleSubscription}
      className={`px-6 py-2 rounded-lg font-semibold transition ${
        isSubscribed
          ? "bg-slate-700 hover:bg-slate-600 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {isSubscribed ? "Following" : "Follow"}
    </button>
  )}
</div>
       </div>

        {/* Followers & Following */}
        <div className="flex gap-10 mt-4 text-lg">

          <div className="flex gap-4 mt-2 ">
            <span className='font-bold'>{profile.subscribersCount} Followers</span>
            <span className='font-bold'>{profile.   channelsSubscribedToCount} Following</span>
            <span className="font-bold">
              {posts.length} Posts
            </span>
          </div>

        </div>
      </div>

      {/* Videos and photos Section */}
      
      <div className="mt-12 px-10">
      <h2 className="text-2xl font-bold mb-6">
        Posts
      </h2>

    {posts.length === 0 ? (
      <div className="bg-white rounded-lg shadow p-10 text-center">
        No posts uploaded yet
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (

        
        <div
          key={post._id}
          className="bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
        >
          {/* <pre>{JSON.stringify(post, null, 2)}</pre> */}
          {post.mediaType === "image" ? (
            <img
              src={post.media}
              alt="post"
              className="w-full h-52 object-cover"
            />
          ) : (
            <video
              src={post.media}
              className="w-full h-52 object-cover"
              controls
            />
          )}

          <div className="p-4">
            {editPost === post._id ? (
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="border p-2 w-full rounded"
                />
              ) : (
                <p className="font-medium line-clamp-2">
                  {post.caption}
                </p>
              )}
              <div className="flex justify-between mt-3 text-gray-600">
                  <span>❤️ {post.likesCount ?? 0}</span>
                  <span className='cursor-pointer' onClick={(e) => {
                      e.preventDefault(); 
                      getComments(post._id)}}
                      >💬 {post.commentsCount ?? 0}</span>

                        {isOwnProfile && (
                            <div className="flex gap-2">

                              {editPost === post._id ? (
                                <>
                                  <button
                                    onClick={() => updatePost(post._id)}
                                    className="text-green-500"
                                  >
                                    Save
                                  </button>

                                  <button
                                    onClick={() => setEditPost(null)}
                                    className="text-gray-500"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => openEdit(post)}
                                  className="text-blue-500"
                                >
                                  Edit
                                </button>
                              )}

                              <button
                                onClick={() => deletePost(post._id)}
                                className="text-red-500"
                              >
                                Delete
                              </button>

                            </div>
                          )}
              </div>
              {selectedPost === post._id && (
              <div className="mt-3 border rounded p-3">
                {comments.length === 0 ? (
                  <p>No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="mb-2">
                      <strong>{comment.owner.username}</strong>
                      <p>{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
                  </div>
                </div>
                  ))}
                </div>
              )}
      </div>
    </div>
  )
}

export default Profile
