// // import { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useParams } from "react-router-dom";

// // import { fetchMenu } from "../../menu/menuSlice";
// // import { fetchGuestTabs } from "../../modules/guestTabs/guestTabSlice";
// // import { fetchSingleTable } from "../../tables/tableSlice";

// // import CartPanel from "../components/CartPanel";
// // import MenuItemCard from "../components/MenuItemCart";
// // import GuestTabsHeader from
// //   "../../modules/guestTabs/components/GuestTabsHeader";
// //   import { useState } from "react";
// // import BillPreviewModal from "../../billing/components/BillPreviewModal";


// // export default function OrderScreen() {

// //   const dispatch = useDispatch();
// //   const { sessionId, tableId } = useParams();
// //   const [showBill, setShowBill] = useState(false);


// //   /* ===== MENU ===== */
// //   const { items, loading } = useSelector(
// //     state => state.menu
// //   );

// //   /* ===== GUEST TABS ===== */
// //   const { activeTab } = useSelector(
// //     state => state.guestTabs
// //   );

// //   /* ===== TABLE INFO (FOR CAPACITY) ===== */
// //   const { selectedTable } = useSelector(
// //     state => state.tables
// //   );

// //   /* LOAD MENU */
// //   useEffect(() => {
// //     dispatch(fetchMenu());
// //   }, [dispatch]);

// //   /* LOAD GUEST TABS */
// //   useEffect(() => {
// //     if (sessionId) {
// //       dispatch(fetchGuestTabs(sessionId));
// //     }
// //   }, [dispatch, sessionId]);

// //   /* LOAD TABLE DETAILS */
// //   useEffect(() => {
// //     if (tableId) {
// //       dispatch(fetchSingleTable(tableId));
// //     }
// //   }, [dispatch, tableId]);

// //   return (
// //     <div className="flex h-[calc(100vh-70px)]">

// //       {/* ===== LEFT SIDE ===== */}
// //       <div className="flex-1 flex flex-col">

// //         {/* ⭐ GUEST HEADER */}
// //         <GuestTabsHeader
// //           sessionId={sessionId}
// //           tableId={tableId}
// //           capacity={selectedTable?.capacity}
// //         />

// //         {/* ===== MENU AREA ===== */}
// //         <div className="flex-1 overflow-y-auto p-6">

// //           <h1 className="text-xl font-semibold mb-5">
// //             Session : {sessionId}
// //           </h1>

// //           <p className="mb-4 text-sm text-gray-500">
// //             Active Guest :
// //             <span className="font-semibold ml-2">
// //               {activeTab?.guestName || "No Guest"}
// //             </span>
// //           </p>

// //           {activeTab && (
// //         <button
// //             onClick={() => setShowBill(true)}
// //             className="mb-5 px-4 py-2 bg-blue-600 text-white rounded-lg"
// //         >
// //             Preview Bill
// //         </button>
// //             )}


// //           {loading ? (
// //             <p>Loading menu...</p>
// //           ) : (
// //             <div className="
// //               grid gap-4
// //               grid-cols-2
// //               md:grid-cols-3
// //               lg:grid-cols-4
// //             ">
// //               {items?.map(item => (
// //                 <MenuItemCard
// //                   key={item._id}
// //                   item={item}
// //                 />
// //               ))}
// //             </div>
// //           )}

// //         </div>
// //       </div><CartPanel />

// //         <BillPreviewModal
// //         open={showBill}
// //         tabId={activeTab?._id}
// //         onClose={() => setShowBill(false)}
// //         />



// //       {/* ===== CART ===== */}
// //       <CartPanel />
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// import { fetchMenu } from "../../menu/menuSlice";
// import { fetchGuestTabs } from "../../modules/guestTabs/guestTabSlice";
// import { fetchSingleTable } from "../../tables/tableSlice";

// import CartPanel from "../components/CartPanel";
// import MenuItemCard from "../components/MenuItemCart";
// import GuestTabsHeader from
//   "../../modules/guestTabs/components/GuestTabsHeader";

// import BillPreviewModal from "../../billing/components/BillPreviewModal";
// import PaymentModal from "../../billing/components/PaymentModal";

