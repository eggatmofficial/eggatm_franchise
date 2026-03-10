import { useDispatch, useSelector } from "react-redux";
import {
  setActiveTab,
  createGuestTab,
} from "../guestTabSlice";

export default function GuestTabsHeader({
  sessionId,
  tableId,
  capacity,
}) {

  const dispatch = useDispatch();

  const { tabs, activeTab } = useSelector(
    state => state.guestTabs
  );

  /* ===== ADD GUEST ===== */
  const handleAddGuest = () => {

    // ⭐ CAPACITY CHECK
    if (capacity && tabs.length >= capacity) {
      alert(
        `Table capacity is ${capacity}. Cannot add more guests.`
      );
      return;
    }

    dispatch(
      createGuestTab({
        sessionId,
        tableId,
        guestName: `Guest ${tabs.length + 1}`,
      })
    );
  };

  return (
    <div className="flex gap-3 p-3 border-b bg-white flex-wrap">

      {/* ===== GUEST BUTTONS ===== */}
      {tabs.map(tab => (
        <button
          key={tab._id}
          onClick={() => dispatch(setActiveTab(tab))}
          className={`px-4 py-2 rounded-lg font-medium transition
          ${
            activeTab?._id === tab._id
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {tab.guestName}
        </button>
      ))}

      {/* ===== ADD GUEST BUTTON ===== */}
      <button
        onClick={handleAddGuest}
        className="px-4 py-2 rounded-lg bg-green-500 text-white"
      >
        + Add Guest
      </button>

    </div>
  );
}
