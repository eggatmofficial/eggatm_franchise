import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";

export default function StaffLayout() {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar open={open} setOpen={setOpen} role="staff" />

      <div className="flex-1 flex flex-col">
        <Navbar setOpen={setOpen} />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
