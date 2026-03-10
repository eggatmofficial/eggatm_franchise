import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGuestTab } from "../guestTabSlice";

export default function CreateGuestModal({
  open,
  setOpen,
  sessionId,
  tableId
}) {

  const dispatch = useDispatch();

  const [form,setForm]=useState({
    guestName:"",
    personCount:1
  });

  if(!open) return null;

  const submit = async(e)=>{
    e.preventDefault();

    await dispatch(createGuestTab({
      ...form,
      sessionId,
      tableId
    }));

    setOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl w-80 space-y-4"
      >
        <h2 className="font-semibold text-lg">
          Add Guest
        </h2>

        <input
          placeholder="Guest Name"
          required
          className="w-full border p-2 rounded"
          onChange={(e)=>
            setForm({...form,guestName:e.target.value})
          }
        />

        <input
          type="number"
          min="1"
          value={form.personCount}
          className="w-full border p-2 rounded"
          onChange={(e)=>
            setForm({...form,personCount:e.target.value})
          }
        />

        <div className="flex justify-end gap-2">
          <button type="button"
            onClick={()=>setOpen(false)}>
            Cancel
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
