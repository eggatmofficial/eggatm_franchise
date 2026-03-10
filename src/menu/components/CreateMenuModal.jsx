// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { createMenu, updateMenu } from "../menuSlice";


// export default function CreateMenuModal({
//   open,
//   setOpen,
//   editData,
// }) {

//   const dispatch = useDispatch();

//   const [form, setForm] = useState({
//     name: "",
//     category: "",
//     price: "",
//     image: null,
//     isAvailable: true,
//     costPrice:""
//   });

//   const [preview, setPreview] = useState(null);
 


//   /* ================= EDIT MODE ================= */
//   useEffect(() => {
//     if (editData) {
//       setForm({
//         name: editData.name || "",
//         category: editData.category || "",
//         price: editData.price || "",
//         image: null, // IMPORTANT
//         isAvailable: editData.isAvailable,
//         costPrice:editData.costPrice || ""
//       });

//       setPreview(editData.image || null);
//     } else {
//       resetForm();
//     }
//   }, [editData, open]);

//   const resetForm = () => {
//     setForm({
//       name: "",
//       category: "",
//       price: "",
//       image: null,
//       costPrice:"",
//       isAvailable: true,
//     });
//     setPreview(null);
//   };

//   if (!open) return null;

//   /* ================= IMAGE PREVIEW ================= */
//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setForm((prev) => ({ ...prev, image: file }));
//     setPreview(URL.createObjectURL(file));
//   };

//   /* ================= SUBMIT ================= */
// const submit = async (e) => {
//   e.preventDefault();

//   if (!form.price) {
//     alert("Enter valid price");
//     return;
//   }

//   if (editData) {
//     await dispatch(
//       updateMenu({
//         id: editData._id,
//         payload: form,
//       })
//     );
//   } else {
//     await dispatch(createMenu(form));
//   }
//    resetForm(); 
//   setOpen(false);
// };



//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center">

//       {/* BACKDROP */}
//       <div
//         onClick={() => setOpen(false)}
//         className="absolute inset-0 bg-black/40 backdrop-blur-md"
//       />

//       {/* MODAL */}
//       <form
//         onSubmit={submit}
//         className="
//           relative w-[94%] max-w-md
//           bg-white rounded-2xl
//           shadow-2xl p-6 space-y-5
//           animate-[scaleIn_.25s_ease]
//         "
//       >
//         <h2 className="text-xl font-semibold">
//           {editData ? "Edit Menu Item" : "Add Menu Item"}
//         </h2>

//         {/* NAME */}
//         <div className="relative">
//           <input
//             placeholder=" "
//             required
//             value={form.name}
//             onChange={(e)=>
//               setForm({ ...form, name: e.target.value })
//             }
//             className="peer w-full border rounded-xl px-4 pt-5 pb-2 outline-none focus:border-blue-500"
//           />
//           <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all
//             peer-placeholder-shown:top-3.5
//             peer-placeholder-shown:text-sm
//             peer-focus:top-2 peer-focus:text-xs">
//             Item Name
//           </label>
//         </div>

//        {/* CATEGORY INPUT */}
// <div className="relative">
//   <input
//     placeholder=" "
//     required
//     value={form.category}
//     onChange={(e) =>
//       setForm({ ...form, category: e.target.value })
//     }
//     className="
//       peer w-full border rounded-xl
//       px-4 pt-5 pb-2 outline-none
//       focus:border-blue-500
//     "
//   />



//   <label
//     className="
//       absolute left-4 top-2 text-xs text-gray-500
//       transition-all
//       peer-placeholder-shown:top-3.5
//       peer-placeholder-shown:text-sm
//       peer-focus:top-2
//       peer-focus:text-xs
//     "
//   >
//     Category
//   </label>
// </div>


//         {/* PRICE */}
//         <div className="relative">
//           <span className="absolute left-3 top-3 text-gray-500">₹</span>

//           <input
//             type="number"
//             required
//             value={form.price}
//             onChange={(e)=>
//               setForm({ ...form, price: e.target.value })
//             }
//             className="w-full pl-8 border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
//             placeholder="Price"
//           />
//         </div>

