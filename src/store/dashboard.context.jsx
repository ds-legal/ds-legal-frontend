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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getDashboardData();
      console.log('Dashboard data received:', data);
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

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
