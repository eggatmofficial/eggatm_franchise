import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaff,
  deleteStaff,
} from "../staffSlice";

import StaffFormModal from "../components/StaffFormModal";

import { 
  Pencil, 
  Trash2, 
  Plus, 
  Users,
  Mail,
  Circle,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

export default function StaffList() {
  const dispatch = useDispatch();
  const { staff, loading } = useSelector((state) => state.staff);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null); // Track which item is being deleted
  
  // Pagination states - Fixed to 10 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed to 10 items per page

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  const handleDelete = async (e, id) => {
     console.log("DELETE CLICKED", id); 
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event bubbling
    
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        setDeleteLoading(id); // Set loading state for this item
        await dispatch(deleteStaff(id));
console.log("DISPATCH COMPLETED");
        console.log("Staff deleted successfully");
      } catch (error) {
        console.error("Failed to delete staff:", error);
        alert("Failed to delete staff member. Please try again.");
      } finally {
        setDeleteLoading(null); // Clear loading state
      }
    }
  };

  const handleEdit = (e, data) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event bubbling
    setEditData(data);
    setOpenModal(true);
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    setEditData(null);
    setOpenModal(true);
  };

  // Filter staff based on search
  const filteredStaff = staff.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  // Change page
  const goToPage = (pageNumber) => {
    setCurrentPage(Math.min(Math.max(1, pageNumber), totalPages));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Premium Header - Simplified */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {/* Logo/Icon */}
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              
              {/* Title Section */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Staff Management
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your team members and their permissions
                </p>
              </div>
            </div>
          </div>
          
          {/* Only Add Staff Button */}
          <button
            onClick={handleAddNew}
            type="button"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Plus size={20} />
            <span className="font-medium">Add Staff</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              
              {/* Table Header */}
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                  <th className="px-6 py-5 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Team Member
                    </span>
                  </th>
                  <th className="px-6 py-5 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </span>
                  </th>
                  <th className="px-6 py-5 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </span>
                  </th>
                  <th className="px-6 py-5 text-right">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  // Loading state
                  <tr>
                    <td colSpan={4} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500 font-medium">
                          Loading team members...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={4} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                          <Users className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="text-gray-900 font-semibold text-lg mb-1">
                          No staff members found
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          {searchTerm ? "Try a different search term" : "Get started by adding your first team member"}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={handleAddNew}
                            type="button"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                          >
                            <Plus size={18} />
                            Add Staff Member
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Staff rows
                  currentItems.map((s) => (
                    <tr
                      key={s._id}
                      className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-white transition-all duration-200 group"
                    >
                      {/* Name with Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Gradient avatar */}
                          <div className={`
                            h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center 
                            text-white font-semibold text-sm shadow-md
                            ${s.isActive 
                              ? 'from-blue-500 to-indigo-500' 
                              : 'from-gray-400 to-gray-500'}
                          `}>
                            {s.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          
                          {/* Name and ID */}
                          <div>
                            <p className="font-semibold text-gray-900">{s.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              ID: {s._id?.slice(-6) || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email with icon */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm">{s.email}</span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4">
                        <span className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
                          ${s.isActive 
                            ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm' 
                            : 'bg-gray-50 text-gray-600 border border-gray-200'}
                        `}>
                          <Circle className={`h-1.5 w-1.5 fill-current ${s.isActive ? 'text-green-500' : 'text-gray-400'}`} />
                          {s.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => handleEdit(e, s)}
                            className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-all duration-200 hover:scale-110"
                            title="Edit staff"
                            type="button"
                            disabled={deleteLoading === s._id}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, s._id)}
                            className={`
                              p-2 rounded-xl transition-all duration-200
                              ${deleteLoading === s._id 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'hover:bg-red-50 text-red-600 hover:scale-110'
                              }
                            `}
                            title="Delete staff"
                            type="button"
                            disabled={deleteLoading === s._id}
                          >
                            {deleteLoading === s._id ? (
                              <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
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
        </div>

        {/* Pagination Section */}
        {!loading && filteredStaff.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              {/* Left side - Showing info */}
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-700">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium text-gray-700">
                  {Math.min(indexOfLastItem, filteredStaff.length)}
                </span>{' '}
                of <span className="font-medium text-gray-700">{filteredStaff.length}</span> results
                <span className="ml-2 text-xs text-gray-400">(10 per page)</span>
              </div>

              {/* Right side - Pagination controls */}
              <div className="flex items-center gap-2">
                {/* First page button */}
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  type="button"
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  title="First page"
                >
                  <ChevronsLeft size={18} />
                </button>

                {/* Previous page button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  type="button"
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  title="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        type="button"
                        className={`
                          min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-200
                          ${currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                          }
                        `}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next page button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  type="button"
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  title="Next page"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Last page button */}
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  type="button"
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  title="Last page"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>
            </div>

            {/* Mobile pagination indicator */}
            <div className="sm:hidden mt-3 text-center">
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <StaffFormModal
        open={openModal}
        setOpen={setOpenModal}
        editData={editData}
      />
    </div>
  );
}