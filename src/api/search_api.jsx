const BASE_URL = import.meta.env.VITE_BaseUrl;

// Task Search API Functions
export const searchTasks = async (query, filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const params = new URLSearchParams({
      q: query || '',
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

    const response = await fetch(`${BASE_URL}/api/v1/tasks/search?${params}`, {
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
      data: {
        tasks: data.data || [],
        total: data.data?.length || 0,
        limit: filters.limit || 20,
        offset: filters.offset || 0
      },
      status_code: response.status
    };
  } catch (error) {
    console.error('Task search failed:', error);
    return {
      success: false,
      error: error.message,
      status_code: 500
    };
  }
};

export const getTaskSuggestions = async (query, limit = 10) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    if (!query || query.length < 2) {
      return {
        success: true,
        data: { suggestions: [] }
      };
    }

    const params = new URLSearchParams({
      q: query,
      limit: limit
    });

    const response = await fetch(`${BASE_URL}/api/v1/tasks/suggestions?${params}`, {
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
    console.error('Task suggestions failed:', error);
    return {
      success: false,
      error: error.message,
      status_code: 500
    };
  }
};
