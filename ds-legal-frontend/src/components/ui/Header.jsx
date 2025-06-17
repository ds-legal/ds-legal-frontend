import { ChevronDown, Search, Bell, User, Home } from "lucide-react";
import { NAV_ITEMS } from "./Sidebar";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo-color.png";

const Header = () => {
    const location = useLocation();

    // Find the active nav item that matches the current path
    const activePageItem = NAV_ITEMS.find(
        (item) =>
            location.pathname === item.link ||
            (item.link !== "/" && location.pathname.startsWith(item.link))
    );

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
                <div className="flex items-center space-x-2 cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-[#ffece5] flex items-center justify-center">
                        <User className="h-4 w-4 text-black" />
                    </div>
                    <ChevronDown className="hidden sm:block h-4 w-4 text-gray-600" />
                </div>
            </div>
        </header>
    );
};

export default Header;
