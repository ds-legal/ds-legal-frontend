const BASE_URL = import.meta.env.VITE_BaseUrl;

// Notifications API Functions
export const getNotifications = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const params = new URLSearchParams({
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      ...filters
    });

    // Remove empty parameters
    Array.from(params.entries()).forEach(([key, value]) => {
      if (!value || value === '') {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    const url = `${BASE_URL}/api/v1/notifications/${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      status_code: response.status
    };
  } catch (error) {
    console.error('Get notifications failed:', error);
    return {
      success: false,
      error: error.message,
      status_code: 500
    };
  }
};

export const getNotificationSummary = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/api/v1/notifications/summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      status_code: response.status
    };
  } catch (error) {
    console.error('Get notification summary failed:', error);
    return {
      success: false,
      error: error.message,
      status_code: 500
    };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/api/v1/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      status_code: response.status
    };
  } catch (error) {
    console.error('Mark notification as read failed:', error);
    return {
      success: false,
      error: error.message,
      status_code: 500
    };
  }
};

export const archiveNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/api/v1/notifications/${notificationId}/archive`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      status_code: response.status
    };
  } catch (error) {
    console.error('Archive notification failed:', error);
    return {
      success: false,
      error: error.message,
      status_code: 500
    };
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/api/v1/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      status_code: response.status
    };
  } catch (error) {
    console.error('Delete notification failed:', error);
    return {
      success: false,
      error: error.message,
      status_code: 500
    };
  }
};
