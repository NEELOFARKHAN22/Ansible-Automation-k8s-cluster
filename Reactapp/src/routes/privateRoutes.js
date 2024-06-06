import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
