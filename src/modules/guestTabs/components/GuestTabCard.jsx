import { useNavigate } from "react-router-dom";

export default function GuestTabCard({ tab }) {

  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/staff/orders/${tab.sessionId}/${tab._id}`)
      }
      className="
        cursor-pointer
        bg-white rounded-2xl
        border border-gray-200
        shadow-sm hover:shadow-xl
        p-6 transition
        hover:-translate-y-1
      "
    >
      <h2 className="text-lg font-semibold">
        {tab.guestName}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Guests: {tab.personCount}
      </p>

      <div className="mt-4 flex justify-between">
        <span className="
          px-3 py-1 rounded-full text-xs
          bg-green-100 text-green-700
        ">
          Active
        </span>

        <span className="font-bold">
          ₹ {tab.totalAmount || 0}
        </span>
      </div>
    </div>
  );
}
