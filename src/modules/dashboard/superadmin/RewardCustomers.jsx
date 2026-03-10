import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../../api";

export default function RewardCustomers() {

  const [customers,setCustomers] = useState([]);

  const load = async () => {
    const res = await apiGet("/customers/rewards");
    setCustomers(res.data.data);
  };

  useEffect(()=>{ load(); },[]);

  const reset = async (id)=>{
    await apiPatch(`/customers/reset/${id}`);
    load();
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        ⭐ Reward Eligible Customers
      </h1>

      <div className="grid gap-4">

        {customers.map(c=>(
          <div
            key={c._id}
            className="bg-yellow-50 border border-yellow-400
                       p-5 rounded-xl flex justify-between items-center"
          >

            <div>
              <p className="font-semibold text-lg">
                {c.name || "Customer"}
              </p>

              <p className="text-sm text-gray-600">
                📱 {c.phone}
              </p>

              <p className="text-yellow-700 font-bold">
                ⭐ {c.loyaltyPoints} Points
              </p>
            </div>

            <button
              onClick={()=>reset(c._id)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Reward Given ✅
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}
