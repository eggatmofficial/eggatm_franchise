
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Store, FileText, Receipt, Gift, Users, UtensilsCrossed, ChefHat } from "lucide-react";

export default function Sidebar({ open, setOpen, role }) {

  const menus = {
    superadmin: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
      { name: "Franchises", path: "/admin/franchises", icon: Store },
    ],

    franchise: [
      { name: "Dashboard", path: "/franchise", icon: LayoutDashboard },
      { name: "Staff", path: "/franchise/staff", icon: Users },
      { name: "Tables", path: "/franchise/tables", icon: Store },
      { name: "Menu", path: "/franchise/menu", icon: UtensilsCrossed },
      { name: "Billing", path: "/franchise/billing", icon: Receipt },
      { name: "Customer Rewards", path: "/franchise/customer-rewards", icon: Gift },
    ],

    staff: [
      { name: "Dashboard", path: "/staff", icon: LayoutDashboard },
      { name: "Tables", path: "/staff/tables", icon: Store },
      { name: "Orders", path: "/staff/orders", icon: ChefHat },
      { name: "Billing", path: "/staff/billing", icon: Receipt },
    ],
  };

  const menu = menus[role];

  return (
    <>
      {/* ===== ANIMATION STYLE ===== */}
      <style>
        {`
        .logo-text {
          background: linear-gradient(
            90deg,
            #60a5fa,
            #a78bfa,
            #f472b6,
            #60a5fa
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientMove 3s linear infinite;
          filter: drop-shadow(0 0 6px rgba(168,85,247,0.7));
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        `}
      </style>

      {/* ===== SMOOTH OVERLAY ===== */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300 ease-in-out
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
          lg:hidden z-40
        `}
      />

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed lg:static z-50
          w-64 h-full bg-[#0B1220] text-white
          transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          will-change-transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        {/* ===== LOGO ===== */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <h1 className="logo-text text-md font-extrabold tracking-widest">
            EGG! ATM FRANCHISE
          </h1>
        </div>

        {/* ===== MENU ===== */}
        <nav className="p-3 space-y-1">

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={!item.path.includes("/", 1)}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                  group relative flex items-center gap-3
                  px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-300 hover:bg-gray-800"
                  }
                `
                }
              >

                {/* ACTIVE LINE */}
                <span className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-blue-500 opacity-0 group-hover:opacity-100" />

                <Icon
                  size={18}
                  className="transition-transform group-hover:scale-110"
                />

                <span className="font-medium">
                  {item.name}
                </span>

              </NavLink>
            );
          })}

        </nav>
      </aside>
    </>
  );
}