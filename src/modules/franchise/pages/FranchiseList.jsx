// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchFranchises, toggleFranchiseStatus, deleteFranchise } from "../franchiseSlice";
// import CreateFranchiseModal from "../components/CreateFranchiseModal";
// import { 
//   Pencil, 
//   Trash2, 
//   Search, 
//   ArrowUpDown,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   MoreVertical,
//   Power,
//   PowerOff
// } from "lucide-react";

// export default function FranchiseList() {
//   const dispatch = useDispatch();
//   const { franchises, loading } = useSelector((state) => state.franchise);

//   const [openForm, setOpenForm] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [search, setSearch] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "asc",
//   });
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "inactive"
//   const [togglingId, setTogglingId] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);

//   useEffect(() => {
//     dispatch(fetchFranchises());
//   }, [dispatch]);

//   const handleSort = (key) => {
//     setSortConfig((prev) => ({
//       key,
//       direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//  const handleToggleStatus = async (id, currentStatus) => {
//   try {
//     setTogglingId(id);

//     await dispatch(
//       toggleFranchiseStatus({
//         id,
//         isActive: !currentStatus, 
//       })
//     ).unwrap();

//   } catch (error) {
//     console.error("Failed to toggle status:", error);
//   } finally {
//     setTogglingId(null);
//   }
// };


//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this franchise?")) {
//       try {
//         setDeletingId(id);
//         await dispatch(deleteFranchise(id)).unwrap();
//       } catch (error) {
//         console.error("Failed to delete franchise:", error);
//       } finally {
//         setDeletingId(null);
//       }
//     }
//   };

//   const handleEdit = (franchise) => {
//     setEditData(franchise);
//     setOpenForm(true);
//   };

//   const processedData = useMemo(() => {
//     let data = [...franchises];

//     // Search filter
//     if (search) {
//       data = data.filter(
//         (f) =>
//           f.name?.toLowerCase().includes(search.toLowerCase()) ||
//           f.franchiseCode?.toLowerCase().includes(search.toLowerCase()) ||
//           f.city?.toLowerCase().includes(search.toLowerCase()) ||
//           f.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
//           f.email?.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     // Status filter
//     if (statusFilter !== "all") {
//       data = data.filter((f) => 
//         statusFilter === "active" ? f.isActive : !f.isActive
//       );
//     }

//     // Sort
//     if (sortConfig.key) {
//       data.sort((a, b) => {
//         let aVal = a[sortConfig.key];
//         let bVal = b[sortConfig.key];
        
//         // Handle boolean values (isActive)
//         if (typeof aVal === "boolean") {
//           aVal = aVal ? 1 : 0;
//           bVal = bVal ? 1 : 0;
//         }
        
//         if (sortConfig.direction === "asc") {
//           return aVal > bVal ? 1 : -1;
//         } else {
//           return aVal < bVal ? 1 : -1;
//         }
//       });
//     }

//     return data;
//   }, [franchises, search, sortConfig, statusFilter]);

//   const totalPages = Math.ceil(processedData.length / pageSize);
//   const paginatedData = processedData.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   const columns = [
//     { label: "Code", key: "franchiseCode" },
//     { label: "Name", key: "name" },
//     { label: "Owner", key: "ownerName" },
//     // { label: "Email", key: "email" },
//     { label: "City", key: "city" },
//     { label: "Status", key: "isActive" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
        
//         {/* Header Section */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//               Franchise Management
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Manage and monitor all your franchise locations
//             </p>
//           </div>

//           <div className="flex gap-3 w-full lg:w-auto">
//             {/* Search Bar */}
//             <div className="relative flex-1 lg:flex-none lg:w-80">
//               <Search 
//                 size={18} 
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
//               />
//               <input
//                 placeholder="Search franchises..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="
//                   w-full pl-10 pr-4 py-2.5
//                   bg-white/80 backdrop-blur-sm
//                   border border-gray-200 rounded-xl
//                   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
//                   outline-none transition-all
//                   placeholder:text-gray-400
//                 "
//               />
//             </div>

