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
import PasswordRecovery from "../pages/authentication/recoverPassword/PasswordRecovery";
import CreatePassword from "../pages/authentication/createPassord/CreatePassword";
import toast, { Toaster } from 'react-hot-toast';
import ProctedRoute from "./ProctedRoute";
import CreateTasks from "../pages/CreateTasks";


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
    const hideSidebar = ["/signup", "/login","/password","/createPassword","/createTask" ].includes(location.pathname);

    return (
        <div className="flex flex-col lg:h-screen min-h-screen">
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
                            <Route path="/" 
                            element={
                            <ProctedRoute>
                            <Dashboard />
                            </ProctedRoute>
                            }
                            />
                            <Route path="/invoices"
                             element={
                            <ProctedRoute>
                             <Invoice />
                             </ProctedRoute>
                             } />
                            <Route
                             path="/tasks"
                              element={
                            <ProctedRoute>
                              <Task />
                              </ProctedRoute>
                              } />
                             <Route
                            path="/appointments"
                            element={
                            <ProctedRoute>
                            <Appointment />
                            </ProctedRoute>
                            }
                            />
                            <Route path="/notes"
                             element={
                            <ProctedRoute>
                             <Note />
                             </ProctedRoute>
                             } 
                             />
                            <Route
                            path="/settings"
                            element={
                            <ProctedRoute>
                            <Settings />
                            </ProctedRoute>
                            }
                            />
                            <Route path="/login" element={<Login />} />
                             <Route path="/createTask" element={<CreateTasks />} />
                            <Route path="/password" element={<PasswordRecovery/>} />
                            <Route path="/createPassword" element={<CreatePassword/>} />
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
      <>
       <div className="w-full overflow-x-hidden">
         <Router>
            <AppRoutes />
        </Router>
        <Toaster />
       </div>
      </>
    );
}

export default App;
