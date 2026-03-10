// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { createFranchise, updateFranchise } from "../franchiseSlice";
// import { X } from "lucide-react";

// import PremiumInput from "../../../components/ui/PremiumInput";
// import PremiumButton from "../../../components/ui/PremiumButton";

// export default function CreateFranchiseModal({ open, setOpen, editData, onSuccess }) {
//   const dispatch = useDispatch();

//   const [form, setForm] = useState({
//     name: "",
//     ownerName: "",
//     email: "",
//     password: "",
//     phone: "",
//     city: "",
//     state: "",
//     address: "",
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (editData) {
//       // Don't include password when editing
//       const { password, ...rest } = editData;
//       setForm(rest);
//     } else {
//       setForm({
//         name: "",
//         ownerName: "",
//         email: "",
//         password: "",
//         phone: "",
//         city: "",
//         state: "",
//         address: "",
//       });
//     }
//   }, [editData]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (editData) {
//         await dispatch(
//           updateFranchise({
//             id: editData._id,
//             payload: form,
//           })
//         ).unwrap();
//       } else {
//         await dispatch(createFranchise(form)).unwrap();
//       }
      
//       setOpen(false);
//       if (onSuccess) onSuccess();
//     } catch (error) {
//       console.error("Failed to save franchise:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* OVERLAY */}
//       <div
//         onClick={() => !loading && setOpen(false)}
//         className={`
//           fixed inset-0 bg-black/40 backdrop-blur-sm z-40
//           transition-opacity duration-300
//           ${open ? "opacity-100 visible" : "opacity-0 invisible"}
//         `}
//       />

//       {/* MODAL WRAPPER */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
//         {/* ================= DESKTOP MODAL ================= */}
//         <div
//           className={`
//             hidden lg:flex flex-col
//             bg-white w-[520px] max-h-[90vh]
//             rounded-2xl shadow-2xl
//             transform transition-all duration-300
//             pointer-events-auto
//             ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
//           `}
//         >
//           <ModalContent
//             form={form}
//             handleChange={handleChange}
//             handleSubmit={handleSubmit}
//             setOpen={setOpen}
//             editData={editData}
//             loading={loading}
//           />
//         </div>

//         {/* ================= MOBILE DRAWER ================= */}
//         <div
//           className={`
//             lg:hidden fixed right-0 top-0 h-full w-full sm:w-[420px]
//             bg-white shadow-xl
//             transform transition-transform duration-300
//             pointer-events-auto flex flex-col
//             ${open ? "translate-x-0" : "translate-x-full"}
//           `}
//         >
//           <ModalContent
//             form={form}
//             handleChange={handleChange}
//             handleSubmit={handleSubmit}
//             setOpen={setOpen}
//             editData={editData}
//             loading={loading}
//           />
//         </div>
//       </div>
//     </>
//   );
// }

// /* ====================================================== */
// /* ================= MODAL CONTENT ====================== */
// /* ====================================================== */

// function ModalContent({ form, handleChange, handleSubmit, setOpen, editData, loading }) {
//   const fields = [
//     { label: "Franchise Name", name: "name", required: true },
//     { label: "Owner Name", name: "ownerName", required: true },
//     { label: "Email", name: "email", type: "email", required: true },
//     { label: "Password", name: "password", type: "password", required: !editData },
//     { label: "Phone", name: "phone", required: true },
//     { label: "City", name: "city", required: true },
//     { label: "State", name: "state", required: true },
//   ];

//   return (
//     <>
//       {/* ===== STICKY HEADER ===== */}
//       <div className="
//         sticky top-0 z-10
//         flex justify-between items-center
//         p-5 border-b bg-white
//       ">
//         <h2 className="text-lg font-semibold">
//           {editData ? "Edit Franchise" : "Create Franchise"}
//         </h2>

//         <button
//           onClick={() => !loading && setOpen(false)}
//           disabled={loading}
//           className="
//             p-2 rounded-lg
//             hover:bg-gray-100
//             transition
//             disabled:opacity-50 disabled:cursor-not-allowed
//           "
//         >
//           <X size={20} />
//         </button>
//       </div>

//       {/* ===== FORM AREA ===== */}
//       <form
//         onSubmit={handleSubmit}
//         className="p-5 space-y-5 overflow-y-auto max-h-[80vh]"
//       >
//         {fields.map((field) => (
//           <PremiumInput
//             key={field.name}
//             label={field.label}
//             name={field.name}
//             type={field.type || "text"}
//             value={form[field.name] || ""}
//             onChange={handleChange}
//             required={field.required}
//             disabled={loading}
//           />
//         ))}

//         {/* ADDRESS */}
//         <div className="space-y-2">
//           <label className="text-sm text-gray-600">
//             Address <span className="text-red-500">*</span>
//           </label>

//           <textarea
//             name="address"
//             value={form.address || ""}
//             onChange={handleChange}
//             required
//             disabled={loading}
//             rows={3}
//             className="
//               w-full rounded-xl border border-gray-300
//               p-3 outline-none resize-none
//               transition-all duration-300
//               focus:ring-4 focus:ring-[#F59E0B]/20
//               focus:border-[#F59E0B]
//               disabled:bg-gray-50 disabled:cursor-not-allowed
//             "
//           />
//         </div>

//         <PremiumButton type="submit" disabled={loading}>
//           {loading ? (
//             <div className="flex items-center justify-center gap-2">
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               <span>{editData ? "Updating..." : "Creating..."}</span>
//             </div>
//           ) : (
//             <span>{editData ? "Update Franchise" : "Create Franchise"}</span>
//           )}
//         </PremiumButton>
//       </form>
//     </>
//   );
// }



import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createFranchise, updateFranchise } from "../franchiseSlice";
import { X } from "lucide-react";

