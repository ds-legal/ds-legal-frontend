import { ChevronDown, Search, Bell, User, Home, FileText, X } from "lucide-react";
import { NAV_ITEMS } from "./Sidebar";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo-color.png";
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../../store/auth.context';
import { useDashboard } from '../../store/dashboard.context';
import { useState, useEffect, useRef } from 'react';
import { getTaskSuggestions, searchTasks } from '../../api/search_api';
import { getNotificationSummary, getNotifications, markNotificationAsRead } from '../../api/notifications_api';

const Header = () => {
    const location = useLocation();
    const [storedUser, setStoredUser] = useState(null);
    
    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const searchRef = useRef(null);
    const suggestionsRef = useRef(null);
    
    // Notifications state
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
    const notificationsRef = useRef(null);

    // Find the active nav item that matches the current path
    const activePageItem = NAV_ITEMS.find(
        (item) =>
            location.pathname === item.link ||
            (item.link !== "/" && location.pathname.startsWith(item.link))
    );

    const navigate = useNavigate();
    const { user: authUser, isInitialized } = UseAuth();
    const { user: dashboardUser } = useDashboard();
    
    // Search functions
    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.length >= 2) {
            setIsSearching(true);
            try {
                const response = await getTaskSuggestions(query, 5);
                if (response.success) {
                    setSearchSuggestions(response.data.suggestions || []);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error('Search suggestions error:', error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchSuggestions([]);
            setShowSuggestions(false);
        }
    };
    
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to tasks page with search query
            navigate(`/tasks?search=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
            setSearchQuery('');
            setShowMobileSearch(false);
        }
    };
    
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.title);
        navigate(`/tasks?search=${encodeURIComponent(suggestion.title)}`);
        setShowSuggestions(false);
        setShowMobileSearch(false);
    };
    
    // Notification functions
    const loadNotifications = async () => {
        setIsLoadingNotifications(true);
        try {
            const [summaryResponse, notificationsResponse] = await Promise.all([
                getNotificationSummary(),
                getNotifications({ limit: 10, status: 'unread' })
            ]);
            
            if (summaryResponse.success) {
                setUnreadCount(summaryResponse.data.total_unread || 0);
            }
            
            if (notificationsResponse.success) {
                setNotifications(notificationsResponse.data.notifications || []);
            }
        } catch (error) {
            console.error('Load notifications error:', error);
        } finally {
            setIsLoadingNotifications(false);
        }
    };
    
    const handleNotificationClick = async (notification) => {
        if (notification.status === 'unread') {
            try {
                await markNotificationAsRead(notification.id);
                setNotifications(prev => 
                    prev.map(n => n.id === notification.id ? { ...n, status: 'read' } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error) {
                console.error('Mark notification as read error:', error);
            }
        }
        
        if (notification.action_url) {
            navigate(notification.action_url);
        }
        setShowNotifications(false);
    };
    
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            loadNotifications();
        }
    };
    
    // Listen for localStorage changes
    useEffect(() => {
        const updateStoredUser = () => {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            setStoredUser(user);
        };
        
        updateStoredUser(); // Initial load
        
        // Listen for storage events (when avatar is updated)
        window.addEventListener('storage', updateStoredUser);
        
        // Custom event for same-tab localStorage updates
        window.addEventListener('userUpdated', updateStoredUser);
        
        return () => {
            window.removeEventListener('storage', updateStoredUser);
            window.removeEventListener('userUpdated', updateStoredUser);
        };
    }, []);
    
    // Load initial notification count
    useEffect(() => {
        if (isInitialized) {
            loadNotifications();
        }
    }, [isInitialized]);
    
    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
                searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            
            // Close mobile search if clicking outside
            if (showMobileSearch && !event.target.closest('.mobile-search-container')) {
                setShowMobileSearch(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMobileSearch]);
    
    // Use dashboard user data if available, fallback to auth user, then stored user
    const currentUser = dashboardUser || authUser || storedUser;
    
    // Try to get avatar from multiple sources (prioritize auth user since it's most up-to-date)
    const avatarUrl = currentUser?.avatar_url || storedUser?.avatar_url || currentUser?.photo;
    
    // Don't render avatar until auth is initialized to avoid flashing
    if (!isInitialized) {
        return null;
    }

    return (
        <header className="sticky top-0 w-full flex items-center justify-between px-4 py-4 bg-white shadow-sm z-50">
            {/* Left side - Logo on mobile + Page name and icon */}
            <div className="flex items-center gap-3">
                {/* Logo - Show only on small screens */}
               

                {/* Active page icon and name */}
                {activePageItem ? (
                    <>
                   <div className="flex gap-2 items-center">
                     <div className=" w-6 pt-1">
                     <img
                    src={logo}
                    alt="logo"
                    className="h-12 w-full object-contain block sm:hidden"
                      />
                      </div>
                        <activePageItem.Icon className="h-5 w-5 text-gray-600 hidden lg:flex" />
                        <span className="text-lg font-semibold">
                            {activePageItem.name}
                        </span>
                   </div>
                    </>
                ) : location.pathname.startsWith('/invoice-preview/') ? (
                    <>
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className="text-base font-medium">Invoice Preview</span>
                    </>
                ) : (
                    <>
                        <Home className="h-5 w-5 text-gray-600" />
                        <span className="text-base font-medium">Dashboard</span>
                    </>
                )}
            </div>

            {/* Right side - Search, Notifications, User */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search */}
                <div className="flex items-center">
                    {/* Mobile Search Button */}
                    <button 
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className="block sm:hidden p-2 rounded-full hover:bg-gray-100"
                    >
                        <Search className="h-5 w-5 text-[#798394]" />
                    </button>
                    
                    {/* Mobile Search Input */}
                    {showMobileSearch && (
                        <div className="mobile-search-container absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 z-50 sm:hidden">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#798394]" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#798394] focus:border-transparent text-sm"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowMobileSearch(false)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </button>
                            </form>
                            
                            {/* Mobile Search Suggestions */}
                            {showSuggestions && searchSuggestions.length > 0 && (
                                <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {searchSuggestions.map((suggestion) => (
                                        <div
                                            key={suggestion.id}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="font-medium text-sm text-gray-900">
                                                {suggestion.title}
                                            </div>
                                            <div className="text-xs text-gray-500 capitalize">
                                                Status: {suggestion.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Desktop input */}
                    <div className="hidden sm:block relative" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#798394]" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#798394] focus:border-transparent text-sm"
                            />
                        </form>
                        
                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && searchSuggestions.length > 0 && (
                            <div 
                                ref={suggestionsRef}
                                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                            >
                                {searchSuggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="font-medium text-sm text-gray-900">
                                            {suggestion.title}
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize">
                                            Status: {suggestion.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Loading indicator */}
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#798394]"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                    <button 
                        onClick={toggleNotifications}
                        className="relative p-2 rounded-full cursor-pointer hover:bg-gray-100"
                    >
                        <Bell className="h-5 w-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-[calc(100vw-2rem)] max-w-sm sm:absolute sm:top-full sm:right-0 sm:left-auto sm:transform-none sm:w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto mt-2">
                            <div className="p-3 sm:p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                            {unreadCount} unread
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {isLoadingNotifications ? (
                                <div className="p-4 text-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#798394] mx-auto"></div>
                                </div>
                            ) : notifications.length > 0 ? (
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                                notification.status === 'unread' ? 'bg-blue-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                                                        {notification.title}
                                                    </div>
                                                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-2">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </div>
                                                </div>
                                                {notification.status === 'unread' && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0 ml-2"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    <Bell className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-xs sm:text-sm">No notifications</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* User dropdown */}
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/settings')}>
                    <div className="h-8 w-8 rounded-full bg-[#ffece5] flex items-center justify-center overflow-hidden border border-gray-200">
                        {avatarUrl ? (
                            <img 
                                src={avatarUrl} 
                                alt="user" 
                                className="w-full h-full object-cover object-center rounded-full"
                                onError={(e) => {
                                    console.log('Avatar failed to load:', avatarUrl);
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-[#1983D5] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : <User className="h-4 w-4 text-white" />}
                            </div>
                        )}
                    </div>
                    <ChevronDown className="hidden sm:block h-4 w-4 text-gray-600" />
                </div>
            </div>
        </header>
    );
};

export default Header;
