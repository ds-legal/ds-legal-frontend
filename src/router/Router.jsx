import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";
import { lazy, Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Lazy load page components
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Appointment = lazy(() => import("../pages/Appointments"));
const Invoice = lazy(() => import("../pages/Invoice"));
const Settings = lazy(() => import("../pages/Settings"));
const Task = lazy(() => import("../pages/Tasks"));
const Note = lazy(() => import("../pages/Notes"));
const Login = lazy(() => import("../pages/authentication/login/Login"));
const Signup = lazy(() => import("../pages/authentication/signup/Signup"));

// AppRoutes
function AppRoutes() {
    const location = useLocation();
    const hideSidebar = ["/signup", "/login"].includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Combined header + content area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - sticky at top left */}
                {!hideSidebar && (
                    <div className="sticky top-0 h-screen">
                        <Sidebar />
                    </div>
                )}

                {/* Right side (header + content) */}
                <div
                    className={`flex-1 flex flex-col ${
                        !hideSidebar ? "sm:pl-0" : ""
                    }`}
                >
                    {/* Header - sticky at top */}
                    {!hideSidebar && <Header />}

                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-auto">
                        <Suspense
                            fallback={
                                <LoadingSpinner size="lg" color="primary" />
                            }
                        >
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/invoices" element={<Invoice />} />
                                <Route path="/tasks" element={<Task />} />
                                <Route
                                    path="/appointments"
                                    element={<Appointment />}
                                />
                                <Route path="/notes" element={<Note />} />
                                <Route
                                    path="/settings"
                                    element={<Settings />}
                                />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                            </Routes>
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
