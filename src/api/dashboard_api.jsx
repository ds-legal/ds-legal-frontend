const Base_url = import.meta.env.VITE_BaseUrl;

/**
 * Fetch dashboard data including user info, statistics, and recent data
 * @returns {Promise<Object>} Dashboard data object
 */
export const getDashboardData = async () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  try {
    const response = await fetch(`${Base_url}/api/v1/dashboard/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. You don't have permission to view this data.");
      } else if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const response_data = await response.json();
    
    // The API response has a nested structure with a 'data' property
    if (response_data.success && response_data.data) {
      return response_data.data;
    } else {
      throw new Error(response_data.message || "Failed to fetch dashboard data");
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error;
  }
};
