// import { useEffect, useState } from "react";
// import { apiGet,apiPatch } from "../../../services/apiHelpers";
// import {
//   Receipt,
//   Clock,
//   ChevronDown,
//   ChevronUp,
//   IndianRupee,
//   Package,
//   CreditCard,
//   Smartphone,
//   Wallet,
//   Table2,
//   Hash,
//   Calendar,
//   User,
//   AlertCircle,
//   CheckCircle2,
//   CircleDollarSign,
//   UtensilsCrossed,
//   Printer,
//   Search,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   Eye
// } from "lucide-react";

// export default function StaffBilling() {
//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedBill, setExpandedBill] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateFilter, setDateFilter] = useState("all");
//   const [printBill, setPrintBill] = useState(null);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   useEffect(() => {
//     loadBills();
//   }, []);

//   const loadBills = async () => {
//     try {
//       const res = await apiGet("/billing/my");
//       console.log("res staff billing", res.data.data);
//       setBills(res.data.data);
//     } catch (err) {
//       alert("Failed to load bills");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = async (billId) => {
//   try {

//     const res = await apiGet(`/billing/print/${billId}`);
//     const bill = res.data.data;

//     setPrintBill(bill);

//     setTimeout(async () => {

//       window.print();

//       await apiPatch(`/billing/printed/${billId}`);

//       loadBills();

//     }, 400);

//   } catch (err) {
//     console.error("Print failed", err);
//     alert("Printing failed");
//   }
// };
//   // Get payment method icon and color
//   const getPaymentDetails = (method) => {
//     switch(method?.toLowerCase()) {
//       case 'cash':
//         return { icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Cash' };
//       case 'card':
//         return { icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Card' };
//       case 'upi':
//         return { icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50', label: 'UPI' };
//       default:
//         return { icon: CircleDollarSign, color: 'text-slate-600', bg: 'bg-slate-50', label: method || 'N/A' };
//     }
//   };

//   // Get status details
//   const getStatusDetails = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'paid':
//         return { 
//           color: 'text-emerald-700', 
//           bg: 'bg-emerald-50', 
//           dot: 'bg-emerald-500',
//           icon: CheckCircle2,
//           label: 'Paid'
//         };
//       case 'generated':
//         return { 
//           color: 'text-amber-700', 
//           bg: 'bg-amber-50', 
//           dot: 'bg-amber-500',
//           icon: AlertCircle,
//           label: 'Generated'
//         };
//       case 'pending':
//         return { 
//           color: 'text-orange-700', 
//           bg: 'bg-orange-50', 
//           dot: 'bg-orange-500',
//           icon: Clock,
//           label: 'Pending'
//         };
//       default:
//         return { 
//           color: 'text-slate-700', 
//           bg: 'bg-slate-50', 
//           dot: 'bg-slate-500',
//           icon: AlertCircle,
//           label: status || 'Unknown'
//         };
//     }
//   };

//   // Filter bills
//   const filteredBills = bills.filter(bill => {
//     if (filter !== "all" && bill.status !== filter) return false;
    
//     const searchString = searchTerm.toLowerCase();
//     if (searchTerm) {
//       return (
//         bill.billNumber?.toLowerCase().includes(searchString) ||
//         bill.tableNumber?.toLowerCase().includes(searchString) ||
//         bill.items?.some(item => item.name?.toLowerCase().includes(searchString)) ||
//         bill.paymentMethod?.toLowerCase().includes(searchString)
//       );
//     }
    
//     if (dateFilter !== "all") {
//       const billDate = new Date(bill.createdAt);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       if (dateFilter === "today") {
//         return billDate >= today;
//       } else if (dateFilter === "week") {
//         const weekAgo = new Date(today);
//         weekAgo.setDate(weekAgo.getDate() - 7);
//         return billDate >= weekAgo;
//       } else if (dateFilter === "month") {
//         const monthAgo = new Date(today);
//         monthAgo.setMonth(monthAgo.getMonth() - 1);
//         return billDate >= monthAgo;
//       }
//     }
    
//     return true;
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
//   const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

//   // Calculate totals
//   const totalAmount = filteredBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
//   const totalItems = filteredBills.reduce((sum, bill) => sum + (bill.items?.length || 0), 0);
//   const paidCount = filteredBills.filter(b => b.status === 'paid').length;
//   const pendingCount = filteredBills.filter(b => b.paymentStatus === 'pending').length;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <div className="relative">
//           <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <Receipt className="w-8 h-8 text-blue-500 animate-pulse" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
//       <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">

