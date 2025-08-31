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
         try {
            const res = await fetch(`${Base_url}/api/v1/users/profile`, {
               method: 'PATCH',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify(payload),
            });
            const data = await res.json();
            return data;
         } catch (error) {
            console.log('Failed to update profile', error);
            throw error;
         }
      };

  