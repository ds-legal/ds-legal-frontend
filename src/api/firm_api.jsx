const Base_url = import.meta.env.VITE_BaseUrl;

// Get firm settings
export const getFirmSettings = async () => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${Base_url}/api/v1/user/firm-settings/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    // If authentication failed, redirect to login
    if (data?.detail === "Could not validate credentials") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
    
    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch firm settings");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get firm settings", error);
    throw error;
  }
};

// Create or update firm settings
export const updateFirmSettings = async (firmData) => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${Base_url}/api/v1/user/firm-settings/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(firmData),
    });
    
    const data = await response.json();
    
    // If authentication failed, redirect to login
    if (data?.detail === "Could not validate credentials") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
    
    if (!response.ok) {
      throw new Error(data?.message || "Failed to update firm settings");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to update firm settings", error);
    throw error;
  }
};
