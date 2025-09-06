import React, { createContext, useContext, useState, useEffect } from 'react';

const BaseUrl = import.meta.env.VITE_BaseUrl;


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Session key for tracking browser sessions
  const SESSION_KEY = 'ds_legal_session_active';



  
  // Login function (you are calling register endpoint but calling it Login)
  const RegisterUser = async (payload) => {
    console.log(payload , "payload" , payload.name)
    try {
      const response = await fetch(`${BaseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
         email:payload.email,
         password:payload.password,
         first_name:payload.firstName,
         last_name:payload.lastName 
        })
      });

      const data = await response.json();

      if (data.status_code === 201) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.data));
        setToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setUser(data.data);
      }
      // console.log(data, "response");
      return data;
    } catch (error) {
      console.log("Failed to register", error);
    }
  };

  // login user
  const LoginUser = async (payload) => {
    const response = await fetch(`${BaseUrl}/api/v1/auth/login`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        email:payload.email,
        password:payload.password
      })
    })
     const data =  await response.json()
     console.log("response" , data)
     if(data.status_code === 200){
       localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.data));
        setToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setUser(data.data);
     }
     return data
  }

  // resetPassword
   const ResetPassword = async (payload) => {
    const response = await fetch (`${BaseUrl}//api/v1/auth/login`,{
      method:"POST"
    })
   }

  return (
    <AuthContext.Provider value={{ user, RegisterUser , token, refreshToken,LoginUser }}>
      {children}
    </AuthContext.Provider>
  );
};
 

export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