//             {/* Add Button */}
//             <button
//               onClick={() => {
//                 setEditData(null);
//                 setOpenForm(true);
//               }}
//               className="
//                 bg-gradient-to-r from-blue-600 to-blue-700
//                 hover:from-blue-700 hover:to-blue-800
//                 text-white px-5 py-2.5 rounded-xl
//                 flex items-center gap-2 shadow-lg shadow-blue-200
//                 transition-all hover:scale-[1.02]
//               "
//             >
//               <Plus size={18} />
//               <span className="hidden sm:inline">Add Franchise</span>
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-2">
//           <button
//             onClick={() => setStatusFilter("all")}
//             className={`
//               px-4 py-2 rounded-lg text-sm font-medium transition-all
//               ${statusFilter === "all" 
//                 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
//                 : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
//               }
//             `}
//           >
//             All
//           </button>
//           <button
//             onClick={() => setStatusFilter("active")}
//             className={`
//               px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
//               ${statusFilter === "active" 
//                 ? "bg-green-600 text-white shadow-lg shadow-green-200" 
//                 : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
//               }
//             `}
//           >
//             <span className={`w-2 h-2 rounded-full ${statusFilter === "active" ? "bg-white" : "bg-green-500"}`} />
//             Active
//           </button>
//           <button
//             onClick={() => setStatusFilter("inactive")}
//             className={`
//               px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
//               ${statusFilter === "inactive" 
//                 ? "bg-red-600 text-white shadow-lg shadow-red-200" 
//                 : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
//               }
//             `}
//           >
//             <span className={`w-2 h-2 rounded-full ${statusFilter === "inactive" ? "bg-white" : "bg-red-500"}`} />
//             Inactive
//           </button>
//         </div>

//         {/* Table Card */}
//         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-50/80 border-b border-gray-200">
//                   {columns.map((col) => (
//                     <th
//                       key={col.key}
//                       onClick={() => handleSort(col.key)}
//                       className={`
//                         p-4 text-left font-medium text-gray-600
//                         cursor-pointer hover:bg-gray-100/80
//                         transition-colors
//                       `}
//                     >
//                       <div className="flex items-center gap-2">
//                         {col.label}
//                         <ArrowUpDown size={14} className="text-gray-400" />
//                       </div>
//                     </th>
//                   ))}
//                   <th className="p-4 text-right font-medium text-gray-600">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={7} className="p-12">
//                       <div className="flex flex-col items-center justify-center text-gray-500">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
//                         <p>Loading franchises...</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : paginatedData.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="p-12">
//                       <div className="text-center text-gray-500">
//                         <p className="text-lg font-medium">No franchises found</p>
//                         <p className="text-sm mt-1">Try adjusting your search or filters</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedData.map((f) => (
//                     <tr
//                       key={f._id}
//                       className="
//                         border-b border-gray-100 hover:bg-gradient-to-r 
//                         hover:from-blue-50/50 hover:to-indigo-50/50 
//                         transition-all group
//                       "
//                     >
//                       <td className="p-4">
//                         <span className="font-mono text-xs font-medium bg-gray-100 px-2 py-1 rounded">
//                           {f.franchiseCode}
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <p className="font-medium text-gray-800">{f.name}</p>
//                       </td>
//                       <td className="p-4 text-gray-600">{f.ownerName}</td>
//                       {/* <td className="p-4 text-gray-600">{f.email}</td> */}
//                       <td className="p-4 text-gray-600">{f.city}</td>
//                       <td className="p-4">
//                         <span
//                           className={`
//                             inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                             ${f.isActive
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-red-100 text-red-800'
//                             }
//                           `}
//                         >
//                           <span className={`w-1.5 h-1.5 rounded-full mr-1.5
//                             ${f.isActive ? 'bg-green-500' : 'bg-red-500'}
//                           `} />
//                           {f.isActive ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="p-4 text-right">
//                         <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
//                           {/* Status Toggle Button */}
//                           <button
//                             onClick={() => handleToggleStatus(f._id, f.isActive)}
//                             disabled={togglingId === f._id}
//                             className={`
//                               p-2 rounded-lg transition-all relative
//                               ${f.isActive 
//                                 ? 'hover:bg-red-100 text-red-600' 
//                                 : 'hover:bg-green-100 text-green-600'
//                               }
//                               ${togglingId === f._id ? 'opacity-50 cursor-not-allowed' : ''}
//                             `}
//                             title={f.isActive ? 'Deactivate' : 'Activate'}
//                           >
//                             {togglingId === f._id ? (
//                               <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//                             ) : f.isActive ? (
//                               <PowerOff size={16} />
//                             ) : (
//                               <Power size={16} />
//                             )}
//                           </button>