//         {/* Header Section */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//           <div className="space-y-1">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
//                 <Receipt className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
//                   Billing Dashboard
//                 </h1>
//                 <p className="text-sm text-slate-500">
//                   Manage and track all your generated bills
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Quick Stats */}
//           <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-slate-200 shadow-sm">
//             <div className="px-4 py-2 bg-blue-50 rounded-xl">
//               <p className="text-xs text-blue-600">Total</p>
//               <p className="text-lg font-bold text-blue-700">{filteredBills.length}</p>
//             </div>
//             <div className="px-4 py-2 bg-emerald-50 rounded-xl">
//               <p className="text-xs text-emerald-600">Paid</p>
//               <p className="text-lg font-bold text-emerald-700">{paidCount}</p>
//             </div>
//             <div className="px-4 py-2 bg-amber-50 rounded-xl">
//               <p className="text-xs text-amber-600">Pending</p>
//               <p className="text-lg font-bold text-amber-700">{pendingCount}</p>
//             </div>
//           </div>
//         </div>

//         {/* Filters Bar */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-lg">
//           <div className="flex flex-col lg:flex-row gap-4">
            
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search by bill number, table, item..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1); // Reset to first page on search
//                 }}
//                 className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//               />
//             </div>

//             {/* Filters */}
//             <div className="flex gap-2">
//               <select
//                 value={filter}
//                 onChange={(e) => {
//                   setFilter(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="paid">Paid</option>
//                 <option value="generated">Generated</option>
//                 <option value="pending">Pending</option>
//               </select>

//               <select
//                 value={dateFilter}
//                 onChange={(e) => {
//                   setDateFilter(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//               >
//                 <option value="all">All Time</option>
//                 <option value="today">Today</option>
//                 <option value="week">This Week</option>
//                 <option value="month">This Month</option>
//               </select>

