import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import { AuthContext } from "@/contexts/authContext";
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";

const App = () => {
  const { user } = useContext(AuthContext);
  return (
    <ThemeProvider>

      <div className="flex flex-col min-h-screen  ">
        {user ? (
          <>
            <Navbar />
            <div className="flex-1 mt-16">
              <Outlet />
            </div>
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
     </ThemeProvider>
  );
};

export default App;
