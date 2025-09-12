import { ChevronDown, Search, Bell, User, Home, FileText } from "lucide-react";
import { NAV_ITEMS } from "./Sidebar";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo-color.png";
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../../store/auth.context';
import { useDashboard } from '../../store/dashboard.context';
import { useState, useEffect } from 'react';

const Header = () => {
    const location = useLocation();
    const [storedUser, setStoredUser] = useState(null);

    // Find the active nav item that matches the current path
    const activePageItem = NAV_ITEMS.find(
        (item) =>
            location.pathname === item.link ||
            (item.link !== "/" && location.pathname.startsWith(item.link))
    );

    const navigate = useNavigate();
    const { user: authUser, isInitialized } = UseAuth();
    const { user: dashboardUser } = useDashboard();
    
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
                    {/* Mobile icon */}
                    <Search className="block sm:hidden h-6 w-6 text-[#798394]" />
                    {/* Desktop input */}
                    <div className="hidden sm:block relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#798394]" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#798394] focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-full cursor-pointer hover:bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-600" />
                </button>

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
