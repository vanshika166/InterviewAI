import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useSelector((state) => state.user);

  if (loading) return null; 

  if (!userData) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;