//               <select
//                 value={itemsPerPage}
//                 onChange={(e) => {
//                   setItemsPerPage(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//                 className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//               >
//                 <option value={5}>5 per page</option>
//                 <option value={10}>10 per page</option>
//                 <option value={20}>20 per page</option>
//                 <option value={50}>50 per page</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Table Section */}
//         {filteredBills.length === 0 ? (
//           <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-16 text-center shadow-xl">
//             <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
//               <Receipt className="w-12 h-12 text-slate-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-2">No bills found</h3>
//             <p className="text-slate-500 max-w-md mx-auto">
//               {searchTerm || filter !== "all" || dateFilter !== "all" 
//                 ? "Try adjusting your filters to see more results" 
//                 : "You haven't generated any bills yet"}
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
//               {/* Table */}
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-slate-100 border-b border-slate-200">
//                       <th className="px-4 py-4 text-left">
//                         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bill Details</span>
//                       </th>
//                       <th className="px-4 py-4 text-center">
//                         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Table</span>
//                       </th>
//                       <th className="px-4 py-4 text-center">
//                         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</span>
//                       </th>
//                       <th className="px-4 py-4 text-center">
//                         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
//                       </th>
//                       <th className="px-4 py-4 text-center">
//                         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment</span>
//                       </th>
//                       <th className="px-4 py-4 text-center">
//                         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
//                       </th>
//                       <th className="px-4 py-4 text-center">
//                         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</span>
//                       </th>
//                        <th className="px-4 py-4 text-center">
//                         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">print Bill</span>
//                       </th>
//                       <th className="px-4 py-4 text-right">
//                         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</span>
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentBills.map((bill) => {
//                       const isExpanded = expandedBill === bill._id;
//                       const PaymentIcon = getPaymentDetails(bill.paymentMethod).icon;
//                       const statusDetails = getStatusDetails(bill.status);
//                       const StatusIcon = statusDetails.icon;
//                       const totalQty = bill.items?.reduce((sum, item) => sum + item.qty, 0) || 0;
                      
//                       return (
//                         <>
//                           {/* Main Bill Row */}
//                           <tr 
//                             key={bill._id}
//                             className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer ${
//                               isExpanded ? 'bg-blue-50/30' : ''
//                             }`}
//                             onClick={() => setExpandedBill(isExpanded ? null : bill._id)}
//                           >
//                             <td className="px-4 py-3">
//                               <div className="flex items-center gap-3">
//                                 <div className={`w-8 h-8 ${statusDetails.bg} rounded-lg flex items-center justify-center`}>
//                                   <StatusIcon className={`w-4 h-4 ${statusDetails.color}`} />
//                                 </div>
//                                 <div>
//                                   <div className="flex items-center gap-2">
//                                     <Hash className="w-3 h-3 text-slate-400" />
//                                     <span className="font-mono text-sm font-medium text-slate-900">
//                                       {bill.billNumber}
//                                     </span>
//                                   </div>
//                                   <span className="text-xs text-slate-400">
//                                     ID: {bill._id.slice(-6)}
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
                            
//                             <td className="px-4 py-3 text-center">
//                               <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
//                                 <Table2 className="w-3.5 h-3.5 text-slate-500" />
//                                 <span className="text-sm font-medium text-slate-700">
//                                   {bill.tableNumber || 'N/A'}
//                                 </span>
//                               </div>
//                             </td>
                            
//                             <td className="px-4 py-3 text-center">
//                               <div className="flex flex-col items-center">
//                                 <span className="font-medium text-slate-900">{bill.items?.length || 0}</span>
//                                 <span className="text-xs text-slate-400">({totalQty} qty)</span>
//                               </div>
//                             </td>
                            
//                             <td className="px-4 py-3 text-center">
//                               <span className="font-bold text-blue-600">
//                                 ₹{bill.totalAmount?.toLocaleString()}
//                               </span>
//                             </td>
                            
//                             <td className="px-4 py-3 text-center">
//                               <div className="flex items-center justify-center gap-1.5">
//                                 <PaymentIcon className={`w-3.5 h-3.5 ${getPaymentDetails(bill.paymentMethod).color}`} />
//                                 <span className="text-sm capitalize text-slate-600">
//                                   {bill.paymentMethod}
//                                 </span>
//                               </div>
//                               <span className={`text-xs ${
//                                 bill.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
//                               }`}>
//                                 {bill.paymentStatus}
//                               </span>
//                             </td>
                            
//                             <td className="px-4 py-3 text-center">
//                               <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusDetails.bg} ${statusDetails.color}`}>
//                                 <span className={`w-1.5 h-1.5 rounded-full ${statusDetails.dot}`}></span>
//                                 {statusDetails.label}
//                               </span>
//                             </td>
                            
//                             <td className="px-4 py-3 text-center">
//                               <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
//                                 <Calendar className="w-3 h-3" />
//                                 {new Date(bill.createdAt).toLocaleDateString('en-US', { 
//                                   day: 'numeric',
//                                   month: 'short'
//                                 })}
//                               </div>
//                               <div className="text-xs text-slate-400">
//                                 {new Date(bill.createdAt).toLocaleTimeString('en-US', { 
//                                   hour: '2-digit',
//                                   minute: '2-digit'
//                                 })}
//                               </div>
//                             </td>

//                             <td className="px-4 py-3 text-center">

//                             {bill.status === "paid" && (
//                                 <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handlePrint(bill._id);
//                                 }}
//                                 className="p-2 hover:bg-green-100 rounded-lg"
//                                 title="Print Bill"
//                                 >
//                                 <Printer className="w-4 h-4 text-green-600" />
//                                 </button>
//                             )}

//                             </td>
                            
//                             <td className="px-4 py-3 text-center">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setExpandedBill(isExpanded ? null : bill._id);
//                                 }}
//                                 className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
//                               >
//                                 {isExpanded ? (
//                                   <ChevronUp className="w-4 h-4 text-slate-600" />
//                                 ) : (
//                                   <ChevronDown className="w-4 h-4 text-slate-600" />
//                                 )}
//                               </button>
//                             </td>
//                           </tr>

//                           {/* Expanded Row - Items */}
//                           {isExpanded && (
//                             <tr className="bg-slate-50">
//                               <td colSpan="8" className="px-4 py-4">
//                                 <div className="space-y-4">
//                                   <div className="flex items-center justify-between">
//                                     <h4 className="font-semibold text-slate-900 flex items-center gap-2">
//                                       <Package className="w-4 h-4 text-blue-600" />
//                                       Ordered Items
//                                     </h4>
//                                     <span className="text-xs bg-white px-2 py-1 rounded-full border border-slate-200">
//                                       {bill.items?.length} items
//                                     </span>
//                                   </div>

//                                   {/* Items Table */}
//                                   <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//                                     <table className="w-full text-sm">
//                                       <thead className="bg-slate-50">
//                                         <tr>
//                                           <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">#</th>
//                                           <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Item Name</th>
//                                           <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Price</th>
//                                           <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">Qty</th>
//                                           <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Subtotal</th>
//                                           <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">Status</th>
//                                         </tr>
//                                       </thead>
//                                       <tbody>
//                                         {bill.items?.map((item, idx) => (
//                                           <tr key={idx} className="border-t border-slate-100">
//                                             <td className="px-4 py-2 text-xs text-slate-400">{idx + 1}</td>
//                                             <td className="px-4 py-2 font-medium text-slate-900">{item.name}</td>
//                                             <td className="px-4 py-2 text-right text-slate-600">₹{item.price}</td>
//                                             <td className="px-4 py-2 text-center">
//                                               <span className="px-2 py-0.5 bg-slate-100 rounded-lg text-slate-700">
//                                                 {item.qty}
//                                               </span>
//                                             </td>
//                                             <td className="px-4 py-2 text-right font-medium text-blue-600">
//                                               ₹{(item.price * item.qty).toLocaleString()}
//                                             </td>
//                                             <td className="px-4 py-2 text-center">
//                                               <span className={`text-xs px-2 py-0.5 rounded-full ${
//                                                 item.status === 'ordered' 
//                                                   ? 'bg-blue-50 text-blue-600' 
//                                                   : 'bg-slate-50 text-slate-600'
//                                               }`}>
//                                                 {item.status}
//                                               </span>
//                                             </td>
//                                           </tr>
//                                         ))}
//                                       </tbody>
//                                     </table>
//                                   </div>

//                                   {/* Bill Summary */}
//                                   <div className="flex justify-end">
//                                     <div className="w-72 bg-white rounded-xl border border-slate-200 p-4">
//                                       <h5 className="font-medium text-slate-900 mb-3">Bill Summary</h5>
//                                       <div className="space-y-2">
//                                         <div className="flex justify-between text-sm">
//                                           <span className="text-slate-500">Subtotal</span>
//                                           <span className="font-medium text-slate-700">₹{bill.subTotal?.toLocaleString() || 0}</span>
//                                         </div>
//                                         <div className="flex justify-between text-sm">
//                                           <span className="text-slate-500">Tax</span>
//                                           <span className="font-medium text-slate-700">₹{bill.taxAmount?.toLocaleString() || 0}</span>
//                                         </div>
//                                         <div className="flex justify-between text-sm">
//                                           <span className="text-slate-500">Discount</span>
//                                           <span className="font-medium text-emerald-600">-₹{bill.discountAmount?.toLocaleString() || 0}</span>
//                                         </div>
//                                         <div className="flex justify-between font-semibold pt-2 border-t border-slate-200">
//                                           <span className="text-slate-900">Grand Total</span>
//                                           <span className="text-lg text-blue-600">₹{bill.totalAmount?.toLocaleString()}</span>
//                                         </div>
//                                       </div>
//                                       <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
//                                         <div className="flex items-center gap-1">
//                                           <Printer className="w-3 h-3" />
//                                           Print: {bill.printStatus}
//                                         </div>
//                                         <div className="flex items-center gap-1">
//                                           <User className="w-3 h-3" />
//                                           {bill.generatedBy?.slice(-6)}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                             </tr>
//                           )}
//                         </>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Pagination */}
//             <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-lg">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <p className="text-sm text-slate-500">
//                   Showing <span className="font-medium text-slate-900">{indexOfFirstItem + 1}</span> to{' '}
//                   <span className="font-medium text-slate-900">
//                     {Math.min(indexOfLastItem, filteredBills.length)}
//                   </span>{' '}
//                   of <span className="font-medium text-slate-900">{filteredBills.length}</span> bills
//                 </p>

//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={prevPage}
//                     disabled={currentPage === 1}
//                     className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                     Previous
//                   </button>

//                   <div className="flex items-center gap-1">
//                     {[...Array(totalPages)].map((_, i) => {
//                       const pageNum = i + 1;
//                       // Show first, last, and pages around current
//                       if (
//                         pageNum === 1 ||
//                         pageNum === totalPages ||
//                         (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
//                       ) {
//                         return (
//                           <button
//                             key={i}
//                             onClick={() => paginate(pageNum)}
//                             className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
//                               ${currentPage === pageNum
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
//                               }`}
//                           >
//                             {pageNum}
//                           </button>
//                         );
//                       } else if (
//                         pageNum === currentPage - 2 ||
//                         pageNum === currentPage + 2
//                       ) {
//                         return (
//                           <span key={i} className="px-1 text-slate-400">
//                             ...
//                           </span>
//                         );
//                       }
//                       return null;
//                     })}
//                   </div>

//                   <button
//                     onClick={nextPage}
//                     disabled={currentPage === totalPages}
//                     className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//                   >
//                     Next
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Summary Footer */}
//             <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-lg">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                     <span className="text-sm text-slate-600">Paid: {paidCount}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
//                     <span className="text-sm text-slate-600">Pending: {pendingCount}</span>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-4">
//                   <span className="text-sm text-slate-500">
//                     Total Items: <span className="font-bold text-slate-900">{totalItems}</span>
//                   </span>
//                   <span className="text-sm text-slate-500">
//                     Total Amount: <span className="font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span>
//                   </span>
//                 </div>
                
//               </div>
//             </div>
//           </>

//         )}
//       </div>
//     </div>
//   );
  
// }

import React, { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../../../services/apiHelpers";
import {
  Receipt,
  Clock,
  ChevronDown,
  ChevronUp,
  Package,
  CreditCard,
  Smartphone,
  Wallet,
  Table2,
  Hash,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
  Printer,
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  PrinterCheck
} from "lucide-react";

export default function StaffBilling() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBill, setExpandedBill] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [printBill, setPrintBill] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [franchiseInfo, setFranchiseInfo] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    loadBills();
    loadFranchiseInfo();
  }, []);

  const loadFranchiseInfo = async () => {
    try {
      const res = await apiGet("/user/franchise-info");
      setFranchiseInfo(res.data.data);
    } catch (err) {
      console.error("Failed to load franchise info", err);
    }
  };

  const loadBills = async () => {
    try {
      const res = await apiGet("/billing/my");
      setBills(res.data.data || []);
    } catch (err) {
      console.error("Failed to load bills", err);
      alert("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async (billId) => {
    try {
      setIsPrinting(true);
      
      // Fetch bill details for printing
      const res = await apiGet(`/billing/print/${billId}`);
      const billData = res.data.data;
      
      if (!billData) {
        throw new Error("No bill data received");
      }

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Please allow pop-ups to print bills");
        setIsPrinting(false);
        return;
      }

      // Generate print content with franchise address
      const printContent = generatePrintContent(billData);
      
      // Write content to new window
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = function() {
          setTimeout(() => {
            printWindow.close();
          }, 500);
        };
      };

      // Update print status in backend
      await apiPatch(`/billing/printed/${billId}`);
      
      // Reload bills to update print status
      await loadBills();
      
    } catch (err) {
      console.error("Print failed", err);
      alert("Printing failed: " + (err.message || "Unknown error"));
    } finally {
      setIsPrinting(false);
    }
  };

