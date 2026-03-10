import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Users,
  IndianRupee,
  UtensilsCrossed
} from "lucide-react";

import { fetchStaffDashboard } from "../dashboardSlice";

export default function StaffDashboard() {

  const dispatch = useDispatch();

  const { staffStats, loading } =
    useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchStaffDashboard());
  }, [dispatch]);

  if (loading)
    return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-6">
        👨‍🍳 Staff Dashboard
      </h1>

      {/* STATS GRID */}
      <div className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
      ">

        {/* <StatCard
          title="Orders Today"
          value={staffStats?.ordersToday || 0}
          icon={<ShoppingCart size={22} />}
          color="bg-blue-500"
        /> */}

        <StatCard
          title="Guests Served"
          value={staffStats?.guestsServed || 0}
          icon={<Users size={22} />}
          color="bg-purple-500"
        />

        {/* <StatCard
          title="Active Tables"
          value={staffStats?.activeTables || 0}
          icon={<UtensilsCrossed size={22} />}
          color="bg-orange-500"
        /> */}

        <StatCard
          title="Sales Handled"
          value={`₹ ${staffStats?.salesHandled || 0}`}
          icon={<IndianRupee size={22} />}
          color="bg-green-500"
        />

      </div>

    </div>
  );
}

/* ================= CARD ================= */

function StatCard({ title, value, icon, color }) {
  return (
    <div className="
      bg-white rounded-xl shadow-sm
      p-5 flex items-center gap-4
      hover:shadow-md transition
    ">

      <div className={`${color} text-white p-3 rounded-lg`}>
        {icon}
      </div>

      <div>
        <p className="text-gray-500 text-sm">
          {title}
        </p>
        <h2 className="text-2xl font-bold mt-1">
          {value}
        </h2>
      </div>

    </div>
  );
}
