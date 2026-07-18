import React, { useContext, useState } from 'react'
import axios from "axios"
import AuthContext from '../context/AuthContext.js'
import api from '../services/api.js'
import { useNavigate, Navigate } from "react-router-dom"

function Login() {
  console.log("Login page rendered");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const {setUser, user, loading} = useContext(AuthContext)
  const navigate = useNavigate()

  console.log("Login user:", user);
console.log("Loading:", loading);

    if (loading) {
    return <h1>Loading...</h1>;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      const response = await api.post("/users/login", {email, password})

      // localStorage.setItem("accessToken", response.data.data.accessToken)

      setUser(response.data.data.user)
      navigate("/home")
    }catch(error){
      console.log(error)

      alert("Login failed")
    }
  }

  return (
    <div className="min-h-screen
bg-slate-950
flex
items-center
justify-center">

      <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <form className='space-y-4' onSubmit={handleSubmit}>

          <input 
            type="text"
            placeholder='Email'
            className='w-full border p-3 rounded'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input 
              type="password" 
              placeholder='Password'
              className="w-full border p-3 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />

              <button className="w-full bg-black text-white p-3 rounded" type='submit'>Login
              </button>
        </form>
      </div>
    </div>
  )
}

export default Login
