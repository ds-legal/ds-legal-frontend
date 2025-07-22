  const Base_url = import.meta.env.VITE_BaseUrl

 export const createTasks = async ({ title, description, due_date, priority, status, category }) => {
  try {
    const token = localStorage.getItem("refresh_token");

    const response = await fetch(`${Base_url}/api/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, due_date, priority, status, category }),
    });

    const data = await response.json();

    // If authentication failed, redirect to login
    if (data?.detail === "Could not validate credentials") {
      window.location.href = "/login";
      return;
    }
    return data;
  } catch (error) {
    console.error("Failed to create Task", error);
  }
};


    export const GetAllTask =  async() => {
     const token = localStorage.getItem("refresh_token");
    try {
      const response = await  fetch(`${Base_url}/api/v1/tasks`,{
     method:"GET",
     headers:{
     "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
     },
      
    })
     const data = await response.json()
     if (data?.detail === "Could not validate credentials") {
      window.location.href = "/login";
      return;
    }
    return data;     
    } catch (error) {
       console.log("Failed to get ALl Tasks", error)  
    }
  }


   export const GetSingleTask =  async(id) => {
   const token = localStorage.getItem("refresh_token");
    try {
    const response = await  fetch(`${Base_url}/api/v1/tasks/${id}`,{
     method:"GET",
     headers:{
     "Content-Type" : "application/json",
       Authorization: `Bearer ${token}`
     },
    })
     const data = await response.json()
      if (data?.detail === "Could not validate credentials") {
      window.location.href = "/login";
      return;
    }
    return data       
    } catch (error) {
      console.log("Failed to get Single Task", error)   
    }
  }

  
   export const updateTask = async (id, { title, description, due_date, priority, status, category }) => {
    try {
        const token = localStorage.getItem("refresh_token");
        
        const response = await fetch(`${Base_url}/api/v1/tasks/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, due_date, priority, status, category })   
        });
        
        const data = await response.json();
        
        // If authentication failed, redirect to login
        if (data?.detail === "Could not validate credentials") {
            window.location.href = "/login";
            return;
        }
        
        // Add HTTP status code to response
        return {
            ...data,
            status_code: response.status,
            ok: response.ok
        };      
    } catch (error) {
        console.log("Failed to update Tasks", error);   
        throw error;
    }
  }

  
   export const DeleteTask =  async(id) => {
    try {
        const token = localStorage.getItem("refresh_token");
        
        const response = await  fetch(`${Base_url}/api/v1/tasks/${id}`,{
     method:"DELETE",
     headers:{
     "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
     }
    })
    
     // Check if response is successful
     if (response.ok) {
         // Try to parse JSON, but handle empty responses
         let data = {};
         try {
             const text = await response.text();
             data = text ? JSON.parse(text) : {};
         } catch (parseError) {
             console.log("No JSON response from delete endpoint:", parseError);
             data = {};
         }
         
         // If authentication failed, redirect to login
         if (data?.detail === "Could not validate credentials") {
             window.location.href = "/login";
             return;
         }
         
         // Add HTTP status code to response
         return {
             ...data,
             status_code: response.status,
             ok: response.ok
         };
     } else {
         // Handle non-success status codes
         const errorData = await response.json().catch(() => ({}));
         if (errorData?.detail === "Could not validate credentials") {
             window.location.href = "/login";
             return;
         }
         throw new Error(`Delete failed with status: ${response.status}`);
     }
    } catch (error) {
        console.log("Failed to delete Task", error)
        throw error;
    }
  }
   