//                           {/* Edit Button */}
//                           <button
//                             onClick={() => handleEdit(f)}
//                             className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
//                             title="Edit"
//                           >
//                             <Pencil size={16} />
//                           </button>

//                           {/* Delete Button */}
//                           <button
//                             onClick={() => handleDelete(f._id)}
//                             disabled={deletingId === f._id}
//                             className={`
//                               p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors
//                               ${deletingId === f._id ? 'opacity-50 cursor-not-allowed' : ''}
//                             `}
//                             title="Delete"
//                           >
//                             {deletingId === f._id ? (
//                               <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
//                             ) : (
//                               <Trash2 size={16} />
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200 bg-gray-50/50">
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600">
//                 Showing {processedData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, processedData.length)} of {processedData.length} entries
//               </span>
              
//               {/* Page Size Selector */}
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="
//                   px-3 py-1.5 rounded-lg border border-gray-200
//                   text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
//                   outline-none bg-white cursor-pointer hover:bg-gray-50
//                 "
//               >
//                 <option value={10}>10 / page</option>
//                 <option value={25}>25 / page</option>
//                 <option value={50}>50 / page</option>
//                 <option value={100}>100 / page</option>
//               </select>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setPage(1)}
//                 disabled={page === 1}
//                 className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                 title="First page"
//               >
//                 <ChevronsLeft size={16} />
//               </button>
//               <button
//                 onClick={() => setPage(p => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                 title="Previous page"
//               >
//                 <ChevronLeft size={16} />
//               </button>
              
//               <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium">
//                 Page {page} of {totalPages || 1}
//               </span>

//               <button
//                 onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages || totalPages === 0}
//                 className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                 title="Next page"
//               >
//                 <ChevronRight size={16} />
//               </button>
//               <button
//                 onClick={() => setPage(totalPages)}
//                 disabled={page === totalPages || totalPages === 0}
//                 className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                 title="Last page"
//               >
//                 <ChevronsRight size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <CreateFranchiseModal
//         open={openForm}
//         setOpen={setOpenForm}
//         editData={editData}
//         onSuccess={() => {
//           dispatch(fetchFranchises());
//         }}
//       />
//     </div>
//   );
// }




import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFranchises, toggleFranchiseStatus, deleteFranchise } from "../franchiseSlice";
import CreateFranchiseModal from "../components/CreateFranchiseModal";
import { 
  Pencil, 
  Trash2, 
  Search, 
  ArrowUpDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Power,
  PowerOff
} from "lucide-react";

