import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from "./pages/Home"
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import ChangeAvatar from './pages/ChangeAvatar'
import ChangeCoverImage from './pages/ChangeCoverImage'
import ChangePassword from './pages/ChangePassword';
import CreatePost from "./pages/CreatePost";
import RootRedirect from './components/RootRedirect';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Routes>
        <Route path="/"  element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute>  
                                        <Home />
                                    </ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-avatar" element={<ChangeAvatar />} />
        <Route path="/change-cover" element={<ChangeCoverImage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </div>
  )
}

export default App
