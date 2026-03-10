import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  fetchGuestTabs
} from "../guestTabSlice";

import GuestTabCard from "../components/GuestTabCard";
import CreateGuestModal from "../components/CreateGuestModal";

export default function GuestTabsScreen() {

  const dispatch = useDispatch();
  const { sessionId, tableId } = useParams();

  const { tabs, loading } =
    useSelector(s => s.guestTabs);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGuestTabs(sessionId));
  }, [sessionId]);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            Table {tableId}
          </h1>
          <p className="text-gray-500">
            Manage Guests & Bills
          </p>
        </div>

        <button
          onClick={()=>setOpen(true)}
          className="
            px-5 py-2 rounded-xl
            bg-gradient-to-r
            from-blue-600 to-indigo-600
            text-white shadow-lg
          "
        >
          + Add Guest
        </button>
      </div>

      {/* GUEST GRID */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="
          grid gap-5
          sm:grid-cols-2
          lg:grid-cols-3
        ">
          {tabs.map(tab => (
            <GuestTabCard key={tab._id} tab={tab}/>
          ))}
        </div>
      )}

      <CreateGuestModal
        open={open}
        setOpen={setOpen}
        sessionId={sessionId}
        tableId={tableId}
      />
    </div>
  );
}
