const Base_url = import.meta.env.VITE_BaseUrl

export const createAppointment = async ({ title, description, date, start_time, end_time, meeting_link, via_email, via_app, before_value, before_unit, related_task_id }) => {
  try {
    const token = localStorage.getItem("refresh_token");

    // Extract date and time components from the datetime strings
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    
    const appointmentDate = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const startTimeStr = startDate.toTimeString().split(' ')[0].slice(0, 5); // HH:MM
    const endTimeStr = endDate.toTimeString().split(' ')[0].slice(0, 5); // HH:MM

    const payload = { 
      title,
      date: appointmentDate,
      start_time: startTimeStr, 
      end_time: endTimeStr, 
      description: description || "",
      meeting_link: meeting_link || "",
      reminder: {
        via_email: Boolean(via_email),
        via_app: Boolean(via_app),
        before_value: parseInt(before_value) || 15,
        before_unit: before_unit || "minutes"
      },
      related_task_id: related_task_id || null
    };

    console.log('API sending payload:', payload);

    const response = await fetch(`${Base_url}/api/v1/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // If authentication failed, redirect to login
    if (data?.detail === "Could not validate credentials") {
      window.location.href = "/login";
      return;
    }
    
    return {
      ...data,
      status_code: response.status,
      ok: response.ok
    };
  } catch (error) {
    console.error("Failed to create Appointment", error);
    throw error;
  }
};

export const getAllAppointments = async() => {
  const token = localStorage.getItem("refresh_token");
  try {
    const response = await fetch(`${Base_url}/api/v1/appointments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
    console.log("Failed to get All Appointments", error)  
    throw error;
  }
}

export const getSingleAppointment = async(id) => {
  const token = localStorage.getItem("refresh_token");
  try {
    const response = await fetch(`${Base_url}/api/v1/appointments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
    console.log("Failed to get Single Appointment", error)   
    throw error;
  }
}

export const updateAppointment = async (id, { title, description, date, start_time, end_time, meeting_link, via_email, via_app, before_value, before_unit, related_task_id }) => {
  try {
    const token = localStorage.getItem("refresh_token");
    
    // Extract date and time components from the datetime strings
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    
    const appointmentDate = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const startTimeStr = startDate.toTimeString().split(' ')[0].slice(0, 5); // HH:MM
    const endTimeStr = endDate.toTimeString().split(' ')[0].slice(0, 5); // HH:MM
    
    const response = await fetch(`${Base_url}/api/v1/appointments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        title,
        date: appointmentDate,
        start_time: startTimeStr, 
        end_time: endTimeStr, 
        description: description || "",
        meeting_link: meeting_link || "",
        reminder: {
          via_email: Boolean(via_email),
          via_app: Boolean(via_app),
          before_value: parseInt(before_value) || 15,
          before_unit: before_unit || "minutes"
        },
        related_task_id: related_task_id || null
      })   
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
    console.log("Failed to update Appointment", error);   
    throw error;
  }
}

export const deleteAppointment = async(id) => {
  try {
    const token = localStorage.getItem("refresh_token");
    
    const response = await fetch(`${Base_url}/api/v1/appointments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
    console.log("Failed to delete Appointment", error)
    throw error;
  }
}
