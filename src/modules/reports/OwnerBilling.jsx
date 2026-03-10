import { useEffect, useState } from "react";
import { apiGet } from "../../services/apiHelpers";

export default function OwnerBilling() {

  const [bills,setBills] = useState([]);

  useEffect(()=>{
    loadBills();
  },[]);

  const loadBills = async ()=>{
    const res = await apiGet("/billing");
    setBills(res.data.data);
  };

  return (
    <div className="p-6">

      <h2 className="text-xl font-semibold mb-5">
        All Shop Bills
      </h2>

      <table className="w-full border">

        <thead className="bg-gray-100">
          <tr>
            <th>Bill</th>
            <th>Table</th>
            <th>Amount</th>
            <th>Staff</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {bills.map(bill => (
            <tr key={bill._id} className="border-t">

              <td>{bill.billNumber}</td>
              <td>{bill.tableId}</td>
              <td>₹ {bill.totalAmount}</td>
              <td>{bill.generatedBy}</td>

              <td>
                <span className={
                  bill.status === "paid"
                  ? "text-green-600"
                  : "text-orange-600"
                }>
                  {bill.status}
                </span>
              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
}
