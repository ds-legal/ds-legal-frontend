import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNotificationSummary } from '../api/notifications_api';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadNotificationCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await getNotificationSummary();
      if (response.success) {
        setUnreadCount(response.data.total_unread || 0);
      }
    } catch (error) {
      console.error('Failed to load notification count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUnreadCount = (newCount) => {
    setUnreadCount(newCount);
  };

  const incrementUnreadCount = () => {
    setUnreadCount(prev => prev + 1);
  };

  const decrementUnreadCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Load notification count on mount
  useEffect(() => {
    loadNotificationCount();
  }, []);

  // Listen for user updates to refresh notification count
  useEffect(() => {
    const handleUserUpdate = () => {
      loadNotificationCount();
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, []);

  const value = {
    unreadCount,
    isLoading,
    loadNotificationCount,
    updateUnreadCount,
    incrementUnreadCount,
    decrementUnreadCount,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
