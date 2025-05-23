import { ChevronDown, Search, Bell, User, Home } from "lucide-react";
import { NAV_ITEMS } from "./Sidebar";
import { useLocation } from "react-router-dom";
import Logo from "../../assets/logo-color.png"

const Nav = () => {
    const location = useLocation();

    // Find the active nav item that matches the current path
    const activePageItem = NAV_ITEMS.find(
        (item) =>
            location.pathname === item.link ||
            (item.link !== "/" && location.pathname.startsWith(item.link))
    );

    return (
        <header className="sticky top-0 max-h-fit flex items-center justify-between gap-6 py-4 px-8 bg-white shadow-sm">
            {/* Left side - Dynamic Icon + Page name */}
            <div className="flex items-center space-x-2">
                {activePageItem ? (
                    <>
                        <activePageItem.Icon className="h-5 w-5 text-gray-600" />
                        <span className="text-lg font-semibold">
                            {activePageItem.name}
                        </span>
                    </>
                ) : (
                    <>
                       <img src={Logo} alt="logo"/>
                    </>
                )}
            </div>

            {/* Right side - Search, Notifications, User dropdown */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search - Mobile icon only, desktop full input */}
                <div className="flex items-center">
                    <Search className="block sm:hidden h-6 w-6 text-[#798394]" />
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

export default Nav;
