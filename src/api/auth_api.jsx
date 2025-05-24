 const Base_url = "https://ds-legal-backend.onrender.com"
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