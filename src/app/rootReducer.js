import { combineReducers } from "@reduxjs/toolkit";


import authReducer from "../modules/auth/authSlice";
import franchiseReducer from "../modules/franchise/franchiseSlice";
import staffReducer from "../modules/staff/staffSlice";
import tableReducer from "../tables/tableSlice";
import sessionReducer from "../modules/sessions/sessionSlice";
import menuReducer from "../menu/menuSlice";
import cartReducer from "../orders/cartSlice";
import guestTabsReducer from "../modules/guestTabs/guestTabSlice";
import paymentsReducer from "../modules/payments/paymentSlice";
import dashboardReducer from "../modules/dashboard/dashboardSlice";
import reportReducer from "../modules/reports/reportSlice";



const rootReducer = combineReducers({
  auth: authReducer,
  franchise: franchiseReducer,
  staff: staffReducer,
  tables: tableReducer, 
  session: sessionReducer,
  menu: menuReducer,
  cart: cartReducer,
  guestTabs: guestTabsReducer,
  payments: paymentsReducer,
  dashboard: dashboardReducer,
  reports: reportReducer,
});

export default rootReducer;
