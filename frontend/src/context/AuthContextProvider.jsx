import React, { useEffect, useState } from 'react'
import api from '../services/api';
import AuthContext from './AuthContext';

function AuthContextProvider({children}) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getCurrentUser = async() => {
    console.log("current user api");
    try{
      const response = await api.get("/users/current-user")
      console.log("current user response:" ,response.data);
      setUser(response.data.data)
    }catch(error){
      try{
        console.log("Current User Error:", error.response);
        await api.post("/users/refresh-token");
        const response = await api.get("/users/current-user");
        console.log("FULL RESPONSE:", response);
console.log("RESPONSE.DATA:", response.data);
console.log("RESPONSE.DATA.DATA:", response.data.data);

setUser(response.data.data);

console.log("SETTING USER:", response.data.data);
        setUser(response.data.data);
      }catch(refreshError){
        setUser(null)
      }
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    // console.log("useeffect running");
    getCurrentUser()
  },[])
 
  return (
    <AuthContext.Provider value={{user, setUser, loading}} >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
