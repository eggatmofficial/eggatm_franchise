// import { useState } from "react";
// import { apiPost } from "../../services/apiHelpers";

// export default function PaymentModal({
//   tabId,
//   open,
//   onClose
// }) {

//   const [loading, setLoading] = useState(false);

//   if (!open) return null;

//   const pay = async (method) => {
//     try {
//       setLoading(true);

//       await apiPost("/payments/proceed", {
//         tabId,
//         method
//       });

//       alert("✅ Payment Success");

//       onClose();
//       window.location.reload();

//     } catch (err) {
//       alert(err.response?.data?.message || "Payment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

//       <div className="bg-white w-[380px] rounded-xl p-6">

//         <h2 className="text-xl font-semibold mb-4">
//           Select Payment Method
//         </h2>

//         <div className="space-y-3">

//           <button
//             onClick={() => pay("cash")}
//             className="w-full bg-green-600 text-white py-2 rounded"
//           >
//             Cash
//           </button>

//           <button
//             onClick={() => pay("upi")}
//             className="w-full bg-blue-600 text-white py-2 rounded"
//           >
//             UPI
//           </button>

//           <button
//             onClick={() => pay("card")}
//             className="w-full bg-purple-600 text-white py-2 rounded"
//           >
//             Card
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { apiPost } from "../../services/apiHelpers";

export default function PaymentModal({
  tabId,
  open,
  onClose
}) {

  const [loading, setLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);

  if (!open) return null;

  const pay = async (method) => {
    try {
      setLoading(true);
      setActiveMethod(method);

      await apiPost("/payments/proceed", {
        tabId,
        method
      });

      alert("Payment Success");

      onClose();
      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
      setActiveMethod(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white w-[380px] rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          Select Payment Method
        </h2>

        <div className="space-y-3">

          <button
            disabled={loading && activeMethod === "cash"}
            onClick={() => pay("cash")}
            className={`w-full py-2 rounded text-white ${
              loading && activeMethod === "cash"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600"
            }`}
          >
            {loading && activeMethod === "cash" ? "Processing..." : "Cash"}
          </button>

          <button
            disabled={loading && activeMethod === "upi"}
            onClick={() => pay("upi")}
            className={`w-full py-2 rounded text-white ${
              loading && activeMethod === "upi"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600"
            }`}
          >
            {loading && activeMethod === "upi" ? "Processing..." : "UPI"}
          </button>

          <button
            disabled={loading && activeMethod === "card"}
            onClick={() => pay("card")}
            className={`w-full py-2 rounded text-white ${
              loading && activeMethod === "card"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600"
            }`}
          >
            {loading && activeMethod === "card" ? "Processing..." : "Card"}
          </button>

        </div>
      </div>
    </div>
  );
}