import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";
import { useLayoutEffect, useState } from "react";
import PasswordRecovery from "../pages/authentication/recoverPassword/PasswordRecovery";
import CreatePassword from "../pages/authentication/createPassord/CreatePassword";
import toast, { Toaster } from "react-hot-toast";
import ProctedRoute from "./ProctedRoute";
import CreateTasks from "../pages/CreateTasks";

// Direct imports instead of lazy loading
import Dashboard from "../pages/Dashboard";
import Appointment from "../pages/Appointments";
import Invoice from "../pages/Invoice";
import Settings from "../pages/Settings";
import Task from "../pages/Tasks";
import Note from "../pages/Notes";
import Login from "../pages/authentication/login/Login";
import Signup from "../pages/authentication/signup/Signup";
import FirmInfo from "../pages/InvoiceScreens/FirmInfo";
import Receipts from "../pages/InvoiceScreens/Receipts";
import QuickInvoice from "../pages/InvoiceScreens/QuickInvoice";
import CreateInvoice from "../pages/CreateInvoice";
import VerifyMail from "../pages/authentication/VerifyEmail/VerifyEmail";
import ApproveMail from "../pages/authentication/VerifyEmail/ApproveEmail";
import EditTasks from "../pages/EditTask";

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  const hideSidebar = [
    "/signup",
    "/login",
    "/auth/verify/verify-email",
    "/",
    "/password",
    "/createPassword",
    "/createTask",
    "/firmInfo",
    "/receipts",
    "/quickInvoice",
    "/createInvoice", 
    "/auth/verify/forget-password",
    "/verifyEmail",
    "/editTask"
  ].includes(location.pathname);

  useLayoutEffect(() => {
    const firstLoad = sessionStorage.getItem("firstLoad") === null;
    if (firstLoad) {
      sessionStorage.setItem("firstLoad", "false");
      navigate("/login", { replace: true });
    }
    setInitialized(true);
  }, [navigate]);

  if (!initialized) return null;

  return (
    <div className="flex flex-col lg:h-screen min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        {!hideSidebar && (
          <div className="sticky top-0 h-screen z-50">
            <Sidebar />
          </div>
        )}

        <div className={`flex-1 flex flex-col ${!hideSidebar ? "sm:pl-0" : ""}`}>
          {!hideSidebar && <Header />}

          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProctedRoute>
                    <Dashboard />
                  </ProctedRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProctedRoute>
                    <Invoice />
                  </ProctedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProctedRoute>
                    <Task />
                  </ProctedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProctedRoute>
                    <Appointment />
                  </ProctedRoute>
                }
              />
              <Route
                path="/notes"
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
               <Route
                path="/firmInfo"
                element={
                  <ProctedRoute>
                    <FirmInfo/>
                  </ProctedRoute>
                }
              />
                <Route
                path="/receipts"
                element={
                  <ProctedRoute>
                   <Receipts/>
                  </ProctedRoute>
                }
              />
                <Route
                path="/quickInvoice"
                element={
                  <ProctedRoute>
                   <QuickInvoice/>
                  </ProctedRoute>
                }
              />
              <Route
                path="/createInvoice"
                element={
                  <ProctedRoute>
                   <CreateInvoice/>
                  </ProctedRoute>
                }
              />
               <Route
                path="/editTask"
                element={
                  <ProctedRoute>
                  <EditTasks/>
                  </ProctedRoute>
                }
              />
              
              
              <Route path="/login" element={<Login />} />
              <Route path="/verifyEmail" element={<VerifyMail />} />
              <Route path="/auth/verify/verify-email" element={<ApproveMail />} />
              <Route path="/createTask" element={<CreateTasks />} />
              <Route path="/password" element={<PasswordRecovery />} />
              <Route path="/auth/verify/forget-password" element={<CreatePassword />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="w-full overflow-x-hidden">
      <Router>
        <AppRoutes />
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