import PremiumInput from "../../../components/ui/PremiumInput";
import PremiumButton from "../../../components/ui/PremiumButton";

export default function CreateFranchiseModal({ open, setOpen, editData, onSuccess }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    state: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or editData changes
  useEffect(() => {
    if (open) {
      if (editData) {
        // For edit: populate with editData (don't include password)
        const { password, ...rest } = editData;
        setForm({
          ...rest,
          password: "", // Always set password empty for edit
        });
        console.log("Editing franchise with data:", rest); // Debug log
      } else {
        // For create: reset to empty
        setForm({
          name: "",
          ownerName: "",
          email: "",
          password: "",
          phone: "",
          city: "",
          state: "",
          address: "",
        });
      }
    }
  }, [open, editData]);

  // Additional effect to reset form when modal closes
  useEffect(() => {
    if (!open) {
      // Small delay to avoid flicker
      setTimeout(() => {
        setForm({
          name: "",
          ownerName: "",
          email: "",
          password: "",
          phone: "",
          city: "",
          state: "",
          address: "",
        });
      }, 300);
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        // For update, don't send password if it's empty
        const payload = { ...form };
        if (!payload.password) {
          delete payload.password;
        }
        
        console.log("Updating franchise with payload:", payload); // Debug log
        
        await dispatch(
          updateFranchise({
            id: editData._id,
            payload,
          })
        ).unwrap();
      } else {
        console.log("Creating franchise with data:", form); // Debug log
        await dispatch(createFranchise(form)).unwrap();
      }
      
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to save franchise:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => !loading && setOpen(false)}
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* MODAL WRAPPER */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        {/* ================= DESKTOP MODAL ================= */}
        <div
          className={`
            hidden lg:flex flex-col
            bg-white w-[520px] max-h-[90vh]
            rounded-2xl shadow-2xl
            transform transition-all duration-300
            pointer-events-auto
            ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          `}
        >
          <ModalContent
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setOpen={setOpen}
            editData={editData}
            loading={loading}
          />
        </div>

        {/* ================= MOBILE DRAWER ================= */}
        <div
          className={`
            lg:hidden fixed right-0 top-0 h-full w-full sm:w-[420px]
            bg-white shadow-xl
            transform transition-transform duration-300
            pointer-events-auto flex flex-col
            ${open ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <ModalContent
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setOpen={setOpen}
            editData={editData}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}

/* ====================================================== */
/* ================= MODAL CONTENT ====================== */
/* ====================================================== */

function ModalContent({ form, handleChange, handleSubmit, setOpen, editData, loading }) {
  const fields = [
    { label: "Franchise Name", name: "name", type: "text", required: true },
    { label: "Owner Name", name: "ownerName", type: "text", required: true },
    { label: "Email", name: "email", type: "email", required: true },
    { 
      label: "Password", 
      name: "password", 
      type: "password", 
      required: !editData,
      placeholder: editData ? "Leave blank to keep current" : "Enter password"
    },
    { label: "Phone", name: "phone", type: "text", required: true },
    { label: "City", name: "city", type: "text", required: true },
    { label: "State", name: "state", type: "text", required: true },
  ];

  return (
    <>
      {/* ===== STICKY HEADER ===== */}
      <div className="
        sticky top-0 z-10
        flex justify-between items-center
        p-5 border-b bg-white
      ">
        <h2 className="text-lg font-semibold">
          {editData ? "Edit Franchise" : "Create New Franchise"}
        </h2>

        <button
          type="button"
          onClick={() => !loading && setOpen(false)}
          disabled={loading}
          className="
            p-2 rounded-lg
            hover:bg-gray-100
            transition
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <X size={20} />
        </button>
      </div>

      {/* ===== FORM AREA ===== */}
      <form
        onSubmit={handleSubmit}
        className="p-5 space-y-5 overflow-y-auto max-h-[80vh]"
      >
        {fields.map((field) => (
          <PremiumInput
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            value={form[field.name] || ""}
            onChange={handleChange}
            required={field.required}
            disabled={loading}
            placeholder={field.placeholder || ""}
          />
        ))}

        {/* ADDRESS */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            Address <span className="text-red-500">*</span>
          </label>

          <textarea
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            required
            disabled={loading}
            rows={3}
            className="
              w-full rounded-xl border border-gray-300
              p-3 outline-none resize-none
              transition-all duration-300
              focus:ring-4 focus:ring-[#F59E0B]/20
              focus:border-[#F59E0B]
              disabled:bg-gray-50 disabled:cursor-not-allowed
            "
          />
        </div>

        <PremiumButton type="submit" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{editData ? "Updating..." : "Creating..."}</span>
            </div>
          ) : (
            <span>{editData ? "Update Franchise" : "Create Franchise"}</span>
          )}
        </PremiumButton>
      </form>
    </>
  );
}