import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isLogin } = useContext(AuthContext);

  if (isLogin === null) {
    return null; // or a spinner
  }

  if (!isLogin) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export const AuthenticatedUser = ({ children }) => {
  const { isLogin } = useContext(AuthContext);

  if (isLogin === null) {
    return null;
  }

  if (isLogin) {
    return <Navigate to="/" />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, isLogin } = useContext(AuthContext);

  if (isLogin === null) {
    return null;
  }

  if (!isLogin) {
    return <Navigate to="/auth" />;
  }

  if (user.role !== "instructor") {
    return <Navigate to="/" />;
  }

  return children;
};
