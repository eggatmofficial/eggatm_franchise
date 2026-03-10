import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";

export default function FranchiseLayout() {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar
        role="franchise"
        open={open}
        setOpen={setOpen}
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* NAVBAR */}
        <Navbar setOpen={setOpen} />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
