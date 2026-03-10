import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTable, updateTable } from "../tableSlice";
import { X } from "lucide-react";

export default function CreateTableModal({ open, setOpen, editData }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    tableNumber: "",
    capacity: 4,
  });

  /* ================= PREFILL EDIT ================= */
  useEffect(() => {
    if (editData) {
      setForm({
        tableNumber: editData.tableNumber,
        capacity: editData.capacity,
      });
    } else {
      setForm({ tableNumber: "", capacity: 4 });
    }
  }, [editData, open]);

  if (!open) return null;

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    if (editData) {
      await dispatch(
        updateTable({
          id: editData._id,
          payload: form,
        })
      );
    } else {
      await dispatch(createTable(form));
    }

    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

      {/* ===== PREMIUM OVERLAY ===== */}
      <div
        onClick={() => setOpen(false)}
        className="
          absolute inset-0
          bg-black/50 backdrop-blur-md
          animate-in fade-in duration-300
        "
      />

      {/* ===== MODAL ===== */}
      <form
        onSubmit={submit}
        className="
          relative w-full max-w-md
          rounded-2xl
          bg-white/80 backdrop-blur-xl
          border border-white/30
          shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)]
          overflow-hidden
          animate-in zoom-in fade-in duration-300
        "
      >
        {/* TOP GRADIENT BAR */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editData ? "Edit Table" : "Create Table"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Manage restaurant seating configuration
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 space-y-5 pb-6">

          {/* TABLE NUMBER */}
          <FloatingInput
            label="Table Number"
            value={form.tableNumber}
            onChange={(v) =>
              setForm({ ...form, tableNumber: v })
            }
          />

          {/* CAPACITY */}
          <FloatingInput
            label="Capacity"
            type="number"
            value={form.capacity}
            onChange={(v) =>
              setForm({ ...form, capacity: v })
            }
          />

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="
                px-4 py-2 rounded-xl
                bg-gray-100 hover:bg-gray-200
                text-gray-700 font-medium
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-5 py-2 rounded-xl
                text-white font-medium
                bg-gradient-to-r from-indigo-600 to-blue-600
                hover:from-indigo-700 hover:to-blue-700
                shadow-lg shadow-blue-200
                transition-all hover:scale-[1.03]
              "
            >
              {editData ? "Update Table" : "Create Table"}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}

/* ===================================================== */
/* ================= FLOATING INPUT ==================== */
/* ===================================================== */

function FloatingInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
        className="
          peer w-full px-4 pt-5 pb-2
          rounded-xl border border-gray-200
          bg-white/70
          focus:outline-none
          focus:border-indigo-500
          focus:ring-4 focus:ring-indigo-500/10
          transition
        "
      />

      <label
        className="
          absolute left-4
          text-gray-500 text-sm
          transition-all
          peer-placeholder-shown:top-3.5
          peer-placeholder-shown:text-base
          peer-focus:top-1.5
          peer-focus:text-xs
          top-1.5 text-xs
        "
      >
        {label}
      </label>
    </div>
  );
}
