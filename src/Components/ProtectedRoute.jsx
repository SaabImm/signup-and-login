import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/dataCont";

export default function ProtectedRoute() {
  const { authData } = useContext(UserContext);

  if (!authData?.token) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // render child routes
}
