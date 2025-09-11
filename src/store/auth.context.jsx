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

  // Initialize user data from localStorage on app startup
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);



  
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
        
        // Fetch complete user profile to get avatar and other details
        try {
          const profileResponse = await fetch(`${BaseUrl}/api/v1/users/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.access_token}`,
            },
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.data) {
              // Update user with complete profile data including avatar
              const completeUserData = { ...data.data, ...profileData.data };
              localStorage.setItem("user", JSON.stringify(completeUserData));
              setUser(completeUserData);
            }
          }
        } catch (error) {
          console.log('Failed to fetch complete profile after login:', error);
          // Continue with login even if profile fetch fails
        }
        
        // Dispatch custom event to notify all components about user update
        window.dispatchEvent(new Event('userUpdated'));
     }
     return data
  }

  // Update user data (useful for avatar updates)
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Dispatch custom event to notify all components about user update
    window.dispatchEvent(new Event('userUpdated'));
  };

  // resetPassword
   const ResetPassword = async (payload) => {
    const response = await fetch (`${BaseUrl}//api/v1/auth/login`,{
      method:"POST"
    })
   }

  return (
    <AuthContext.Provider value={{ user, RegisterUser , token, refreshToken, LoginUser, updateUser, isInitialized }}>
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