//             <input
//             type="number"
//             placeholder="Cost Price (Owner purchase price)"
//             value={form.costPrice}
//             onChange={(e)=>
//                 setForm({
//                 ...form,
//                 costPrice: e.target.value
//                 })
//             }
//             className="w-full pl-8 border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
//             />


//         {/* IMAGE */}
//         <div>
//           <p className="text-sm text-gray-500 mb-2">Upload Image</p>

//           <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-32 cursor-pointer hover:bg-gray-50 overflow-hidden">
//             {preview ? (
//               <img
//                 src={preview}
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               <span className="text-gray-400">
//                 Click to upload
//               </span>
//             )}

//             <input
//               type="file"
//               hidden
//               accept="image/*"
//               onChange={handleImage}
//             />
//           </label>
//         </div>

//         {/* SWITCH */}
//         <div className="flex justify-between items-center">
//           <span className="text-sm">Available</span>

//           <button
//             type="button"
//             onClick={() =>
//               setForm({
//                 ...form,
//                 isAvailable: !form.isAvailable,
//               })
//             }
//             className={`w-12 h-6 flex items-center rounded-full p-1 transition
//               ${form.isAvailable ? "bg-green-500" : "bg-gray-300"}`}
//           >
//             <div
//               className={`bg-white w-4 h-4 rounded-full shadow transform transition
//                 ${form.isAvailable ? "translate-x-6" : ""}`}
//             />
//           </button>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex justify-end gap-3 pt-2">
//           <button
//             type="button"
//             onClick={()=>setOpen(false)}
//             className="px-4 py-2 bg-gray-100 rounded-lg"
//           >
//             Cancel
//           </button>

