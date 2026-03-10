import { useEffect, useState } from "react";
import { apiGet } from "../../../services/apiHelpers";

export default function BillingPreviewModal({
  tabId,
  open,
  onClose,
}) {

  const [bill, setBill] = useState(null);

  useEffect(() => {

    if (!open || !tabId) return;

    const loadBill = async () => {
      const res = await apiGet(`/billing/preview/${tabId}`);
      setBill(res.data.data);
    };

    loadBill();

  }, [open, tabId]);

  if (!open) return null;

return (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">

    {/* MODAL */}
    <div className="
      w-full max-w-md
      bg-white/95 backdrop-blur-xl
      rounded-3xl
      shadow-[0_20px_60px_rgba(0,0,0,0.25)]
      border border-gray-100
      overflow-hidden
      animate-[fadeIn_.25s_ease]
    ">

      {/* HEADER */}
      <div className="
        px-6 py-5
        bg-gradient-to-r from-indigo-600 to-purple-600
        text-white
      ">
        <h2 className="text-xl font-semibold tracking-wide">
          Bill Preview
        </h2>
        <p className="text-xs text-indigo-100 mt-1">
          Order summary
        </p>
      </div>

      {/* BODY */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">

        {!bill && (
          <div className="text-center py-10 text-gray-500">
            Loading bill...
          </div>
        )}

        {bill && (
          <>
            {/* ITEMS */}
            <div className="space-y-3">
              {bill.items.map((i, idx) => (
                <div
                  key={idx}
                  className="
                    flex justify-between items-center
                    bg-gray-50
                    rounded-xl
                    px-4 py-3
                    hover:bg-indigo-50/40
                    transition
                  "
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {i.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty × {i.qty}
                    </p>
                  </div>

                  <p className="font-semibold text-indigo-600">
                    ₹ {i.price * i.qty}
                  </p>
                </div>
              ))}
            </div>

            {/* TOTAL SECTION */}
            <div className="
              mt-6
              rounded-2xl
              bg-gradient-to-r from-indigo-50 to-purple-50
              p-5
              border border-indigo-100
            ">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Grand Total
                </span>

                <span className="
                  text-2xl font-bold
                  text-transparent bg-clip-text
                  bg-gradient-to-r from-indigo-600 to-purple-600
                ">
                  ₹ {bill.grandTotal}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      <div className="
        px-6 py-4
        border-t
        bg-gray-50
        flex justify-end
      ">
        <button
          onClick={onClose}
          className="
            px-5 py-2.5
            rounded-xl
            bg-gray-200
            hover:bg-gray-300
            font-medium
            transition
            active:scale-95
          "
        >
          Close
        </button>
      </div>
    </div>

    {/* animation */}
    <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px) scale(.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `}</style>

  </div>
);
}




