import React from "react";
import "./App.css";
import AppRouter from "./AppRouter";
import { AuthProvider } from "./context/AuthContext";

// PUBLIC_INTERFACE
function App() {
  /** Root component: wraps the app with providers and routes */
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
