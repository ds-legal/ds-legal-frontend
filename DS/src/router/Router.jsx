import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import { lazy, Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Lazy load page components
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../pages/authentication/login/Login"));
const Signup = lazy(() => import("../pages/authentication/signup/Signup"));

function AppRoutes() {
    const location = useLocation();
    const hideSidebar = ["/signup", "/login"].includes(location.pathname);

    return (
        <div className="flex">
            {!hideSidebar && <Sidebar />}
            <div className={`flex-1 ${!hideSidebar ? "sm:ml-18" : ""} pt-4`}>
                <Suspense
                    fallback={<LoadingSpinner size="lg" color="primary" />}
                >
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </Suspense>
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
