import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/dataCont";

export default function AdminRoute({ children }) {
  const { authData, loading } = useContext(UserContext);

  if (loading) return null; // WAIT for hydration

  if (!authData?.token) {
    return <Navigate to="/" replace />;
  }

  if (authData.user?.role !== "admin") {
    return <Navigate to="/auth/profile" replace />;
  }

  return children;
}