export default function FranchiseList() {
  const dispatch = useDispatch();
  const { franchises, loading } = useSelector((state) => state.franchise);

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchFranchises());
  }, [dispatch]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setTogglingId(id);
      await dispatch(
        toggleFranchiseStatus({
          id,
          isActive: !currentStatus, 
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this franchise?")) {
      try {
        setDeletingId(id);
        await dispatch(deleteFranchise(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete franchise:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (franchise) => {
    console.log("Editing franchise:", franchise); // Debug log
    setEditData(franchise);
    setOpenForm(true);
  };

  const processedData = useMemo(() => {
    let data = [...franchises];

    // Search filter
    if (search) {
      data = data.filter(
        (f) =>
          f.name?.toLowerCase().includes(search.toLowerCase()) ||
          f.franchiseCode?.toLowerCase().includes(search.toLowerCase()) ||
          f.city?.toLowerCase().includes(search.toLowerCase()) ||
          f.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
          (f.email && f.email.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      data = data.filter((f) => 
        statusFilter === "active" ? f.isActive : !f.isActive
      );
    }

    // Sort
    if (sortConfig.key) {
      data.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle boolean values (isActive)
        if (typeof aVal === "boolean") {
          aVal = aVal ? 1 : 0;
          bVal = bVal ? 1 : 0;
        }
        
        // Handle string values
        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        // Handle undefined/null
        if (aVal == null) aVal = "";
        if (bVal == null) bVal = "";
        
        if (sortConfig.direction === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return data;
  }, [franchises, search, sortConfig, statusFilter]);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Update columns to include email
  const columns = [
    { label: "Code", key: "franchiseCode" },
    { label: "Name", key: "name" },
    { label: "Owner", key: "ownerName" },
    { label: "Email", key: "email" },
    { label: "City", key: "city" },
    { label: "Status", key: "isActive" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Franchise Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor all your franchise locations
            </p>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 lg:flex-none lg:w-80">
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              />
              <input
                placeholder="Search franchises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2.5
                  bg-white/80 backdrop-blur-sm
                  border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  outline-none transition-all
                  placeholder:text-gray-400
                "
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                setEditData(null);
                setOpenForm(true);
              }}
              className="
                bg-gradient-to-r from-blue-600 to-blue-700
                hover:from-blue-700 hover:to-blue-800
                text-white px-5 py-2.5 rounded-xl
                flex items-center gap-2 shadow-lg shadow-blue-200
                transition-all hover:scale-[1.02]
              "
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Franchise</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${statusFilter === "all" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }
            `}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
              ${statusFilter === "active" 
                ? "bg-green-600 text-white shadow-lg shadow-green-200" 
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }
            `}
          >
            <span className={`w-2 h-2 rounded-full ${statusFilter === "active" ? "bg-white" : "bg-green-500"}`} />
            Active
          </button>
          <button
            onClick={() => setStatusFilter("inactive")}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
              ${statusFilter === "inactive" 
                ? "bg-red-600 text-white shadow-lg shadow-red-200" 
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }
            `}
          >
            <span className={`w-2 h-2 rounded-full ${statusFilter === "inactive" ? "bg-white" : "bg-red-500"}`} />
            Inactive
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`
                        p-4 text-left font-medium text-gray-600
                        cursor-pointer hover:bg-gray-100/80
                        transition-colors
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {col.label}
                        <ArrowUpDown size={14} className="text-gray-400" />
                      </div>
                    </th>
                  ))}
                  <th className="p-4 text-right font-medium text-gray-600">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-12">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                        <p>Loading franchises...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12">
                      <div className="text-center text-gray-500">
                        <p className="text-lg font-medium">No franchises found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((f) => (
                    <tr
                      key={f._id}
                      className="
                        border-b border-gray-100 hover:bg-gradient-to-r 
                        hover:from-blue-50/50 hover:to-indigo-50/50 
                        transition-all group
                      "
                    >
                      <td className="p-4">
                        <span className="font-mono text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                          {f.franchiseCode}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800">{f.name}</p>
                      </td>
                      <td className="p-4 text-gray-600">{f.ownerName}</td>
                      <td className="p-4 text-gray-600">
                        {f.email ? (
                          <span className="text-blue-600">{f.email}</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600">{f.city}</td>
                      <td className="p-4">
                        <span
                          className={`
                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${f.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }
                          `}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5
                            ${f.isActive ? 'bg-green-500' : 'bg-red-500'}
                          `} />
                          {f.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          {/* Status Toggle Button */}
                          <button
                            onClick={() => handleToggleStatus(f._id, f.isActive)}
                            disabled={togglingId === f._id}
                            className={`
                              p-2 rounded-lg transition-all relative
                              ${f.isActive 
                                ? 'hover:bg-red-100 text-red-600' 
                                : 'hover:bg-green-100 text-green-600'
                              }
                              ${togglingId === f._id ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            title={f.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {togglingId === f._id ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : f.isActive ? (
                              <PowerOff size={16} />
                            ) : (
                              <Power size={16} />
                            )}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(f)}
                            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(f._id)}
                            disabled={deletingId === f._id}
                            className={`
                              p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors
                              ${deletingId === f._id ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            title="Delete"
                          >
                            {deletingId === f._id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {processedData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, processedData.length)} of {processedData.length} entries
              </span>
              
              {/* Page Size Selector */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="
                  px-3 py-1.5 rounded-lg border border-gray-200
                  text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  outline-none bg-white cursor-pointer hover:bg-gray-50
                "
              >
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                title="First page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium">
                Page {page} of {totalPages || 1}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages || totalPages === 0}
                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                title="Last page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateFranchiseModal
        key={openForm ? 'open' : 'closed'} // Force remount when open state changes
        open={openForm}
        setOpen={setOpenForm}
        editData={editData}
        onSuccess={() => {
          dispatch(fetchFranchises());
          setEditData(null); // Clear edit data on success
        }}
      />
    </div>
  );
}