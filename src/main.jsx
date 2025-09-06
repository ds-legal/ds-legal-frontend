import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./router/Router";
import { AuthProvider } from "./store/auth.context";
import { TaskProvider } from "./store/task.context";
import { AppointmentProvider } from "./store/appointment.context";
import { DashboardProvider } from "./store/dashboard.context";

createRoot(document.getElementById("root")).render(
    <StrictMode>
    <AuthProvider>
    <TaskProvider>
    <AppointmentProvider>
    <DashboardProvider>
        <App />
    </DashboardProvider>
    </AppointmentProvider>
    </TaskProvider> 
    </AuthProvider>
    </StrictMode>
);
