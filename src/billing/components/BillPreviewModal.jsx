


// import { useEffect, useState } from "react";
// import { apiGet, apiPost } from "../../services/apiHelpers";

// export default function BillPreviewModal({
//   tabId,
//   open,
//   onClose,
//   onBillGenerated
// }) {

//   const [bill, setBill] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [generating, setGenerating] = useState(false);

//   /* ================= LOAD BILL ================= */

//   useEffect(() => {

//     if (!open || !tabId) return;

//     const loadBill = async () => {
//       try {
//         setLoading(true);

//         const res = await apiGet(`/billing/preview/${tabId}`);
//         setBill(res.data.data);

//       } catch (err) {
//         alert(err.response?.data?.message || "Bill load failed");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBill();

//   }, [open, tabId]);

//   /* ================= GENERATE BILL ================= */

//   const generateBill = async () => {
//     try {
//       setGenerating(true);

//       await apiPost(`/billing/generate/${tabId}`);

//       alert("✅ Bill Generated Successfully");

//       onBillGenerated && onBillGenerated();

//     } catch (err) {
//       alert(err.response?.data?.message || "Generate failed");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

//       {/* ===== MODAL CARD ===== */}
//       <div className="w-[460px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

//         {/* ===== HEADER ===== */}
//         <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
//           <h2 className="text-lg font-semibold tracking-wide">
//             Bill Preview
//           </h2>
//           <p className="text-xs opacity-80">
//             Review order before generating final bill
//           </p>
//         </div>

//         {/* ===== BODY ===== */}
//         <div className="p-6">

//           {/* LOADING */}
//           {loading && (
//             <p className="text-center text-gray-500">
//               Loading bill...
//             </p>
//           )}

//           {/* BILL CONTENT */}
//           {!loading && bill && (
//             <>
//               {/* ITEMS LIST */}
//               <div className="max-h-[260px] overflow-y-auto space-y-3 pr-1">

//                 {bill.items.map((item, i) => (
//                   <div
//                     key={i}
//                     className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition"
//                   >
//                     <div>
//                       <p className="font-medium text-gray-800">
//                         {item.name}
//                       </p>

//                       <p className="text-xs text-gray-500">
//                         Qty {item.qty} × ₹{item.price}
//                       </p>
//                     </div>

//                     <p className="font-semibold text-gray-900">
//                       ₹ {(item.price * item.qty).toLocaleString()}
//                     </p>
//                   </div>
//                 ))}

//               </div>

//               {/* ===== TOTAL SECTION ===== */}
//               <div className="mt-6 border-t pt-4">

//                 <div className="flex justify-between text-gray-600 text-sm">
//                   <span>Items Total</span>
//                   <span>
//                     ₹ {bill.grandTotal?.toLocaleString()}
//                   </span>
//                 </div>

//                 <div className="flex justify-between text-xl font-bold mt-2 text-indigo-600">
//                   <span>Grand Total</span>
//                   <span>
//                     ₹ {bill.grandTotal?.toLocaleString()}
//                   </span>
//                 </div>

//               </div>

//               {/* ===== ACTION BUTTONS ===== */}
//               <div className="flex justify-between gap-3 mt-6">

//                 <button
//                   onClick={onClose}
//                   className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition font-medium"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={generateBill}
//                   disabled={generating}
//                   className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
//                 >
//                   {generating ? "Generating..." : "Generate Bill"}
//                 </button>

//               </div>
//             </>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../services/apiHelpers";

