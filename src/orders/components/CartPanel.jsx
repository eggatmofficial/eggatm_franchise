


// import { useSelector, useDispatch } from "react-redux";
// import {
//   increaseQty,
//   decreaseQty,
//   clearCart,
// } from "../cartSlice";
// import { saveOrder } from "../orderSlice";
// import { useParams } from "react-router-dom";

// export default function CartPanel() {

//   const dispatch = useDispatch();
//   const { sessionId, tableId } = useParams();

//   const { activeTab } = useSelector(
//     s => s.guestTabs
//   );

//   const { carts } = useSelector(
//     s => s.cart
//   );

//   /* ⭐ GET ACTIVE CART */
//   const items = carts[activeTab?._id] || [];

//   const total = items.reduce(
//     (sum, i) => sum + i.price * i.qty,
//     0
//   );

// const placeOrder = async () => {

//   if (!items.length) return;

//   const clientOrderId = crypto.randomUUID();

//   const orderItems = items.map(i => ({
//     menuId: i._id,
//     name: i.name,
//     price: i.price,
//     qty: i.qty,
//     image: i.image
//   }));

//   await dispatch(
//     saveOrder({
//       sessionId,
//       tableId,
//       tabId: activeTab._id,
//       items: orderItems,
//       clientOrderId   // ⭐ IMPORTANT
//     })
//   ).unwrap();

//   dispatch(clearCart(activeTab._id));

//   alert("Order placed ✅");
// };


//   return (
//     <div className="
//   w-full
//   lg:w-[340px]
//   h-full
//   border-l
//   bg-white
//   p-4
//   overflow-y-auto
// ">


//       <h2 className="font-semibold text-lg mb-4">
//         Cart ({activeTab?.guestName})
//       </h2>

//       {items.length === 0 && (
//         <p className="text-gray-400">
//           No items added
//         </p>
//       )}

//       {items.map(item => (
//         <div key={item._id}
//           className="flex justify-between mb-3">

//           <div>
//             <p>{item.name}</p>
//             <p className="text-sm text-gray-500">
//               ₹ {item.price}
//             </p>
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={() =>
//                 dispatch(decreaseQty({
//                   tabId: activeTab._id,
//                   id: item._id,
//                 }))
//               }
//               className="px-2 bg-gray-200 rounded"
//             >-</button>

//             {item.qty}

//             <button
//               onClick={() =>
//                 dispatch(increaseQty({
//                   tabId: activeTab._id,
//                   id: item._id,
//                 }))
//               }
//               className="px-2 bg-gray-200 rounded"
//             >+</button>
//           </div>
//         </div>
//       ))}

//       <div className="mt-5 border-t pt-4">
//         <div className="flex justify-between font-bold">
//           <span>Total</span>
//           <span>₹ {total}</span>
//         </div>

//         <button
//           onClick={placeOrder}
//           className="w-full mt-4 py-3 rounded-lg bg-blue-600 text-white"
//         >
//           Place Order
//         </button>
//       </div>
//     </div>
//   );
// }






import { useSelector, useDispatch } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  clearCart,
} from "../cartSlice";
import { saveOrder } from "../orderSlice";
import { useParams } from "react-router-dom";

export default function CartPanel() {

  const dispatch = useDispatch();
  const { sessionId, tableId } = useParams();

  const { activeTab } = useSelector(s => s.guestTabs);
  const { carts } = useSelector(s => s.cart);

  const items = carts[activeTab?._id] || [];

  const total = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {

    if (!items.length) return;

    const clientOrderId = crypto.randomUUID();

    const orderItems = items.map(i => ({
      menuId: i._id,
      name: i.name,
      price: i.price,
      qty: i.qty,
      image: i.image
    }));

    await dispatch(
      saveOrder({
        sessionId,
        tableId,
        tabId: activeTab._id,
        items: orderItems,
        clientOrderId
      })
    ).unwrap();

    dispatch(clearCart(activeTab._id));

    alert("Order placed");
  };

  /* ================= UI ================= */

  return (
    <div className="
      w-full lg:w-[360px]
      h-full
      flex flex-col
      bg-gray-50
    ">

      {/* ===== HEADER ===== */}
      <div className="p-4 border-b bg-white shadow-sm">
        <h2 className="font-semibold text-lg">
          🧾 Cart
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {activeTab?.guestName || "No Guest Selected"}
        </p>
      </div>

      {/* ===== ITEMS LIST ===== */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {items.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            No items added
          </div>
        )}

        {items.map(item => (
          <div
            key={item._id}
            className="
              bg-white
              rounded-xl
              shadow-sm
              p-3
              flex justify-between items-center
            "
          >
            {/* ITEM INFO */}
            <div>
              <p className="font-medium">
                {item.name}
              </p>
              <p className="text-sm text-gray-500">
                ₹ {item.price}
              </p>
            </div>

            {/* QTY CONTROLS */}
            <div className="
              flex items-center
              gap-2
              bg-gray-100
              rounded-lg
              px-2 py-1
            ">
              <button
                onClick={() =>
                  dispatch(decreaseQty({
                    tabId: activeTab._id,
                    id: item._id,
                  }))
                }
                className="
                  w-7 h-7
                  rounded-md
                  bg-white
                  shadow
                  hover:bg-gray-200
                "
              >
                −
              </button>

              <span className="w-6 text-center font-semibold">
                {item.qty}
              </span>

              <button
                onClick={() =>
                  dispatch(increaseQty({
                    tabId: activeTab._id,
                    id: item._id,
                  }))
                }
                className="
                  w-7 h-7
                  rounded-md
                  bg-white
                  shadow
                  hover:bg-gray-200
                "
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== TOTAL SECTION ===== */}
      <div className="
        border-t
        bg-white
        p-4
        sticky bottom-0
      ">

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-blue-600">
            ₹ {total}
          </span>
        </div>

        <button
          onClick={placeOrder}
          disabled={!items.length}
          className="
            w-full mt-4
            py-3
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            text-white
            font-semibold
            shadow-md
            hover:scale-[1.02]
            transition
            disabled:opacity-40
          "
        >
          Place Order
        </button>
      </div>

    </div>
  );
}
