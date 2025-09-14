const Base_url = import.meta.env.VITE_BaseUrl;

// Create invoice
export const createInvoice = async (invoiceData) => {
  try {
    const token = localStorage.getItem("token");
    
    console.log('Base URL:', Base_url);
    console.log('Full URL:', `${Base_url}/api/v1/invoices/`);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    const response = await fetch(`${Base_url}/api/v1/invoices/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
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
      console.error('Invoice creation failed:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      // Handle validation errors (422)
      if (response.status === 422) {
        const errorMessage = data?.detail || data?.message || "Validation error";
        console.error('Validation errors:', errorMessage);
        throw new Error(`Validation Error: ${JSON.stringify(errorMessage)}`);
      }
      
      throw new Error(data?.message || data?.detail || "Failed to create invoice");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to create invoice", error);
    throw error;
  }
};

// Get all invoices
export const getAllInvoices = async () => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${Base_url}/api/v1/invoices/`, {
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
      throw new Error(data?.message || "Failed to fetch invoices");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get invoices", error);
    throw error;
  }
};

// Get single invoice
export const getSingleInvoice = async (invoiceId) => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${Base_url}/api/v1/invoices/${invoiceId}`, {
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
      throw new Error(data?.message || "Failed to fetch invoice");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get invoice", error);
    throw error;
  }
};

// Get invoice preview
export const getInvoicePreview = async (invoiceId) => {
  try {
    const token = localStorage.getItem("token");
    
    console.log('Fetching invoice preview for ID:', invoiceId);
    console.log('Preview URL:', `${Base_url}/api/v1/invoices/${invoiceId}/preview`);
    
    const response = await fetch(`${Base_url}/api/v1/invoices/${invoiceId}/preview`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('Preview response status:', response.status);
    console.log('Preview response headers:', response.headers.get('content-type'));
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse);
      throw new Error('Preview endpoint returned non-JSON response');
    }
    
    const data = await response.json();
    console.log('Preview data received:', data);
    
    // If authentication failed, redirect to login
    if (data?.detail === "Could not validate credentials") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
    
    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch invoice preview");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get invoice preview", error);
    throw error;
  }
};

// Download invoice
export const downloadInvoice = async (invoiceId) => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${Base_url}/api/v1/invoices/${invoiceId}/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // If authentication failed, redirect to login
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
    
    if (!response.ok) {
      throw new Error("Failed to download invoice");
    }
    
    // Handle file download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to download invoice", error);
    throw error;
  }
};

// Update invoice
export const updateInvoice = async (invoiceId, invoiceData) => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${Base_url}/api/v1/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
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
      throw new Error(data?.message || "Failed to update invoice");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to update invoice", error);
    throw error;
  }
};

// Send invoice email
export const sendInvoiceEmail = async (invoiceId) => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${Base_url}/api/v1/invoices/${invoiceId}/send-email`, {
      method: "POST",
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
      throw new Error(data?.message || "Failed to send invoice email");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to send invoice email", error);
    throw error;
  }
};

export const updateInvoiceStatus = async (invoiceId, newStatus) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${Base_url}/api/v1/invoices/${invoiceId}/status?new_status=${newStatus}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || "Failed to update invoice status");
    return data;
  } catch (error) {
    console.error("Failed to update invoice status", error);
    throw error;
  }
};
