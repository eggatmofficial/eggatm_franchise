import { Plus } from "lucide-react";

export default function GuestTabs({
  guests = [],
  activeGuest,
  setActiveGuest,
  onAddGuest,
}) {
  return (
    <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1">

      {/* GUEST TABS */}
      {guests.map((g) => (
        <button
          key={g.guestNo}
          onClick={() => setActiveGuest(g.guestNo)}
          className={`
            px-5 py-2 rounded-xl
            text-sm font-medium
            whitespace-nowrap
            transition-all duration-200
            ${
              activeGuest === g.guestNo
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white border hover:bg-gray-50"
            }
          `}
        >
          Guest {g.guestNo}
        </button>
      ))}

      {/* ADD GUEST */}
      <button
        onClick={onAddGuest}
        className="
          flex items-center gap-2
          px-4 py-2 rounded-xl
          bg-gray-100 hover:bg-gray-200
          transition
        "
      >
        <Plus size={16} />
        Add
      </button>
    </div>
  );
}