//           <button className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:scale-[1.03] transition">
//             Save
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createMenu, updateMenu } from "../menuSlice";
import {
  X,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Package,
  CheckCircle,
  AlertCircle,
  Coffee,
  Beef,
  Pizza,
  Sandwich,
  Soup,
  Wine,
  CupSoda,
  IceCream,
  Utensils,
  Sparkles,
  Trash2,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

export default function CreateMenuModal({
  open,
  setOpen,
  editData,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: null,
    isAvailable: true,
    costPrice: ""
  });

  const [preview, setPreview] = useState(null);
  const [showCostPrice, setShowCostPrice] = useState(false);

  // Predefined categories for suggestions
  const suggestedCategories = [
    "Appetizer", "Main Course", "Dessert", "Beverage", 
    "Soup", "Salad", "Fast Food", "Seafood", "Vegetarian", 
    "Vegan", "Breakfast", "Lunch Special"
  ];

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        category: editData.category || "",
        price: editData.price || "",
        image: null,
        isAvailable: editData.isAvailable ?? true,
        costPrice: editData.costPrice || ""
      });
      setPreview(editData.image || null);
    } else {
      resetForm();
    }
  }, [editData, open]);

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      image: null,
      costPrice: "",
      isAvailable: true,
    });
    setPreview(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  if (!open) return null;

  /* ================= IMAGE PREVIEW ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image size should be less than 5MB" });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, image: "Please upload a valid image file" });
      return;
    }

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
    setErrors({ ...errors, image: null });
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setPreview(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Item name is required";
    }

    // if (!form.category.trim()) {
    //   newErrors.category = "Category is required";
    // }

    if (!form.price) {
      newErrors.price = "Price is required";
    } else if (form.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (form.costPrice && form.costPrice < 0) {
      newErrors.costPrice = "Cost price cannot be negative";
    }

    if (form.costPrice && form.price && Number(form.costPrice) > Number(form.price)) {
      newErrors.costPrice = "Cost price cannot be greater than selling price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (editData) {
        await dispatch(
          updateMenu({
            id: editData._id,
            payload: form,
          })
        );
      } else {
        await dispatch(createMenu(form));
      }
      handleClose();
    } catch (error) {
      console.error("Failed to save menu item:", error);
      setErrors({ ...errors, submit: "Failed to save. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      
      {/* BACKDROP with blur */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* MODAL - Fixed height with flex column layout */}
      <div
        className="
          relative w-full max-w-lg
          bg-white rounded-2xl
          shadow-2xl 
          animate-[fadeInUp_0.3s_ease-out]
          flex flex-col
          max-h-[90vh]
        "
      >
        {/* Fixed Header - No scroll */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                {editData ? <Package className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <h2 className="text-xl font-semibold">
                {editData ? "Edit Menu Item" : "Create New Menu Item"}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-blue-100 mt-2 ml-11">
            {editData ? "Update item details below" : "Fill in the details to add a new item"}
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={submit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            
            {/* NAME FIELD */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                Item Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  placeholder="e.g., Grilled Chicken Sandwich"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`
                    w-full px-4 py-3 rounded-xl border
                    focus:outline-none focus:ring-2 transition-all
                    ${errors.name 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-slate-200 focus:ring-blue-200 focus:border-blue-500'
                    }
                  `}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* CATEGORY FIELD with suggestions */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-blue-500" />
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  placeholder="e.g., Main Course"
                  value={form.category}
                  onChange={(e) => {
                    setForm({ ...form, category: e.target.value });
                    if (errors.category) setErrors({ ...errors, category: null });
                  }}
                  list="category-suggestions"
                  className={`
                    w-full px-4 py-3 rounded-xl border
                    focus:outline-none focus:ring-2 transition-all
                    ${errors.category 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-slate-200 focus:ring-blue-200 focus:border-blue-500'
                    }
                  `}
                />
                <datalist id="category-suggestions">
                  {suggestedCategories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              {errors.category && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* PRICE AND COST PRICE GRID */}
            <div className="grid grid-cols-2 gap-4">
              {/* SELLING PRICE */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => {
                      setForm({ ...form, price: e.target.value });
                      if (errors.price) setErrors({ ...errors, price: null });
                    }}
                    className={`
                      w-full pl-8 pr-4 py-3 rounded-xl border
                      focus:outline-none focus:ring-2 transition-all
                      ${errors.price 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-slate-200 focus:ring-blue-200 focus:border-blue-500'
                      }
                    `}
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* COST PRICE (Optional) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-500" />
                    Cost Price
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCostPrice(!showCostPrice)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    {showCostPrice ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showCostPrice && (
                  <>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={form.costPrice}
                        onChange={(e) => {
                          setForm({ ...form, costPrice: e.target.value });
                          if (errors.costPrice) setErrors({ ...errors, costPrice: null });
                        }}
                        className={`
                          w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200
                          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                          transition-all
                        `}
                      />
                    </div>
                    {errors.costPrice && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.costPrice}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                Item Image
              </label>
              
              {!preview ? (
                <label className="
                  flex flex-col items-center justify-center
                  border-2 border-dashed border-slate-200
                  rounded-xl h-40
                  cursor-pointer
                  hover:border-blue-400 hover:bg-blue-50/50
                  transition-all group
                ">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
                    <p className="text-sm text-slate-500 group-hover:text-blue-600">
                      Click to upload image
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="p-2 bg-white rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <Upload className="w-4 h-4 text-slate-700" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImage}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              )}
              {errors.image && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.image}
                </p>
              )}
            </div>

            {/* AVAILABILITY TOGGLE */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                {form.isAvailable ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-slate-400" />
                )}
                <div>
                  <p className="font-medium text-slate-700">
                    {form.isAvailable ? "Available" : "Unavailable"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {form.isAvailable 
                      ? "Item will be visible in menu" 
                      : "Item will be hidden from customers"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })}
                className={`
                  relative w-14 h-8 rounded-full transition-colors
                  ${form.isAvailable ? 'bg-green-500' : 'bg-slate-300'}
                `}
              >
                <div
                  className={`
                    absolute top-1 w-6 h-6 bg-white rounded-full shadow
                    transition-transform duration-200
                    ${form.isAvailable ? 'right-1' : 'left-1'}
                  `}
                />
              </button>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 rounded-lg flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </div>
            )}
          </div>
        </form>

        {/* Fixed Footer - No scroll */}
        <div className="bg-slate-50 rounded-b-2xl p-4 border-t border-slate-200 flex-shrink-0">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={submit}
              disabled={loading}
              className="
                min-w-[100px] px-5 py-2.5
                bg-gradient-to-r from-blue-600 to-indigo-600
                text-white font-medium rounded-xl
                shadow-lg shadow-blue-200
                hover:shadow-xl hover:scale-[1.02]
                transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Item'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}