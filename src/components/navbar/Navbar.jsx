import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../modules/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setOpen }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  console.log("user",user);
  

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6">

      {/* ⭐ MENU BUTTON (MOBILE + TABLET) */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded hover:bg-gray-100"
      >
        <Menu size={22} />
      </button>

      <h2 className="font-semibold text-gray-700">
        Welcome, {user?.name || user?.role}
      </h2>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm"
      >
        Logout
      </button>
    </header>
  );
}
