import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/dataCont";

export default function ProtectedRoute({ children }) {
  const { authData, loading } = useContext(UserContext);

  if (loading) return null; // or spinner

  if (!authData?.token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
