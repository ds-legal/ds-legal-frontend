import React, { createContext, useContext, useState, useEffect } from 'react';
import { initiateGoogleOAuth, handleGoogleCallback as apiHandleGoogleCallback, googleSignInWithToken, getUserProfile } from '../api/auth_api';

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

  // Google OAuth functions
  const handleGoogleSignIn = async () => {
    try {
      console.log('Initiating Google OAuth via backend...');
      
      // Call backend to get OAuth URL securely
      const response = await initiateGoogleOAuth();
      
      if (response.auth_url) {
        console.log('Received OAuth URL from backend:', response.auth_url);
        
        // Store state for verification if provided
        if (response.state) {
          sessionStorage.setItem('google_oauth_state', response.state);
        }
        
        // Redirect to Google OAuth URL provided by backend
        window.location.href = response.auth_url;
      } else {
        throw new Error('No OAuth URL received from backend');
      }
    } catch (error) {
      console.log('Failed to initiate Google OAuth:', error);
      throw error;
    }
  };

  const handleGoogleCallback = async (code, state) => {
    try {
      console.log('Auth context: Handling Google callback...');
      console.log('Auth context: Code:', code);
      console.log('Auth context: State:', state);
      
      const response = await apiHandleGoogleCallback(code, state);
      console.log('Auth context: API response:', response);
      
      if (response.status_code === 200) {
        // Store tokens and user data
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data));
        setToken(response.access_token);
        setRefreshToken(response.refresh_token);
        setUser(response.data);
        
        // Fetch complete user profile to get avatar and other details
        try {
          const profileResponse = await getUserProfile();
          if (profileResponse.data) {
            const completeUserData = { ...response.data, ...profileResponse.data };
            localStorage.setItem("user", JSON.stringify(completeUserData));
            setUser(completeUserData);
          }
        } catch (error) {
          console.log('Failed to fetch complete profile after Google login:', error);
        }
        
        // Dispatch custom event to notify all components about user update
        window.dispatchEvent(new Event('userUpdated'));
      }
      
      return response;
    } catch (error) {
      console.log('Failed to handle Google OAuth callback:', error);
      throw error;
    }
  };

  const handleGoogleSignInWithToken = async (idToken) => {
    try {
      const response = await googleSignInWithToken(idToken);
      
      if (response.status_code === 200) {
        // Store tokens and user data
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data));
        setToken(response.access_token);
        setRefreshToken(response.refresh_token);
        setUser(response.data);
        
        // Fetch complete user profile to get avatar and other details
        try {
          const profileResponse = await getUserProfile();
          if (profileResponse.data) {
            const completeUserData = { ...response.data, ...profileResponse.data };
            localStorage.setItem("user", JSON.stringify(completeUserData));
            setUser(completeUserData);
          }
        } catch (error) {
          console.log('Failed to fetch complete profile after Google login:', error);
        }
        
        // Dispatch custom event to notify all components about user update
        window.dispatchEvent(new Event('userUpdated'));
      }
      
      return response;
    } catch (error) {
      console.log('Failed to sign in with Google token:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      RegisterUser, 
      token, 
      refreshToken, 
      LoginUser, 
      updateUser, 
      isInitialized,
      handleGoogleSignIn,
      handleGoogleCallback,
      handleGoogleSignInWithToken
    }}>
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
