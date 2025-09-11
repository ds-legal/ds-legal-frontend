import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDashboardData } from '../api/dashboard_api';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(() => {
    // Initialize with cached data if available
    const cached = localStorage.getItem('dashboard_cache');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const data = await getDashboardData();
      console.log('Dashboard data received:', data);
      setDashboardData(data);
      
      // Cache the data for faster subsequent loads
      localStorage.setItem('dashboard_cache', JSON.stringify(data));
      localStorage.setItem('dashboard_cache_timestamp', Date.now().toString());
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  // Initialize dashboard data on mount
  useEffect(() => {
    const initializeDashboard = async () => {
      const token = localStorage.getItem('token');
      
      // Only initialize if user is authenticated
      if (!token) {
        setIsInitialized(true);
        return;
      }
      
      const cacheTimestamp = localStorage.getItem('dashboard_cache_timestamp');
      const now = Date.now();
      const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;
      
      // If we have fresh cached data (less than 5 minutes old), use it
      if (dashboardData && cacheAge < 5 * 60 * 1000) {
        setIsInitialized(true);
        // Still fetch fresh data in background
        fetchDashboardData(false);
      } else {
        // No cache or stale cache, fetch immediately
        await fetchDashboardData(true);
      }
    };
    
    initializeDashboard();
  }, []);

  // Listen for user authentication events
  useEffect(() => {
    const handleUserUpdate = () => {
      const token = localStorage.getItem('token');
      if (token && !isInitialized) {
        // User just logged in, fetch dashboard data
        fetchDashboardData(true);
      }
    };

    // Listen for user updates (login, profile updates)
    window.addEventListener('userUpdated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, [isInitialized]);

  // Listen for logout events to clear cache
  useEffect(() => {
    const handleLogout = () => {
      setDashboardData(null);
      setError(null);
      setIsInitialized(false);
    };

    // Listen for custom logout event
    window.addEventListener('userLoggedOut', handleLogout);
    
    return () => {
      window.removeEventListener('userLoggedOut', handleLogout);
    };
  }, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchDashboardData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loading]);

  const value = {
    dashboardData,
    loading,
    error,
    isInitialized,
    fetchDashboardData,
    user: dashboardData?.user || null,
    statistics: dashboardData?.statistics || null,
    upcomingAppointments: dashboardData?.upcoming_appointments || [],
    highPriorityTasks: dashboardData?.high_priority_tasks || [],
    recentInvoices: dashboardData?.recent_invoices || []
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
