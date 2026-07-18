import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../context/AuthContext'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(false);
  const {setUser} = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async() => {
    try{
      await api.post("/users/logout")
    setUser(null)
    alert("You are logout!")
    navigate("/login")
    }catch(error){
      console.log(error);
    }
  }
  
  useEffect(() => {

    if(query.trim() === ""){
        setUsers([]);
        return;
    }

    const fetchUsers = async () => {
        try{

            const res = await api.get(`/users/search?query=${query}`);
            console.log("Search Response:", res.data);
            setUsers(res.data.data);
        }catch(err){
            console.log(err);
        }
    }

    fetchUsers();

}, [query]);
  

  return (
  <nav className="bg-slate-900 border-b border-slate-700 shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

      
      <h1
        onClick={() => navigate("/home")}
        className="text-3xl font-bold text-blue-500 cursor-pointer"
      >
        VideoTube
      </h1>

   <div className="relative w-[420px]">

  <input
    type="text"
    placeholder="Search users..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="w-full bg-slate-800 text-white px-5 py-3 rounded-full border border-slate-700 focus:outline-none focus:border-blue-500"
  />

  {users.length > 0 && (
    <div className="absolute top-14 left-0 w-full bg-slate-900 rounded-xl border border-slate-700 shadow-xl overflow-hidden z-50">

      {users.map((user) => (
        <div
          key={user._id}
                onClick={() => {
            navigate(`/profile/${user.username}`);
            setQuery("");
            setUsers([]);
          }}
          className="flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer"
        >
          <img
            src={user.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <p className="text-white font-semibold">
              {user.fullName}
            </p>

            <p className="text-slate-400 text-sm">
              @{user.username}
            </p>
          </div>
        </div>
      ))}

    </div>
  )}

</div>


    <div className="flex items-center gap-8">
        <button
          onClick={() => navigate("/home")}
          className="text-slate-300 hover:text-white transition"
        >
          Home
        </button>

        <button
          className="text-slate-300 hover:text-white transition"
        >
          Explore
        </button>

        <button
          onClick={() => navigate("/create-post")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
        >
          Create Post
        </button>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate(`/profile/${user.username}`)}
          className="text-slate-300 hover:text-white transition"
        >
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 transition"
        >
          Logout
        </button>
      </div>

    </div>
  </nav>
)
}

export default Navbar
