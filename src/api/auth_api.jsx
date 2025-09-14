 const Base_url = import.meta.env.VITE_BaseUrl
export const UserLogOut = async () => {
  const accessToken = localStorage.getItem("token");
  try {
    const response = await fetch(`${Base_url}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    let data;
    try {
      data = await response.json();
    } catch (_) {
      data = { ok: response.ok, status: response.status };
    }
    return { ...data, ok: response.ok, status: response.status };
  } catch (error) {
    console.log("failed to Logout", error);
    return { ok: false, error: error?.message };
  }
}


  export const verifyEmail = async (email) => {
     const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${Base_url}/api/v1/auth/request-verification-email`, {
     method:"POST",
     headers:{
     "Content-Type" : "application/json",
     }, 
      body:JSON.stringify({
        user_email:email
      })
    }) 
    const data = response.json()
    return data
  } catch (error) {
     console.log("failed to verifyEmail",error)
  }  
  }

  export const  resetPassword = async (email) => {
  try {
    const response = await fetch(`${Base_url}/api/v1/auth/request-password-reset`, {
     method:"POST",
     headers:{
     "Content-Type" : "application/json",
     },  
     body:JSON.stringify({
      user_email:email
     }) 
    }) 
    const data = response.json()
    return data
  } catch (error) {
     console.log("failed", error)
  }  
  }

   export const changePassword = async ({new_password,confirm_password,token }) => {
    // console.log(new_password,confirm_password, token ,"info")
     const cleanToken = token?.replace(/"/g, '');
      // console.log("cleanToken", cleanToken)
    try {
       const response = await fetch(`${Base_url}/api/v1/auth/reset-password?token=${cleanToken}`,{
        method:"POST",
        headers:{
         "Content-Type": "application/json"
        },
        body:JSON.stringify({
         new_password,
         confirm_password
        })
       })
        const data = await response.json()
        console.log("data", data)
        return data
    } catch (error) {
       console.log("Failed", error)
    }

   }

    export   const verifyEmailToken = async(token) => {
         const cleanToken = token?.replace(/"/g, '');
         console.log("cleanToken", cleanToken)
      try {
         const response = await fetch(`${Base_url}/api/v1/auth/verify-email?token=${cleanToken}`,{
          method:"GET",
           headers:{
          "Content-Type" : "application/json",
           }, 
         })
          const data = await response.json()
          return data
      } catch (error) {
         console.log("Failed to verify email token", error)
      }
   }
      export const getUserProfile = async () => {
         const token = localStorage.getItem('token');
         try {
            const res = await fetch(`${Base_url}/api/v1/users/profile`, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
            });
            const data = await res.json();
            return data;
         } catch (error) {
            console.log('Failed to fetch profile', error);
            throw error;
         }
      };

      export const updateUserProfile = async (payload) => {
         const token = localStorage.getItem('token');
         
         if (!token) {
            throw new Error('No authentication token found');
         }
         
         if (!Base_url) {
            throw new Error('Base URL not configured');
         }
         
         try {
            console.log('Making profile update request to:', `${Base_url}/api/v1/users/profile`);
            console.log('Request payload:', payload);
            
            const res = await fetch(`${Base_url}/api/v1/users/profile`, {
               method: 'PATCH',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify(payload),
            });
            
            console.log('Response status:', res.status);
            console.log('Response ok:', res.ok);
            
            if (!res.ok) {
               const errorText = await res.text();
               console.error('API Error Response:', errorText);
               throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
            }
            
            const data = await res.json();
            console.log('Profile update response data:', data);
            return data;
         } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
         }
      };

      export const updateUserAvatar = async (avatarFile) => {
         const token = localStorage.getItem('token');
         try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const res = await fetch(`${Base_url}/api/v1/users/profile/avatar`, {
               method: 'PATCH',
               headers: {
                  Authorization: `Bearer ${token}`,
                  // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
               },
               body: formData,
            });
            const data = await res.json();
            return data;
         } catch (error) {
            console.log('Failed to update avatar', error);
            throw error;
         }
      };

      // Google OAuth API functions
      export const initiateGoogleOAuth = async () => {
         try {
            console.log('Initiating Google OAuth via backend...');
            const response = await fetch(`${Base_url}/api/v1/auth/google/initiate`, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               },
            });
            
            console.log('OAuth initiation response status:', response.status);
            
            if (!response.ok) {
               const errorText = await response.text();
               console.error('OAuth initiation failed:', errorText);
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('OAuth initiation response:', data);
            return data;
         } catch (error) {
            console.log('Failed to initiate Google OAuth', error);
            throw error;
         }
      };

      export const handleGoogleCallback = async (code, state) => {
         try {
            console.log('Making Google OAuth callback request...');
            console.log('Code:', code);
            console.log('State:', state);
            console.log('URL:', `${Base_url}/api/v1/auth/google/callback?code=${code}&state=${state}`);
            
            const response = await fetch(`${Base_url}/api/v1/auth/google/callback?code=${code}&state=${state}`, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               },
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
               // Try to get error details from response
               let errorMessage = `HTTP error! status: ${response.status}`;
               try {
                  const errorData = await response.json();
                  console.log('Error response data:', errorData);
                  errorMessage = errorData.detail || errorData.message || errorMessage;
               } catch (e) {
                  console.log('Could not parse error response as JSON');
               }
               throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log('Success response data:', data);
            return data;
         } catch (error) {
            console.log('Failed to handle Google OAuth callback', error);
            throw error;
         }
      };

      export const googleSignInWithToken = async (idToken) => {
         try {
            const response = await fetch(`${Base_url}/api/v1/auth/google`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  id_token: idToken
               }),
            });
            
            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
         } catch (error) {
            console.log('Failed to sign in with Google token', error);
            throw error;
         }
      };

  