import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ allowedRoles }) {

  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  //  Not logged in
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Role not allowed
  if (!allowedRoles.includes(user.role)) {

    // redirect to correct panel
    if (user.role === "superadmin")
      return <Navigate to="/admin" replace />;

    if (user.role === "franchise")
      return <Navigate to="/franchise" replace />;

    if (user.role === "staff")
      return <Navigate to="/staff" replace />;
  }

  //  Allowed
  return <Outlet />;
}
