/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import {
    Home,
    ClipboardList,
    Calendar,
    FileText,
    StickyNote,
    Settings,
    LogOut,
} from "lucide-react";
import clsx from "clsx";
import logo from "../../assets/newlogo.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UserLogOut } from "../../api/auth_api";

export const NAV_ITEMS = [
    { name: "Dashboard", Icon: Home, mobile: true, link: "/dashboard" },
    {
        name: "Task Management",
        Icon: ClipboardList,
        mobile: true,
        mobileName: "Tasks",
        link: "/tasks",
    },
    {
        name: "Appointments",
        Icon: Calendar,
        mobile: true,
        link: "/appointments",
    },
    {
        name: "Invoices",
        Icon: FileText,
        mobile: true,
        mobileName: "Invoice",
        link: "/invoices",
    },
    { name: "Notes", Icon: StickyNote, mobile: false, link: "/notes" },
    { name: "Settings", Icon: Settings, mobile: false, link: "/settings" },
];

export default function Sidebar() {
    const location = useLocation();
    const [active, setActive] = useState("");
    const navigate = useNavigate()

    // Set initial active state based on current route
    useEffect(() => {
        const currentItem = NAV_ITEMS.find(
            (item) =>
                location.pathname === item.link ||
                (item.link !== "/" && location.pathname.startsWith(item.link))
        );
        if (currentItem) {
            setActive(currentItem.name);
        }
    }, [location.pathname]);

    const handleLogout =  async() => {
     const response =  await  UserLogOut()
      if(response.status_code === 200){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("refresh_token")
        navigate("/login")

      }
    //   console.log("response", response)
    };

    return (
        <>
            {/* Desktop & Tablet Sidebar */}
            <aside className="hidden sticky top-0 max-h-screen lg:flex flex-col 
            justify-between w-64 xl:w-72 h-screen bg-black text-white p-4">
            <div>
             {/* Logo Section */}
            <div className="flex items-center gap-2 mb-10">
             <img src={logo} alt="logo" />
            </div>

             {/* Navigation Links */}
            <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
            <NavLink to={item.link} className="w-full">
            <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-200 cursor-pointer",
                active === item.name
                    ? "bg-[#141D2A] text-white font-semibold"
                    : "hover:bg-[#1f2a38] text-gray-300"
            )}
            aria-current={
                active === item.name
                    ? "page"
                    : undefined
            }
            >
            <item.Icon size={20} aria-hidden="true" />
            <span>{item.name}</span>
           </button>
            </NavLink>
             ))}
            </nav>
            </div>

            {/* User Info Section */}
            <div className="flex items-center gap-3 mt-10 border-t border-gray-700 pt-4">
            <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="User profile"
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col text-sm">
            <span className="font-semibold">Joan Legal</span>
            <span className="text-gray-400 text-xs">
                Joan@dslegal.com
            </span>
            </div>
            <button
            onClick={handleLogout}
            className="ml-auto p-4 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Log out"
            >
            <LogOut size={18} />
            </button>
                </div>
            </aside>
            {/* Mobile Bottom Navigation */}
            <nav
            className="fixed z-50   bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 flex justify-around py-2 shadow-md"
            aria-label="Mobile navigation"
            >
            {NAV_ITEMS.filter((item) => item.mobile).map((item) => (
             <NavLink to={item.link}>
            <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className="flex flex-col items-center justify-center p-2 cursor-pointer"
            aria-current={
                active === item.name ? "page" : undefined
            }
            >
            <item.Icon
            size={24}
            className={clsx(
                active === item.name
                    ? "text-blue-500"
                    : "text-gray-500"
            )}
                aria-hidden="true"
            />
            <span
            className={clsx(
             "text-xs mt-1",
             active === item.name
                ? "text-blue-500 font-medium"
                : "text-gray-500"
            )}
           >
            {item.mobileName || item.name}
             </span>
            {active === item.name && (
            <div className="w-4 h-1 rounded-full bg-blue-500 mt-1" />
            )}
             </button>
             </NavLink>
            ))}
            <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center p-2 cursor-pointer"
            >
            <LogOut size={24} className="text-gray-500" />
            <span className="text-xs mt-1 text-gray-500">Logout</span>
            </button>
            </nav>
        </>
    );
}
