// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMenu, deleteMenu } from "../menuSlice";
// import MenuCard from "../components/MenuCard";
// import CreateMenuModal from "../components/CreateMenuModal";

// export default function MenuScreen() {

//   const dispatch = useDispatch();
//   const { items, loading } = useSelector(s => s.menu);

//   const [open, setOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     dispatch(fetchMenu());
//   }, []);

// return (
//   <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">

//     {/* HEADER */}
//     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">
//           Menu Management
//         </h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Manage restaurant items & pricing
//         </p>
//       </div>

//       <button
//         onClick={() => {
//           setEditData(null);
//           setOpen(true);
//         }}
//         className="
//           bg-gradient-to-r from-indigo-600 to-blue-600
//           hover:from-indigo-700 hover:to-blue-700
//           text-white px-5 py-2.5 rounded-xl
//           shadow-lg shadow-blue-200
//           transition-all hover:scale-[1.03]
//         "
//       >
//         + Add Item
//       </button>
//     </div>

//     {/* GRID */}
//     <div className="
//       grid gap-6
//       sm:grid-cols-2
//       md:grid-cols-3
//       lg:grid-cols-4
//     ">
//       {loading
//         ? <p className="text-gray-500">Loading...</p>
//         : items.map(item => (
//             <MenuCard
//               key={item._id}
//               item={item}
//               onEdit={(i)=>{setEditData(i);setOpen(true);}}
//               onDelete={(id)=>dispatch(deleteMenu(id))}
//             />
//           ))
//       }
//     </div>

//     <CreateMenuModal
//       open={open}
//       setOpen={(v)=>{
//         setOpen(v);
//         if(!v) setEditData(null);
//       }}
//       editData={editData}
//     />
//   </div>
// );

// }




import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu, deleteMenu } from "../menuSlice";
import MenuCard from "../components/MenuCard";
import CreateMenuModal from "../components/CreateMenuModal";
import {
  Search,
  Plus,
  Filter,
  Grid3x3,
  List,
  SlidersHorizontal,
  X,
  ChefHat,
  Package,
  Utensils,
  Coffee,
  Pizza,
  Beef,
  Soup,
  Sandwich,
  Wine,
  CupSoda,
  IceCream,
  Sparkles,
  TrendingUp,
  Clock,
  Star
} from "lucide-react";

export default function MenuScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.menu);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // name, price, category
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  // Get unique categories from items
  const categories = useMemo(() => {
    const cats = items.map(item => item.category).filter(Boolean);
    return ["all", ...new Set(cats)];
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name?.localeCompare(b.name);
        case "price":
          return (a.price || 0) - (b.price || 0);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchTerm, categoryFilter, sortBy]);

  // Get random icon for empty state
  const getRandomIcon = () => {
    const icons = [ChefHat, Coffee, Pizza, Beef, Soup, Sandwich, Wine, CupSoda, IceCream, Utensils];
    const Icon = icons[Math.floor(Math.random() * icons.length)];
    return Icon;
  };

  const EmptyStateIcon = getRandomIcon();

  // Calculate stats
  const totalItems = items.length;
  const totalCategories = new Set(items.map(i => i.category).filter(Boolean)).size;
  const averagePrice = items.length 
    ? Math.round(items.reduce((sum, i) => sum + (i.price || 0), 0) / items.length) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg shadow-indigo-200">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  Menu Management
                </h1>
                <p className="text-sm text-slate-500">
                  Manage restaurant items, pricing & categories
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
            className="
              flex items-center justify-center gap-2
              bg-gradient-to-r from-indigo-600 to-blue-600
              hover:from-indigo-700 hover:to-blue-700
              text-white px-5 py-2.5 rounded-xl
              shadow-lg shadow-indigo-200
              transition-all hover:scale-[1.02] hover:shadow-xl
              font-medium
            "
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Package className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Items</p>
                <p className="text-xl font-bold text-slate-900">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Filter className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Categories</p>
                <p className="text-xl font-bold text-slate-900">{totalCategories}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Avg. Price</p>
                <p className="text-xl font-bold text-slate-900">₹{averagePrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, description or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-3 h-3 text-slate-400" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all
                ${showFilters 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }
              `}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`
                  p-2 rounded-md transition-colors
                  ${viewMode === "grid" 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-400 hover:text-slate-600'
                  }
                `}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`
                  p-2 rounded-md transition-colors
                  ${viewMode === "list" 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-400 hover:text-slate-600'
                  }
                `}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-200">
              
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="category">Category</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="ml-auto flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-500">
                  {filteredItems.length} items found
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CONTENT SECTION */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <p className="text-slate-500 mt-4">Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-12 text-center shadow-xl">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <EmptyStateIcon className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No menu items found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {searchTerm || categoryFilter !== "all" 
                ? "Try adjusting your search or filters to find what you're looking for"
                : "Get started by adding your first menu item"}
            </p>
            {!searchTerm && categoryFilter === "all" && (
              <button
                onClick={() => {
                  setEditData(null);
                  setOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Your First Item
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map(item => (
                  <MenuCard
                    key={item._id}
                    item={item}
                    onEdit={(i) => {
                      setEditData(i);
                      setOpen(true);
                    }}
                    onDelete={(id) => dispatch(deleteMenu(id))}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-indigo-600 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-indigo-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-indigo-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredItems.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                                {item.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{item.name}</p>
                                {item.description && (
                                  <p className="text-xs text-slate-500 truncate max-w-xs">{item.description}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                              {item.category || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-indigo-600">₹{item.price?.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditData(item);
                                  setOpen(true);
                                }}
                                className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-indigo-600"
                              >
                                <span className="text-sm font-medium">Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this item?')) {
                                    dispatch(deleteMenu(item._id));
                                  }
                                }}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                              >
                                <span className="text-sm font-medium">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create/Edit Modal */}
        <CreateMenuModal
          open={open}
          setOpen={(v) => {
            setOpen(v);
            if (!v) setEditData(null);
          }}
          editData={editData}
        />
      </div>
    </div>
  );
}