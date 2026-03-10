import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import FranchiseLayout from "../layouts/FranchiseLayout";
import StaffLayout from "../layouts/StaffLayout";

import PrivateRoute from "./PrivateRoute";

import Login from "../modules/auth/pages/Login";
import FranchiseList from "../modules/franchise/pages/FranchiseList";
import SuperAdminDashboard from "../modules/dashboard/superadmin/SuperAdminDashboard";
import ReportsScreen from "../../src/reports/ReportsScreen";
import FranchiseDashboard from "../modules/dashboard/franchise/FranchiseDashboard";
import StaffList from "../modules/staff/pages/StaffList";
import TablesScreen from "../tables/pages/TablesScreen";
import OrderScreen from "../orders/pages/OrderScreen";
import MenuScreen from "../menu/pages/MenuScreen";
import BillingScreen from "../modules/payments/pages/BillingScreen";
import StaffDashboard from "../modules/dashboard/staff/StaffDashboard";
import StaffBilling from "../modules/staff/components/StaffBilling";
import CustomerRewards from "../modules/rewards/pages/CustomerRewards";

export default function AppRoutes() {
  return (
  <BrowserRouter>
  <Routes>

    {/* LOGIN */}
    <Route element={<AuthLayout />}>
      <Route path="/" element={<Login />} />
    </Route>

    {/* SUPERADMIN */}
    <Route element={<PrivateRoute allowedRoles={["superadmin"]} />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="franchises" element={<FranchiseList />} />
        <Route path="reports" element={<ReportsScreen />} />
      </Route>
    </Route>

    {/* FRANCHISE */}
    <Route element={<PrivateRoute allowedRoles={["franchise"]} />}>
      <Route path="/franchise" element={<FranchiseLayout />}>
        <Route index element={<FranchiseDashboard />} />
        <Route path="staff" element={<StaffList />} />
        <Route path="tables" element={<TablesScreen />} />
        <Route path="menu" element={<MenuScreen />} />
        <Route path="billing" element={<BillingScreen />} />
        <Route path="customer-rewards" element={<CustomerRewards />} />



      </Route>
    </Route>

    
    {/* STAFF */}
<Route element={<PrivateRoute allowedRoles={["staff"]} />}>
  <Route path="/staff" element={<StaffLayout />}>

    <Route index element={<StaffDashboard />} />

    {/* ✅ TABLE VIEW FOR WAITER */}
    <Route path="tables" element={<TablesScreen />} />
    <Route path="orders/:sessionId/:tableId/:tabId" element={<OrderScreen />} />

    <Route path="billing" element={<StaffBilling />} />


  </Route>
</Route>


  </Routes>
</BrowserRouter>

  );
}
