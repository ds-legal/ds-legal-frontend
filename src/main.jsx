import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./router/Router";
import { AuthProvider } from "./store/auth.context";

createRoot(document.getElementById("root")).render(
    <StrictMode>
    <AuthProvider>
        <App />
    </AuthProvider>
    </StrictMode>
);