// export default function OrderScreen() {

//   const dispatch = useDispatch();
//   const { sessionId, tableId } = useParams();

//   /* ================= MODALS ================= */
//   const [showBill, setShowBill] = useState(false);
//   const [showPayment, setShowPayment] = useState(false);
//   const [showCart, setShowCart] = useState(false);

//   /* ================= STORE ================= */
//   const { items, loading } = useSelector(s => s.menu);
//   const { activeTab } = useSelector(s => s.guestTabs);
//   const { selectedTable } = useSelector(s => s.tables);

//   /* ================= LOAD DATA ================= */

//   useEffect(() => {
//     dispatch(fetchMenu());
//   }, [dispatch]);

//   useEffect(() => {
//     if (sessionId) {
//       dispatch(fetchGuestTabs(sessionId));
//     }
//   }, [dispatch, sessionId]);

//   useEffect(() => {
//     if (tableId) {
//       dispatch(fetchSingleTable(tableId));
//     }
//   }, [dispatch, tableId]);

//   const hasOrders = activeTab?.totalAmount > 0;

//   /* ================= UI ================= */

//   return (
//     <div className="flex flex-col lg:flex-row h-[calc(100vh-70px)]">

//       {/* ========= LEFT SIDE ========= */}
//       <div className="flex-1 flex flex-col min-h-0">

//         <GuestTabsHeader
//           sessionId={sessionId}
//           tableId={tableId}
//           capacity={selectedTable?.capacity}
//         />

//         <div className="flex-1 overflow-y-auto p-4 sm:p-6">

//           <h1 className="text-lg font-semibold mb-3">
//             Session : {sessionId}
//           </h1>

//           <p className="mb-4 text-sm text-gray-500">
//             Active Guest :
//             <span className="font-semibold ml-2">
//               {activeTab?.guestName || "No Guest"}
//             </span>
//           </p>

//           {/* ===== PREVIEW BILL BUTTON ===== */}
//           {activeTab && hasOrders && (
//             <button
//               onClick={() => setShowBill(true)}
//               className="mb-5 px-4 py-2 bg-blue-600 text-white rounded-lg"
//             >
//               Preview Bill
//             </button>
//           )}

//           {/* ===== MENU ===== */}
//           {loading ? (
//             <p>Loading menu...</p>
//           ) : (
//             <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
//               {items?.map(item => (
//                 <MenuItemCard key={item._id} item={item}/>
//               ))}
//             </div>
//           )}

//         </div>
//       </div>

//       {/* ========= DESKTOP CART ========= */}
//       <div className="hidden lg:flex lg:w-[360px] border-l">
//         <CartPanel />
//       </div>

//       {/* ========= MOBILE CART ========= */}
//       <button
//         onClick={() => setShowCart(true)}
//         className="lg:hidden fixed bottom-5 right-5
//         bg-green-600 text-white px-5 py-3 rounded-full shadow-xl"
//       >
//         Cart
//       </button>

//       {showCart && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">

//           <div className="w-[90%] max-w-[400px] bg-white h-full flex flex-col">

//             <div className="p-4 border-b flex justify-between">
//               <h2 className="font-semibold">Cart</h2>
//               <button onClick={()=>setShowCart(false)}>✕</button>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               <CartPanel />
//             </div>

//           </div>
//         </div>
//       )}

//       {/* ========= BILL PREVIEW ========= */}
//       <BillPreviewModal
//         open={showBill}
//         tabId={activeTab?._id}
//         onClose={() => setShowBill(false)}
//         onBillGenerated={() => {
//           setShowBill(false);
//           setShowPayment(true);
//         }}
//       />

//       {/* ========= PAYMENT ========= */}
//       <PaymentModal
//         open={showPayment}
//         tabId={activeTab?._id}
//         onClose={() => setShowPayment(false)}
//       />

//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchMenu } from "../../menu/menuSlice";
import { fetchGuestTabs } from "../../modules/guestTabs/guestTabSlice";
import { fetchSingleTable } from "../../tables/tableSlice";

