// import { useDispatch } from "react-redux";
// import { addToCart } from "../cartSlice";

// export default function MenuItemCard({ item }) {

//   const dispatch = useDispatch();
//   const { activeTab } = useSelector(s => s.guestTabs);

// dispatch(addToCart({
//   tabId: activeTab._id,
//   item
// }));


//   if (!item) return null;

//   return (
//     <div
//       onClick={() => dispatch(addToCart(item))}
//       className="
//         bg-white rounded-xl shadow-sm
//         hover:shadow-lg cursor-pointer
//         transition overflow-hidden
//       "
//     >
//       <img
//         src={item.image || "/no-food.png"}
//         className="h-32 w-full object-cover"
//       />

//       <div className="p-3">
//         <h3 className="font-semibold text-sm">
//           {item.name}
//         </h3>

//         <p className="text-xs text-gray-500">
//           {item.category}
//         </p>

//         <p className="mt-2 font-bold text-blue-600">
//           ₹ {item.price}
//         </p>
//       </div>
//     </div>
//   );
// }




import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../cartSlice";

export default function MenuItemCard({ item }) {

  const dispatch = useDispatch();
  const { activeTab } = useSelector(
    state => state.guestTabs
  );

  const handleAdd = () => {

    if (!activeTab?._id) {
      alert("Select guest first");
      return;
    }

    dispatch(
      addToCart({
        tabId: activeTab._id,
        item,
      })
    );
  };

  return (
    <div
      onClick={handleAdd}
      className="border rounded-lg p-4 cursor-pointer hover:shadow"
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-28 w-full object-cover mb-2"
      />

      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-sm text-gray-500">
        ₹ {item.price}
      </p>
    </div>
  );
}
