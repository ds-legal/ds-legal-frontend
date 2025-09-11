 const Base_url = import.meta.env.VITE_BaseUrl
export const UserLogOut = async () => {
     const token = localStorage.getItem("refresh_token");
  try {
    const response = await fetch(`${Base_url}/api/v1/auth/logout`, {
     method:"POST",
     headers:{
     "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
     },   
    }) 
    const data = response.json()
    return data
  } catch (error) {
     console.log("failed to Logout",error)
  }  
}


  export const verifyEmail = async (email) => {
     const token = localStorage.getItem("refresh_token");
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

  