import CartPanel from "../components/CartPanel";
import MenuItemCard from "../components/MenuItemCart";
import GuestTabsHeader from
  "../../modules/guestTabs/components/GuestTabsHeader";

import BillPreviewModal from "../../billing/components/BillPreviewModal";
import PaymentModal from "../../billing/components/PaymentModal";

export default function OrderScreen() {

  const dispatch = useDispatch();
  const { sessionId, tableId } = useParams();

  /* ================= MODALS ================= */
  const [showBill, setShowBill] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCart, setShowCart] = useState(false);

  /* ================= SEARCH ================= */
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= STORE ================= */
  const { items, loading } = useSelector(s => s.menu);
  const { activeTab } = useSelector(s => s.guestTabs);
  const { selectedTable } = useSelector(s => s.tables);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchGuestTabs(sessionId));
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (tableId) {
      dispatch(fetchSingleTable(tableId));
    }
  }, [dispatch, tableId]);

  /* ================= FILTER MENU ITEMS ================= */
  const filteredItems = items?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasOrders = activeTab?.totalAmount > 0;

  /* ================= UI ================= */

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-70px)]">

      {/* ========= LEFT SIDE ========= */}
      <div className="flex-1 flex flex-col min-h-0">

        <GuestTabsHeader
          sessionId={sessionId}
          tableId={tableId}
          capacity={selectedTable?.capacity}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-lg font-semibold">
                Session : {sessionId}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Active Guest :
                <span className="font-semibold ml-2">
                  {activeTab?.guestName || "No Guest"}
                </span>
              </p>
            </div>

            {/* ===== SEARCH INPUT ===== */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 pl-10 pr-4
                border border-gray-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ===== PREVIEW BILL BUTTON ===== */}
          {activeTab && hasOrders && (
            <button
              onClick={() => setShowBill(true)}
              className="mb-5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700
              text-white rounded-xl shadow-md hover:shadow-lg
              transform transition-all duration-200 hover:scale-[1.02]
              active:scale-[0.98]"
            >
              Preview Bill
            </button>
          )}

          {/* ===== SEARCH RESULTS COUNT ===== */}
          {searchTerm && (
            <p className="text-sm text-gray-500 mb-4">
              Found {filteredItems?.length} items
            </p>
          )}

          {/* ===== MENU ===== */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredItems?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg">No items found</p>
              <p className="text-sm">Try searching with different keywords</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {filteredItems?.map(item => (
                <MenuItemCard key={item._id} item={item}/>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ========= DESKTOP CART ========= */}
      <div className="hidden lg:flex lg:w-[380px] border-l bg-gray-50/50">
        <CartPanel />
      </div>

      {/* ========= MOBILE CART BUTTON ========= */}
      <button
        onClick={() => setShowCart(true)}
        className="lg:hidden fixed bottom-6 right-6
        bg-gradient-to-r from-green-600 to-green-700
        text-white px-6 py-3 rounded-full shadow-2xl
        transform transition-all duration-200 hover:scale-105
        active:scale-95 flex items-center gap-2 z-40"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="font-medium">Cart</span>
        {activeTab?.items?.length > 0 && (
          <span className="ml-1 bg-white text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
            {activeTab.items.length}
          </span>
        )}
      </button>

      {/* ========= MOBILE CART MODAL ========= */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-sm">
          <div className="w-full max-w-[420px] bg-white h-full flex flex-col
          animate-slide-left">
            <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Your Cart
              </h2>
              <button
                onClick={() => setShowCart(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100
                flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <CartPanel />
            </div>
          </div>
        </div>
      )}

      {/* ========= BILL PREVIEW ========= */}
      <BillPreviewModal
        open={showBill}
        tabId={activeTab?._id}
        onClose={() => setShowBill(false)}
        onBillGenerated={() => {
          setShowBill(false);
          setShowPayment(true);
        }}
      />

      {/* ========= PAYMENT ========= */}
      <PaymentModal
        open={showPayment}
        tabId={activeTab?._id}
        onClose={() => setShowPayment(false)}
      />

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slide-left {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-left {
          animation: slide-left 0.3s ease-out;
        }
      `}</style>

    </div>
  );
}
