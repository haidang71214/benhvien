import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import SocketProvider from "./context/socketProvider.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <SocketProvider>
      <ChatProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
          </ChatProvider>
          </SocketProvider>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
);