export default function BillPreviewModal({
  tabId,
  open,
  onClose,
  onBillGenerated
}) {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerInfo, setCustomerInfo] = useState(null);
const [checkingCustomer, setCheckingCustomer] = useState(false);


  /* ================= LOAD BILL ================= */
  useEffect(() => {
    if (!open || !tabId) return;

    const loadBill = async () => {
      try {
        setLoading(true);
        const res = await apiGet(`/billing/preview/${tabId}`);
        setBill(res.data.data);
      } catch (err) {
        alert(err.response?.data?.message || "Bill load failed");
      } finally {
        setLoading(false);
      }
    };

    loadBill();
  }, [open, tabId]);


  useEffect(() => {

  if (!customerMobile || customerMobile.length < 6) {
    setCustomerInfo(null);
    return;
  }

  const checkCustomer = async () => {
    try {
      setCheckingCustomer(true);

      const res = await apiGet(
        `/customers/check?mobile=${customerMobile}`
      );

      setCustomerInfo(res.data.data);

      // auto fill name if existing
      if (res.data.data?.name) {
        setCustomerName(res.data.data.name);
      }

    } catch (err) {
      console.log("Customer not found");
      setCustomerInfo(null);
    } finally {
      setCheckingCustomer(false);
    }
  };

  const delay = setTimeout(checkCustomer, 500); // debounce

  return () => clearTimeout(delay);

}, [customerMobile]);


  /* ================= GENERATE BILL ================= */
  const generateBill = async () => {
    try {
      setGenerating(true);
      await apiPost(`/billing/generate/${tabId}`, {
        customerName,
        customerMobile
      });

      alert("Bill Generated Successfully");
      onBillGenerated && onBillGenerated();
    } catch (err) {
      alert(err.response?.data?.message || "Generate failed");
    } finally {
      setGenerating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* ===== MODAL CARD ===== */}
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* ===== HEADER ===== */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-blue-600">
          <h2 className="text-xl font-semibold text-white">
            Bill Preview
          </h2>
          <p className="text-sm text-indigo-100 mt-1">
            Review order before generating final bill
          </p>
        </div>

        {/* ===== BODY ===== */}
        <div className="p-6">
          {/* LOADING STATE */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">Loading bill details...</p>
            </div>
          )}

          {/* BILL CONTENT */}
          {!loading && bill && (
            <>
              {/* ITEMS LIST */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  ORDER ITEMS
                </h3>
                <div className="max-h-[280px] overflow-y-auto space-y-3 pr-2">
                  {bill.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.qty} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 ml-4">
                        ₹ {(item.price * item.qty).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== TOTAL SECTION ===== */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-gray-600 text-sm mb-2">
                  <span>Subtotal</span>
                  <span>₹ {bill.grandTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-indigo-600 pt-2 border-t border-gray-200 mt-2">
                  <span>Grand Total</span>
                  <span>₹ {bill.grandTotal?.toLocaleString()}</span>
                </div>
              </div>

              {/* ===== CUSTOMER INFO SECTION ===== */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                {!showCustomer ? (
                  <button
                    onClick={() => setShowCustomer(true)}
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Customer Information (Optional)
                  </button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      CUSTOMER DETAILS
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Customer Name (optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="tel"
                        placeholder="Mobile Number (optional)"
                        value={customerMobile}
                        onChange={(e) => setCustomerMobile(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Loyalty points will be added if mobile number provided
                      </p>
                      {/* ===== CUSTOMER STATUS ===== */}
                    {checkingCustomer && (
                    <p className="text-xs text-gray-500 mt-2">
                        Checking customer...
                    </p>
                    )}

                    {customerInfo && (
                    <div className="mt-3 p-3 rounded-lg bg-indigo-50 border border-indigo-200">

                        <p className="text-sm font-semibold text-gray-800">
                        {customerInfo.name}
                        </p>

                        <p className="text-xs text-gray-600">
                        Points: {customerInfo.loyaltyPoints}
                        </p>

                        {customerInfo.rewardEligible && (
                        <p className="text-sm font-semibold text-green-600 mt-1">
                            🎁 Eligible for FREE FOOD
                        </p>
                        )}

                    </div>
                    )}

                    </div>
                  </div>
                )}
              </div>

              {/* ===== ACTION BUTTONS ===== */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={generateBill}
                  disabled={generating}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Generate Bill</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}