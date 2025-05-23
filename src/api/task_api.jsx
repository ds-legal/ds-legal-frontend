  const Base_url = "https://ds-legal-backend.onrender.com"

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
    return data      
    } catch (error) {
       console.log("Failed to get ALl Tasks", error)  
    }
  }


   export const GetSingleTask =  async(id) => {
    try {
         const response = await  fetch(`${Base_url}/api/v1/tasks/${id}`,{
     method:"GET",
     headers:{
     "Content-Type" : "application/json"
     },
    })
     const data = await response.json()
    return data
        
    } catch (error) {
      console.log("Failed to get Single Task", error)   
    }
  }

  
   export const updateTask =  async(id) => {
    try {
        const response = await  fetch(`${Base_url}/api/v1/tasks/${id}`,{
     method:"PATCH",
     headers:{
     "Content-Type" : "application/json"
     },
      body:JSON.stringify({title,description,due_date,priority,status,category})   
    })
     const data = await response.json()
    return data      
    } catch (error) {
      console.log("Failed to update Tasks", error)   
    }
  }

  
   export const DelectTask =  async(id) => {
    try {
        const response = await  fetch(`${Base_url}/api/v1/tasks/${id}`,{
     method:"DELETE",
     headers:{
     "Content-Type" : "application/json"
     }
    })
     const data = await response.json()
    return data  
    } catch (error) {
        console.log("Failed to delete Task", error)
        
    }
  }

   


   
