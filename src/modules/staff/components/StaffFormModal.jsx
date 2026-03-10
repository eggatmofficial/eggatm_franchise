import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createStaff, updateStaff } from "../staffSlice";

export default function StaffFormModal({ open, setOpen, editData = null }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Effect to populate form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        email: editData.email || "",
        password: "", // Password field empty for security (user can set new password if needed)
      });
    } else {
      // Reset form when adding new
      setForm({
        name: "",
        email: "",
        password: "",
      });
    }
  }, [editData, open]); // Re-run when editData or open changes

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editData) {
        // Update existing staff
        await dispatch(updateStaff({ 
          id: editData._id, 
          payload: form 
        }));
      } else {
        // Create new staff
        await dispatch(createStaff(form));
      }
      
      setOpen(false);
      // Form will reset via useEffect when modal closes
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* OVERLAY */}
      <div
        onClick={() => !isSubmitting && setOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
      />

      {/* MODAL */}
      <div className="
        relative bg-gradient-to-br from-gray-900 to-gray-800 w-full max-w-md
        rounded-2xl shadow-2xl p-8
        animate-in fade-in zoom-in duration-300
        border border-gray-700
      ">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-t-2xl" />

        {/* Header - Dynamic title based on mode */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {editData ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            {editData ? 'Update staff account information' : 'Create a new staff account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Full Name
            </label>
            <input
              name="name"
              placeholder="e.g., John Doe"
              value={form.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl 
                       text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="e.g., john@company.com"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl 
                       text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Input - Required only for create, optional for edit */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Password {!editData && <span className="text-red-400">*</span>}
            </label>
            <input
              name="password"
              type="password"
              placeholder={editData ? "Leave blank to keep current" : "••••••••"}
              value={form.password}
              onChange={handleChange}
              required={!editData} // Only required for create
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl 
                       text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {editData && (
              <p className="text-xs text-gray-400 mt-1">
                Leave empty to keep current password
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-gray-200 
                       bg-gray-700 hover:bg-gray-600 
                       rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white 
                       bg-gradient-to-r from-blue-500 to-blue-600 
                       hover:from-blue-600 hover:to-blue-700 
                       rounded-xl shadow-lg shadow-blue-500/30 
                       hover:shadow-xl hover:shadow-blue-500/40 
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed 
                       flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{editData ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                editData ? 'Update Account' : 'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Footer note - Dynamic based on mode */}
        {!editData && (
          <p className="text-xs text-gray-400 text-center mt-6">
            New staff members will receive a welcome email
          </p>
        )}
      </div>
    </div>
  );
}