import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../../services/apiHelpers";
import {
  Receipt,
  IndianRupee,
  Eye,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function BillListScreen() {

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openBill, setOpenBill] = useState(null);

  /* ================= LOAD BILLS ================= */

  const loadBills = async () => {
    try {
      setLoading(true);

      const res = await apiGet("/billing"); // backend list API
      setBills(res.data.data || []);

    } catch (err) {
      alert("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  /* ================= REOPEN BILL ================= */

  const reopenBill = async (billId) => {
    if (!window.confirm("Reopen this bill?")) return;

    try {
      await apiPut(`/billing/reopen/${billId}`);
      alert("Bill reopened");
      loadBills();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  /* ================= PRINT ================= */

  const printBill = (bill) => {
    const w = window.open("", "_blank");

    w.document.write(`
      <h2>Restaurant Bill</h2>
      <p>Table: ${bill.tableNumber}</p>
      <hr/>
      ${bill.items.map(i => `
        <div>
          ${i.name} x ${i.qty}
          = ₹${i.price * i.qty}
        </div>
      `).join("")}
      <hr/>
      <h3>Total: ₹${bill.totalAmount}</h3>
    `);

    w.print();
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-slate-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Receipt /> Generated Bills
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Bill</th>
              <th className="p-3 text-center">Table</th>
              <th className="p-3 text-center">Amount</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && bills.map(bill => {

              const expanded = openBill === bill._id;

              return (
                <>
                  {/* ===== ROW ===== */}
                  <tr key={bill._id} className="border-t">
                    <td className="p-3 font-mono">
                      #{bill._id.slice(-6)}
                    </td>

                    <td className="text-center">
                      {bill.tableNumber}
                    </td>

                    <td className="text-center font-semibold text-blue-600">
                      ₹ {bill.totalAmount}
                    </td>

                    <td className="text-center">
                      <span className={`
                        px-2 py-1 rounded text-xs
                        ${bill.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"}
                      `}>
                        {bill.status}
                      </span>
                    </td>

                    <td className="text-center space-x-2">

                      <button
                        onClick={() =>
                          setOpenBill(expanded ? null : bill._id)
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        {expanded ? <ChevronUp/> : <ChevronDown/>}
                      </button>

                      <button
                        onClick={() => printBill(bill)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Printer size={16}/>
                      </button>

                      {bill.status !== "paid" && (
                        <button
                          onClick={() => reopenBill(bill._id)}
                          className="p-2 hover:bg-red-100 rounded text-red-600"
                        >
                          <RotateCcw size={16}/>
                        </button>
                      )}

                    </td>
                  </tr>

                  {/* ===== ITEMS ===== */}
                  {expanded && (
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="p-4">

                        {bill.items.map((item,i)=>(
                          <div
                            key={i}
                            className="flex justify-between py-1"
                          >
                            <span>
                              {item.name} x {item.qty}
                            </span>

                            <span>
                              ₹ {item.price * item.qty}
                            </span>
                          </div>
                        ))}

                      </td>
                    </tr>
                  )}

                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