const generatePrintContent = (bill) => {
  const items = bill.items || [];
  const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0);
  const total = bill.totalAmount || subtotal;
  const date = new Date(bill.createdAt || new Date());
  
  // CORRECT WAY: Access the franchise data from the nested object
  // Based on your backend response, franchise data is in bill.franchise
  const franchise = bill.franchise || {};
  
  console.log("Print Bill Data:", bill);
  console.log("Franchise Data:", franchise); // This should now show your actual franchise data
  console.log("Franchise Name:", franchise.name); // Should show "aasdsd"
  console.log("Franchise Address:", franchise.address); // Should show "sdsdsdsd"
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bill - ${bill.billNumber || 'N/A'}</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          margin: 0;
          padding: 20px;
          background: white;
          font-size: 12px;
        }
        .bill-container {
          max-width: 80mm;
          margin: 0 auto;
          padding: 10px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #333;
        }
        .header h1 {
          font-size: 18px;
          margin: 0;
          font-weight: bold;
        }
        .header .franchise-code {
          font-size: 10px;
          color: #666;
          margin: 2px 0;
        }
        .header p {
          margin: 5px 0;
          font-size: 11px;
        }
        .bill-details {
          margin-bottom: 15px;
          padding: 5px 0;
          border-bottom: 1px dashed #333;
        }
        .bill-details div {
          display: flex;
          justify-content: space-between;
          margin: 3px 0;
        }
        .items-table {
          width: 100%;
          margin-bottom: 15px;
        }
        .items-table th {
          text-align: left;
          border-bottom: 1px solid #333;
          padding: 5px 0;
        }
        .items-table td {
          padding: 3px 0;
        }
        .items-table .item-name {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .items-table .text-right {
          text-align: right;
        }
        .items-table .text-center {
          text-align: center;
        }
        .summary {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px dashed #333;
        }
        .summary div {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
        }
        .grand-total {
          font-weight: bold;
          font-size: 14px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px solid #333;
        }
        .print-status {
          text-align: center;
          margin: 10px 0;
          padding: 5px;
          background: #f3f4f6;
          border-radius: 4px;
          font-size: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px dashed #333;
        }
        .text-green { color: #059669; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: bold;
        }
        .badge-printed {
          background: #10b981;
          color: white;
        }
        .badge-pending {
          background: #f59e0b;
          color: white;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="bill-container">
        <!-- Restaurant Header with ACTUAL Franchise Data -->
        <div class="header">
          <h1>🍽️ ${franchise.name || 'My Restaurant'}</h1>
          <div class="franchise-code">Branch: ${franchise.franchiseCode || 'MAIN'}</div>
          <p>${franchise.address || '123 Food Street'}</p>
          <p>${franchise.city || 'City'}, ${franchise.state || 'State'}</p>
          <p>Tel: ${franchise.phone || '+91 98765 43210'}</p>
        </div>

        <!-- Print Status Badge -->
        <div class="print-status">
          <span class="badge ${bill.printStatus === 'printed' ? 'badge-printed' : 'badge-pending'}">
            ${bill.printStatus === 'printed' ? '✓ PRINTED' : '⏳ PENDING PRINT'}
          </span>
        </div>

        <!-- Bill Details - Removed table, cashier, bill ID as requested -->
        <div class="bill-details">
          <div>
            <span>Bill No:</span>
            <span class="font-bold">${bill.billNumber || 'N/A'}</span>
          </div>
          <div>
            <span>Date:</span>
            <span>${date.toLocaleDateString()}</span>
          </div>
          <div>
            <span>Time:</span>
            <span>${date.toLocaleTimeString()}</span>
          </div>
          <!-- Table and Cashier removed as requested -->
        </div>

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td class="item-name">${item.name || 'Item'}</td>
                <td class="text-center">${item.qty || 0}</td>
                <td class="text-right">₹${(item.price || 0).toFixed(2)}</td>
                <td class="text-right">₹${((item.price || 0) * (item.qty || 0)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Summary -->
        <div class="summary">
          <div>
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          ${bill.taxAmount ? `
            <div>
              <span>Tax (GST):</span>
              <span>₹${Number(bill.taxAmount).toFixed(2)}</span>
            </div>
          ` : ''}
          ${bill.discountAmount ? `
            <div class="text-green">
              <span>Discount:</span>
              <span>-₹${Number(bill.discountAmount).toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="grand-total">
            <span>TOTAL:</span>
            <span>₹${total.toFixed(2)}</span>
          </div>
        </div>

        <!-- Payment Details -->
        <div class="bill-details" style="margin-top: 10px;">
          <div>
            <span>Payment Method:</span>
            <span class="font-bold">${(bill.paymentMethod || 'N/A').toUpperCase()}</span>
          </div>
          <div>
            <span>Payment Status:</span>
            <span class="font-bold ${bill.paymentStatus === 'paid' ? 'text-green' : ''}">
              ${(bill.paymentStatus || 'N/A').toUpperCase()}
            </span>
          </div>
        </div>

        <!-- Footer - Removed Bill ID as requested -->
        <div class="footer">
          <p class="font-bold">Thank You! Visit Again</p>
          <p style="font-size: 10px; margin-top: 5px;">*** This is a computer generated bill ***</p>
          <p style="font-size: 8px; margin-top: 2px;">Printed on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

  // Get payment method icon and color
  const getPaymentDetails = (method) => {
    switch(method?.toLowerCase()) {
      case 'cash':
        return { icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Cash' };
      case 'card':
        return { icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Card' };
      case 'upi':
        return { icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50', label: 'UPI' };
      default:
        return { icon: CircleDollarSign, color: 'text-slate-600', bg: 'bg-slate-50', label: method || 'N/A' };
    }
  };

  // Get status details
  const getStatusDetails = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid':
        return { 
          color: 'text-emerald-700', 
          bg: 'bg-emerald-50', 
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
          label: 'Paid'
        };
      case 'generated':
        return { 
          color: 'text-amber-700', 
          bg: 'bg-amber-50', 
          dot: 'bg-amber-500',
          icon: AlertCircle,
          label: 'Generated'
        };
      case 'pending':
        return { 
          color: 'text-orange-700', 
          bg: 'bg-orange-50', 
          dot: 'bg-orange-500',
          icon: Clock,
          label: 'Pending'
        };
      default:
        return { 
          color: 'text-slate-700', 
          bg: 'bg-slate-50', 
          dot: 'bg-slate-500',
          icon: AlertCircle,
          label: status || 'Unknown'
        };
    }
  };

  // Get print status details
  const getPrintStatusDetails = (printStatus) => {
    switch(printStatus?.toLowerCase()) {
      case 'printed':
        return {
          icon: PrinterCheck,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          dot: 'bg-emerald-500',
          label: 'Printed',
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
        };
      case 'pending':
      default:
        return {
          icon: Printer,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          dot: 'bg-amber-500',
          label: 'Pending',
          badge: 'bg-amber-100 text-amber-700 border-amber-200'
        };
    }
  };

  // Filter bills
  const filteredBills = bills.filter(bill => {
    // Status filter
    if (filter !== "all" && bill.status !== filter) return false;
    
    // Search filter
    if (searchTerm) {
      const searchString = searchTerm.toLowerCase();
      return (
        bill.billNumber?.toLowerCase().includes(searchString) ||
        bill.tableNumber?.toLowerCase().includes(searchString) ||
        bill.items?.some(item => item.name?.toLowerCase().includes(searchString)) ||
        bill.paymentMethod?.toLowerCase().includes(searchString) ||
        bill.franchiseCode?.toLowerCase().includes(searchString)
      );
    }
    
    // Date filter
    if (dateFilter !== "all") {
      const billDate = new Date(bill.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === "today") {
        return billDate >= today;
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return billDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return billDate >= monthAgo;
      }
    }
    
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Calculate totals
  const totalAmount = filteredBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
  const totalItems = filteredBills.reduce((sum, bill) => sum + (bill.items?.length || 0), 0);
  const paidCount = filteredBills.filter(b => b.status === 'paid').length;
const pendingCount = filteredBills.filter(b => {
  const status = (b.status || '').toLowerCase();
  const paymentStatus = (b.paymentStatus || '').toLowerCase();
  
  // Check if either field contains 'pend' (handles pending, pendin, pending, etc.)
  return status.includes('pend') || paymentStatus.includes('pend');
}).length;
  const printedCount = filteredBills.filter(b => b.printStatus === 'printed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Receipt className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  Billing Dashboard
                </h1>
                <p className="text-sm text-slate-500">
                  Manage and track all your generated bills
                </p>
              </div>
            </div>
          </div>

          {/* Franchise Info Card */}
          {franchiseInfo?.currentFranchise && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Current Branch</p>
                  <p className="font-semibold text-slate-900">{franchiseInfo.currentFranchise.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {franchiseInfo.currentFranchise.address}, {franchiseInfo.currentFranchise.city}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-4 py-2 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-600">Total</p>
              <p className="text-lg font-bold text-blue-700">{filteredBills.length}</p>
            </div>
            <div className="px-4 py-2 bg-emerald-50 rounded-xl">
              <p className="text-xs text-emerald-600">Paid</p>
              <p className="text-lg font-bold text-emerald-700">{paidCount}</p>
            </div>
            {/* <div className="px-4 py-2 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-600">Pending</p>
              <p className="text-lg font-bold text-amber-700">{pendingCount}</p>
            </div> */}
            <div className="px-4 py-2 bg-purple-50 rounded-xl">
              <p className="text-xs text-purple-600">Printed</p>
              <p className="text-lg font-bold text-purple-700">{printedCount}</p>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by bill number, table, item, branch..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="generated">Generated</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {filteredBills.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-16 text-center shadow-xl">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No bills found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchTerm || filter !== "all" || dateFilter !== "all" 
                ? "Try adjusting your filters to see more results" 
                : "You haven't generated any bills yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="px-4 py-4 text-left">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bill Details</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Table</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Print Status</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Print</span>
                      </th>
                      <th className="px-4 py-4 text-right">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBills.map((bill) => {
                      const isExpanded = expandedBill === bill._id;
                      const PaymentIcon = getPaymentDetails(bill.paymentMethod).icon;
                      const statusDetails = getStatusDetails(bill.status);
                      const printStatusDetails = getPrintStatusDetails(bill.printStatus);
                      const PrintStatusIcon = printStatusDetails.icon;
                      const StatusIcon = statusDetails.icon;
                      const totalQty = bill.items?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0;
                      
                      return (
                        <React.Fragment key={bill._id}>
                          {/* Main Bill Row */}
                          <tr 
                            className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer ${
                              isExpanded ? 'bg-blue-50/30' : ''
                            }`}
                            onClick={() => setExpandedBill(isExpanded ? null : bill._id)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 ${statusDetails.bg} rounded-lg flex items-center justify-center`}>
                                  <StatusIcon className={`w-4 h-4 ${statusDetails.color}`} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Hash className="w-3 h-3 text-slate-400" />
                                    <span className="font-mono text-sm font-medium text-slate-900">
                                      {bill.billNumber}
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-400">
                                    ID: {bill._id?.slice(-6)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            
                            
                            <td className="px-4 py-3 text-center">
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
                                <Table2 className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">
                                  {bill.tableNumber || 'N/A'}
                                </span>
                              </div>
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <div className="flex flex-col items-center">
                                <span className="font-medium text-slate-900">{bill.items?.length || 0}</span>
                                <span className="text-xs text-slate-400">({totalQty} qty)</span>
                              </div>
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <span className="font-bold text-blue-600">
                                ₹{(bill.totalAmount || 0).toLocaleString()}
                              </span>
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <PaymentIcon className={`w-3.5 h-3.5 ${getPaymentDetails(bill.paymentMethod).color}`} />
                                <span className="text-sm capitalize text-slate-600">
                                  {bill.paymentMethod || 'N/A'}
                                </span>
                              </div>
                              <span className={`text-xs ${
                                bill.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                              }`}>
                                {bill.paymentStatus || 'N/A'}
                              </span>
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusDetails.bg} ${statusDetails.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusDetails.dot}`}></span>
                                {statusDetails.label}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${printStatusDetails.bg} ${printStatusDetails.color}`}>
                                <PrintStatusIcon className="w-3 h-3" />
                                {printStatusDetails.label}
                              </span>
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                                <Calendar className="w-3 h-3" />
                                {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString('en-US', { 
                                  day: 'numeric',
                                  month: 'short'
                                }) : 'N/A'}
                              </div>
                              <div className="text-xs text-slate-400">
                                {bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString('en-US', { 
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'N/A'}
                              </div>
                            </td>

                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrint(bill._id);
                                }}
                                disabled={isPrinting || bill.status !== "paid"}
                                className={`p-2 rounded-lg transition-colors ${
                                  bill.status === "paid" 
                                    ? bill.printStatus === 'printed'
                                      ? 'hover:bg-purple-100 text-purple-600'
                                      : 'hover:bg-green-100 text-green-600'
                                    : 'opacity-40 cursor-not-allowed text-slate-400'
                                }`}
                                title={
                                  bill.status !== "paid" 
                                    ? "Bill must be paid to print"
                                    : bill.printStatus === 'printed'
                                      ? "Reprint Bill"
                                      : "Print Bill"
                                }
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedBill(isExpanded ? null : bill._id);
                                }}
                                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-slate-600" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-slate-600" />
                                )}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Row - Items and Details */}
                          {isExpanded && (
                            <tr className="bg-slate-50">
                              <td colSpan="11" className="px-4 py-4">
                                <div className="space-y-4">

                                  {/* Items Section */}
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                      <Package className="w-4 h-4 text-blue-600" />
                                      Ordered Items
                                    </h4>
                                    <span className="text-xs bg-white px-2 py-1 rounded-full border border-slate-200">
                                      {bill.items?.length || 0} items
                                    </span>
                                  </div>

                                  {/* Items Table */}
                                  {bill.items && bill.items.length > 0 ? (
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                      <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                          <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">#</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Item Name</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Price</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">Qty</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Subtotal</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">Status</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {bill.items.map((item, idx) => (
                                            <tr key={idx} className="border-t border-slate-100">
                                              <td className="px-4 py-2 text-xs text-slate-400">{idx + 1}</td>
                                              <td className="px-4 py-2 font-medium text-slate-900">{item.name || 'N/A'}</td>
                                              <td className="px-4 py-2 text-right text-slate-600">₹{(item.price || 0).toFixed(2)}</td>
                                              <td className="px-4 py-2 text-center">
                                                <span className="px-2 py-0.5 bg-slate-100 rounded-lg text-slate-700">
                                                  {item.qty || 0}
                                                </span>
                                              </td>
                                              <td className="px-4 py-2 text-right font-medium text-blue-600">
                                                ₹{((item.price || 0) * (item.qty || 0)).toFixed(2)}
                                              </td>
                                              <td className="px-4 py-2 text-center">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                  item.status === 'ordered' 
                                                    ? 'bg-blue-50 text-blue-600' 
                                                    : 'bg-slate-50 text-slate-600'
                                                }`}>
                                                  {item.status || 'N/A'}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-center py-8 bg-white rounded-xl border border-slate-200">
                                      <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                                      <p className="text-slate-500">No items found</p>
                                    </div>
                                  )}

                                  {/* Bill Summary */}
                                  <div className="flex justify-end">
                                    <div className="w-72 bg-white rounded-xl border border-slate-200 p-4">
                                      <h5 className="font-medium text-slate-900 mb-3">Bill Summary</h5>
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-500">Subtotal</span>
                                          <span className="font-medium text-slate-700">
                                            ₹{(bill.subTotal || (bill.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0) || 0)).toFixed(2)}
                                          </span>
                                        </div>
                                        {bill.taxAmount > 0 && (
                                          <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Tax</span>
                                            <span className="font-medium text-slate-700">₹{(bill.taxAmount || 0).toFixed(2)}</span>
                                          </div>
                                        )}
                                        {bill.discountAmount > 0 && (
                                          <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Discount</span>
                                            <span className="font-medium text-emerald-600">-₹{(bill.discountAmount || 0).toFixed(2)}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between font-semibold pt-2 border-t border-slate-200">
                                          <span className="text-slate-900">Grand Total</span>
                                          <span className="text-lg text-blue-600">₹{(bill.totalAmount || 0).toFixed(2)}</span>
                                        </div>
                                      </div>
                                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                          <Printer className="w-3 h-3" />
                                          Print: 
                                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                            bill.printStatus === 'printed' 
                                              ? 'bg-emerald-100 text-emerald-700' 
                                              : 'bg-amber-100 text-amber-700'
                                          }`}>
                                            {bill.printStatus || 'pending'}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <User className="w-3 h-3" />
                                          {bill.generatedBy?.slice(-6) || 'N/A'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {filteredBills.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-slate-500">
                    Showing <span className="font-medium text-slate-900">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium text-slate-900">
                      {Math.min(indexOfLastItem, filteredBills.length)}
                    </span>{' '}
                    of <span className="font-medium text-slate-900">{filteredBills.length}</span> bills
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={i}
                              onClick={() => paginate(pageNum)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                                ${currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <span key={i} className="px-1 text-slate-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Footer */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Paid: {paidCount}</span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Pending: {pendingCount}</span>
                  </div> */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Printed: {printedCount}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">
                    Total Items: <span className="font-bold text-slate-900">{totalItems}</span>
                  </span>
                  <span className="text-sm text-slate-500">
                    Total Amount: <span className="font-bold text-blue-600">₹{totalAmount.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}