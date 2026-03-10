// import { Trash2 } from "lucide-react";
// import { Pencil } from "lucide-react";

// export default function TableCard({ table, onDelete, onEdit }) {

//   const colors = {
//     available: "bg-green-500",
//     occupied: "bg-red-500",
//     billing: "bg-yellow-500",
//   };

//   return (
//     <div
//       className={`
//         ${colors[table.status]}
//         text-white rounded-xl
//         p-6 shadow-md
//         relative cursor-pointer
//         hover:scale-105 transition
//       `}
//     >
//       <h2 className="text-xl font-bold text-center">
//         {table.tableNumber}
//       </h2>

//       <p className="text-center text-sm mt-2">
//         Capacity: {table.capacity}
//       </p>

//       <button
//   onClick={(e) => {
//     e.stopPropagation();
//     onEdit(table);
//   }}
//   className="absolute top-2 left-2"
// >
//   <Pencil size={16}/>
// </button>

//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           onDelete(table._id);
//         }}
//         className="absolute top-2 right-2"
//       >
//         <Trash2 size={16} />
//       </button>
//     </div>
//   );
// }






import { Trash2, Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  startSession,
  getActiveSession,
} from "../../modules/sessions/sessionSlice";
import { createGuestTab } from "../../modules/guestTabs/guestTabSlice";


export default function TableCard({ table, onDelete, onEdit }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const colors = {
    available: "bg-green-500",
    occupied: "bg-red-500",
    billing: "bg-yellow-500",
  };

  /* ================= TABLE CLICK ================= */
const handleTableClick = async () => {

  if (user?.role === "franchise") return;

  try {

    // 1️⃣ check existing session
    let session = await dispatch(
      getActiveSession(table._id)
    ).unwrap();

    let isNewSession = false;

    // 2️⃣ create session if not exists
    if (!session) {
      session = await dispatch(
        startSession(table._id)
      ).unwrap();

      isNewSession = true;
    }

    let tab;

    // 3️⃣ create Guest 1 ONLY first time
    if (isNewSession) {
      tab = await dispatch(
        createGuestTab({
          sessionId: session._id,
          tableId: table._id,
          guestName: "Guest 1",
        })
      ).unwrap();
    } else {
      // ✅ fetch existing tabs and use first tab
      const res = await dispatch({
        type: "guestTabs/fetch",
        payload: session._id,
      });

      const tabs = res.payload;

      tab = tabs[0]; // open first guest
    }

    // 4️⃣ keep your SAME navigation
    navigate(
      `/staff/orders/${session._id}/${table._id}/${tab._id}`
    );

  } catch (err) {
    alert(err.message || "Session error");
  }
};



  return (
    <div
      onClick={handleTableClick}
      className={`
        ${colors[table.status]}
        text-white rounded-xl
        p-6 shadow-md
        relative cursor-pointer
        hover:scale-105 transition
      `}
    >
      <h2 className="text-xl font-bold text-center">
        {table.tableNumber}
      </h2>

      <p className="text-center text-sm mt-2">
        Capacity: {table.capacity}
      </p>

      {/* ✅ ONLY FRANCHISE CAN EDIT */}
      {user?.role === "franchise" && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(table);
            }}
            className="absolute top-2 left-2"
          >
            <Pencil size={16}/>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(table._id);
            }}
            className="absolute top-2 right-2"
          >
            <Trash2 size={16} />
          </button>
        </>
      )}
    </div>
  );
}
