import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[400px] bg-white p-6 rounded shadow">
        <Outlet />
      </div>
    </div>
  );
}
