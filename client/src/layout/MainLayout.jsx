import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import { AuthContext } from "@/contexts/authContext";
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex flex-col min-h-screen">
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
  );
};

export default MainLayout;
