

// import { useEffect, useState } from "react";
// import { 
//   RefreshCcw, 
//   Eye, 
//   Search,
//   Filter,
//   Download,
//   Printer,
//   Clock,
//   Calendar,
//   CreditCard,
//   Wallet,
//   Smartphone,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   Users,
//   Receipt,
//   Hash,
//   User,
//   MoreHorizontal,
//   ArrowUpDown,
//   Loader2
// } from "lucide-react";

// import { apiGet, apiPatch } from "../../../services/apiHelpers";
// import BillingPreviewModal from "../components/BillingPreviewModal";

// export default function BillingScreen() {
//   const [bills, setBills] = useState([]);
//   const [filteredBills, setFilteredBills] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [payingId, setPayingId] = useState(null);
//   const [printingId, setPrintingId] = useState(null);
//   const [previewTab, setPreviewTab] = useState(null);
//   const [previewBill, setPreviewBill] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [paymentFilter, setPaymentFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("newest");
//   const [showFilters, setShowFilters] = useState(false);
//   const [stats, setStats] = useState({
//     totalBills: 0,
//     totalRevenue: 0,
//     pendingPayments: 0,
//     completedPayments: 0
//   });

//   /* ================= FETCH BILLS ================= */
//   const fetchBills = async () => {
//     try {
//       setLoading(true);
//       const res = await apiGet("/billing");
//       const billsData = res.data.data || [];
//       setBills(billsData);
//       setFilteredBills(billsData);
      
//       // Calculate stats
//       calculateStats(billsData);
//     } catch (err) {
//       console.error("Billing fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= CALCULATE STATS ================= */
//   const calculateStats = (billsData) => {
//     const totalRevenue = billsData.reduce((sum, bill) => sum + (bill.amount || bill.totalAmount || 0), 0);
//     const pendingPayments = billsData.filter(bill => bill.paymentStatus === "pending" || bill.paymentStatus === "pending").length;
//     const completedPayments = billsData.filter(bill => bill.paymentStatus === "completed" || bill.paymentStatus === "paid" || bill.status === "paid").length;
    
//     setStats({
//       totalBills: billsData.length,
//       totalRevenue,
//       pendingPayments,
//       completedPayments
//     });
//   };

//   /* ================= FILTER AND SORT ================= */
//   useEffect(() => {
//     let filtered = [...bills];

//     // Apply search filter
//     if (searchTerm) {
//       filtered = filtered.filter(bill => 
//         bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         bill.tableName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         bill.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         bill.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         bill.tableNumber?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Apply status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter(bill => bill.status === statusFilter);
//     }

//     // Apply payment filter
//     if (paymentFilter !== "all") {
//       filtered = filtered.filter(bill => bill.paymentStatus === paymentFilter);
//     }

//     // Apply sorting
//     filtered.sort((a, b) => {
//       const amountA = a.amount || a.totalAmount || 0;
//       const amountB = b.amount || b.totalAmount || 0;
      
//       switch (sortBy) {
//         case "newest":
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         case "oldest":
//           return new Date(a.createdAt) - new Date(b.createdAt);
//         case "highest":
//           return amountB - amountA;
//         case "lowest":
//           return amountA - amountB;
//         default:
//           return 0;
//       }
//     });

//     setFilteredBills(filtered);
//   }, [bills, searchTerm, statusFilter, paymentFilter, sortBy]);

//   /* LOAD ONCE */
//   useEffect(() => {
//     fetchBills();
//   }, []);

//   /* ================= PAYMENT ================= */
//   const handlePay = async (id, method) => {
//     try {
//       setPayingId(id);
//       await apiPatch(`/billing/pay/${id}`, { method });
//       await fetchBills(); // refresh list
//     } catch (err) {
//       console.error("Payment failed:", err);
//     } finally {
//       setPayingId(null);
//     }
//   };

//   /* ================= PRINT BILL ================= */
//   const handlePrint = async (billId) => {
//     try {
//       setPrintingId(billId);
      
//       // Fetch bill details for printing
//       const res = await apiGet(`/billing/print/${billId}`);
//       const billData = res.data.data;
      
//       if (!billData) {
//         throw new Error("No bill data received");
//       }

//       // Create a new window for printing
//       const printWindow = window.open('', '_blank');
//       if (!printWindow) {
//         alert("Please allow pop-ups to print bills");
//         return;
//       }

//       // Generate print content
//       const printContent = generatePrintContent(billData);
      
//       // Write content to new window
//       printWindow.document.write(printContent);
//       printWindow.document.close();
      
//       // Wait for content to load then print
//       printWindow.onload = function() {
//         printWindow.focus();
//         printWindow.print();
//         printWindow.onafterprint = function() {
//          setTimeout(() => {
//     printWindow.close();
//   }, 500);
//         };
//       };

//       // Update print status in backend (optional)
//       await apiPatch(`/billing/printed/${billId}`);
      
//     } catch (err) {
//       console.error("Print failed:", err);
//       alert("Printing failed: " + (err.message || "Unknown error"));
//     } finally {
//       setPrintingId(null);
//     }
//   };

//   /* ================= GENERATE PRINT CONTENT ================= */
//   const generatePrintContent = (bill) => {
//     const items = bill.items || [];
//     const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0);
//     const total = bill.totalAmount || bill.amount || subtotal;
//     const date = new Date(bill.createdAt || new Date());
    
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Bill - ${bill.billNumber || 'N/A'}</title>
//         <style>
//           body {
//             font-family: 'Courier New', monospace;
//             margin: 0;
//             padding: 20px;
//             background: white;
//             font-size: 12px;
//           }
//           .bill-container {
//             max-width: 80mm;
//             margin: 0 auto;
//             padding: 10px;
//           }
//           .header {
//             text-align: center;
//             margin-bottom: 20px;
//             padding-bottom: 10px;
//             border-bottom: 1px dashed #333;
//           }
//           .header h1 {
//             font-size: 18px;
//             margin: 0;
//             font-weight: bold;
//           }
//           .header h2 {
//             font-size: 16px;
//             margin: 5px 0;
//             color: #444;
//           }
//           .header p {
//             margin: 3px 0;
//             font-size: 11px;
//           }
//           .bill-details {
//             margin-bottom: 15px;
//             padding: 5px 0;
//             border-bottom: 1px dashed #333;
//           }
//           .bill-details div {
//             display: flex;
//             justify-content: space-between;
//             margin: 3px 0;
//           }
//           .items-table {
//             width: 100%;
//             margin-bottom: 15px;
//           }
//           .items-table th {
//             text-align: left;
//             border-bottom: 1px solid #333;
//             padding: 5px 0;
//           }
//           .items-table td {
//             padding: 3px 0;
//           }
//           .items-table .item-name {
//             max-width: 120px;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             white-space: nowrap;
//           }
//           .items-table .text-right {
//             text-align: right;
//           }
//           .items-table .text-center {
//             text-align: center;
//           }
//           .summary {
//             margin-top: 15px;
//             padding-top: 10px;
//             border-top: 1px dashed #333;
//           }
//           .summary div {
//             display: flex;
//             justify-content: space-between;
//             margin: 5px 0;
//           }
//           .grand-total {
//             font-weight: bold;
//             font-size: 14px;
//             margin-top: 10px;
//             padding-top: 10px;
//             border-top: 2px solid #333;
//           }
//           .footer {
//             text-align: center;
//             margin-top: 30px;
//             padding-top: 10px;
//             border-top: 1px dashed #333;
//           }
//           .text-green { color: #059669; }
//           .text-right { text-align: right; }
//           .text-center { text-align: center; }
//           .font-bold { font-weight: bold; }
//           .restaurant-name {
//             font-size: 20px;
//             font-weight: bold;
//             margin-bottom: 5px;
//           }
//           @media print {
//             body { margin: 0; }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="bill-container">
//           <!-- Restaurant Header -->
//           <div class="header">
//             <div class="restaurant-name">🍽️ FRANCHISE RESTAURANT</div>
//             <h2>${bill.franchiseName || 'Your Restaurant Name'}</h2>
//             <p>123 Food Street, City - 400001</p>
//             <p>Tel: +91 98765 43210 | GST: 22AAAAA0000A1Z5</p>
//           </div>

//           <!-- Bill Details -->
//           <div class="bill-details">
//             <div>
//               <span>Bill No:</span>
//               <span class="font-bold">${bill.billNumber || 'N/A'}</span>
//             </div>
//             <div>
//               <span>Date:</span>
//               <span>${date.toLocaleDateString()}</span>
//             </div>
//             <div>
//               <span>Time:</span>
//               <span>${date.toLocaleTimeString()}</span>
//             </div>
//             <div>
//               <span>Table:</span>
//               <span>${bill.tableNumber || bill.tableName || (bill.tableId ? bill.tableId.slice(-4) : 'N/A')}</span>
//             </div>
//             <div>
//               <span>Guest:</span>
//               <span>${bill.guestName || 'Guest'}</span>
//             </div>
//             <div>
//               <span>Staff:</span>
//               <span>${bill.staffName || bill.generatedBy ? (bill.generatedBy?.slice(-6) || 'N/A') : 'N/A'}</span>
//             </div>
//           </div>

//           <!-- Items Table -->
//           <table class="items-table">
//             <thead>
//               <tr>
//                 <th>Item</th>
//                 <th class="text-center">Qty</th>
//                 <th class="text-right">Price</th>
//                 <th class="text-right">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${items.map(item => `
//                 <tr>
//                   <td class="item-name">${item.name || 'Item'}</td>
//                   <td class="text-center">${item.qty || 0}</td>
//                   <td class="text-right">₹${(item.price || 0).toFixed(2)}</td>
//                   <td class="text-right">₹${((item.price || 0) * (item.qty || 0)).toFixed(2)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>

//           <!-- Summary -->
//           <div class="summary">
//             <div>
//               <span>Subtotal:</span>
//               <span>₹${subtotal.toFixed(2)}</span>
//             </div>
//             ${bill.taxAmount ? `
//               <div>
//                 <span>Tax (GST):</span>
//                 <span>₹${Number(bill.taxAmount).toFixed(2)}</span>
//               </div>
//             ` : ''}
//             ${bill.discountAmount ? `
//               <div class="text-green">
//                 <span>Discount:</span>
//                 <span>-₹${Number(bill.discountAmount).toFixed(2)}</span>
//               </div>
//             ` : ''}
//             <div class="grand-total">
//               <span>TOTAL:</span>
//               <span>₹${total.toFixed(2)}</span>
//             </div>
//           </div>

//           <!-- Payment Details -->
//           <div class="bill-details" style="margin-top: 10px;">
//             <div>
//               <span>Payment Method:</span>
//               <span class="font-bold">${(bill.paymentMethod || 'N/A').toUpperCase()}</span>
//             </div>
//             <div>
//               <span>Payment Status:</span>
//               <span class="font-bold ${bill.paymentStatus === 'paid' || bill.paymentStatus === 'completed' ? 'text-green' : ''}">
//                 ${(bill.paymentStatus || bill.status || 'N/A').toUpperCase()}
//               </span>
//             </div>
//           </div>

//           <!-- Footer -->
//           <div class="footer">
//             <p class="font-bold">Thank You! Visit Again</p>
//             <p style="font-size: 10px; margin-top: 5px;">*** This is a computer generated bill ***</p>
//             <p style="font-size: 9px; margin-top: 3px;">Bill ID: ${bill._id || ''}</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   /* ================= PREVIEW BILL ================= */
//   const handlePreview = (bill) => {
//     setPreviewBill(bill);
//     setPreviewTab(bill.tabId);
//   };

//   /* ================= GET STATUS BADGE ================= */
//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "paid":
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Paid</span>;
//       case "generated":
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Generated</span>;
//       case "cancelled":
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Cancelled</span>;
//       default:
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{status}</span>;
//     }
//   };

//   /* ================= GET PAYMENT BADGE ================= */
//   const getPaymentBadge = (status) => {
//     switch (status) {
//       case "pending":
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">Pending</span>;
//       case "completed":
//       case "paid":
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</span>;
//       default:
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{status}</span>;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
      
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-primary-50 rounded-lg">
//                 <Receipt size={24} className="text-primary-600" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-semibold text-gray-900">Billing</h1>
//                 <p className="text-sm text-gray-500">Manage and process customer payments</p>
//               </div>
//             </div>

//             <button
//               onClick={fetchBills}
//               disabled={loading}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
//               {loading ? "Refreshing..." : "Refresh"}
//             </button>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-sm text-gray-600 mb-1">Total Bills</p>
//               <p className="text-2xl font-semibold text-gray-900">{stats.totalBills}</p>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
//               <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
//               <p className="text-2xl font-semibold text-gray-900">{stats.pendingPayments}</p>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-sm text-gray-600 mb-1">Completed</p>
//               <p className="text-2xl font-semibold text-gray-900">{stats.completedPayments}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="p-6">
        
//         {/* Filters */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4">
            
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search by bill number, table, guest..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
//               />
//             </div>

//             {/* Filter Toggle */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               <Filter size={16} />
//               Filters
//               {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </button>

//             {/* Export */}
//             <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
//               <Download size={16} />
//               Export
//             </button>
//           </div>

//           {/* Advanced Filters */}
//           {showFilters && (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              
//               {/* Status Filter */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Bill Status</label>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="paid">Paid</option>
//                   <option value="generated">Generated</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               </div>

//               {/* Payment Filter */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Payment Status</label>
//                 <select
//                   value={paymentFilter}
//                   onChange={(e) => setPaymentFilter(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 >
//                   <option value="all">All Payments</option>
//                   <option value="pending">Pending</option>
//                   <option value="completed">Completed</option>
//                   <option value="paid">Paid</option>
//                 </select>
//               </div>

//               {/* Sort By */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Sort By</label>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 >
//                   <option value="newest">Newest First</option>
//                   <option value="oldest">Oldest First</option>
//                   <option value="highest">Highest Amount</option>
//                   <option value="lowest">Lowest Amount</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {/* Results count */}
//           <div className="mt-4 text-sm text-gray-500">
//             Showing <span className="font-medium text-gray-700">{filteredBills.length}</span> bills
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center items-center py-20">
//             <Loader2 size={32} className="animate-spin text-primary-600" />
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && filteredBills.length === 0 && (
//           <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//             <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
//             <p className="text-sm text-gray-500 mb-6">
//               {searchTerm || statusFilter !== "all" || paymentFilter !== "all" 
//                 ? "Try adjusting your filters" 
//                 : "No bills have been generated yet"}
//             </p>
//             {(searchTerm || statusFilter !== "all" || paymentFilter !== "all") && (
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setStatusFilter("all");
//                   setPaymentFilter("all");
//                   setSortBy("newest");
//                 }}
//                 className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         )}

//         {/* Table */}
//         {!loading && filteredBills.length > 0 && (
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Bill Details
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Table/Guest
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Payment
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredBills.map((bill) => (
//                     <tr key={bill._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">{bill.billNumber}</div>
//                             <div className="text-xs text-gray-500">
//                               {new Date(bill.createdAt).toLocaleDateString()} • {new Date(bill.createdAt).toLocaleTimeString()}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{bill.tableName || bill.tableNumber || "Walk-in"}</div>
//                         <div className="text-xs text-gray-500">{bill.guestName || "Guest"}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getStatusBadge(bill.status)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">₹{(bill.amount || bill.totalAmount || 0).toLocaleString()}</div>
//                         <div className="text-xs text-gray-500">{bill.items?.length || 0} items</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getPaymentBadge(bill.paymentStatus)}
//                         {bill.paymentMethod && (
//                           <div className="text-xs text-gray-500 mt-1 capitalize">{bill.paymentMethod}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right">
//                         <div className="flex justify-end gap-2">
//                           {/* Preview Button */}
//                           <button
//                             onClick={() => handlePreview(bill)}
//                             className="p-1 text-gray-400 hover:text-primary-600 rounded"
//                             title="Preview Bill"
//                           >
//                             <Eye size={18} />
//                           </button>

//                           {/* Print Button - Show for all bills (optional: only for paid ones) */}
//                           <button
//                             onClick={() => handlePrint(bill._id)}
//                             disabled={printingId === bill._id}
//                             className={`p-1 rounded transition-colors ${
//                               printingId === bill._id 
//                                 ? 'text-gray-400 cursor-wait' 
//                                 : 'text-gray-400 hover:text-green-600'
//                             }`}
//                             title="Print Bill"
//                           >
//                             {printingId === bill._id ? (
//                               <Loader2 size={18} className="animate-spin" />
//                             ) : (
//                               <Printer size={18} />
//                             )}
//                           </button>
                          
//                           {/* Payment Buttons - Only for pending bills */}
//                           {bill.status !== "paid" && bill.paymentStatus !== "paid" && bill.paymentStatus !== "completed" && (
//                             <>
//                               <button
//                                 onClick={() => handlePay(bill._id, "cash")}
//                                 disabled={payingId === bill._id}
//                                 className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50"
//                               >
//                                 Cash
//                               </button>
//                               <button
//                                 onClick={() => handlePay(bill._id, "card")}
//                                 disabled={payingId === bill._id}
//                                 className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
//                               >
//                                 Card
//                               </button>
//                               <button
//                                 onClick={() => handlePay(bill._id, "upi")}
//                                 disabled={payingId === bill._id}
//                                 className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 disabled:opacity-50"
//                               >
//                                 UPI
//                               </button>
//                             </>
//                           )}
                          
//                           {/* Loading indicator for payment */}
//                           {payingId === bill._id && (
//                             <Loader2 size={16} className="animate-spin text-gray-400" />
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Preview Modal */}
//       <BillingPreviewModal
//         open={!!previewTab}
//         tabId={previewTab}
//         billData={previewBill}
//         onClose={() => {
//           setPreviewTab(null);
//           setPreviewBill(null);
//         }}
//       />
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { 
  RefreshCcw, 
  Eye, 
  Search,
  Filter,
  Download,
  Printer,
  Clock,
  Calendar,
  CreditCard,
  Wallet,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Receipt,
  Hash,
  User,
  MoreHorizontal,
  ArrowUpDown,
  Loader2,
  CheckCircle2,
  CircleDollarSign,
  PrinterCheck,
  Building2,
  MapPin,
  Shield,
  Store,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import React  from "react";
import { apiGet, apiPatch } from "../../../services/apiHelpers";
import BillingPreviewModal from "../components/BillingPreviewModal";

export default function BillingScreen() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [printingId, setPrintingId] = useState(null);
  const [previewTab, setPreviewTab] = useState(null);
  const [previewBill, setPreviewBill] = useState(null);
  const [expandedBill, setExpandedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Stats
  const [stats, setStats] = useState({
    totalBills: 0,
    totalRevenue: 0,
    paidCount: 0,
    pendingCount: 0,
    printedCount: 0
  });

  /* ================= FETCH BILLS ================= */
  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await apiGet("/billing");
      const billsData = res.data.data || [];
      setBills(billsData);
      setFilteredBills(billsData);
      calculateStats(billsData);
    } catch (err) {
      console.error("Billing fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CALCULATE STATS ================= */
  const calculateStats = (billsData) => {
    const totalRevenue = billsData.reduce((sum, bill) => sum + (bill.amount || bill.totalAmount || 0), 0);
    const paidCount = billsData.filter(bill => bill.status === 'paid' || bill.paymentStatus === 'paid' || bill.paymentStatus === 'completed').length;
    const pendingCount = billsData.filter(bill => bill.paymentStatus === "pending").length;
    const printedCount = billsData.filter(bill => bill.printStatus === 'printed').length;
    
    setStats({
      totalBills: billsData.length,
      totalRevenue,
      paidCount,
      pendingCount,
      printedCount
    });
  };

  /* ================= FILTER AND SORT ================= */
  useEffect(() => {
    let filtered = [...bills];

    // Apply search filter
    if (searchTerm) {
      const searchString = searchTerm.toLowerCase();
      filtered = filtered.filter(bill => 
        bill.billNumber?.toLowerCase().includes(searchString) ||
        bill.tableName?.toLowerCase().includes(searchString) ||
        bill.guestName?.toLowerCase().includes(searchString) ||
        bill.staffName?.toLowerCase().includes(searchString) ||
        bill.tableNumber?.toLowerCase().includes(searchString) ||
        bill.franchiseName?.toLowerCase().includes(searchString)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(bill => bill.status === statusFilter);
    }

    // Apply payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(bill => bill.paymentStatus === paymentFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const amountA = a.amount || a.totalAmount || 0;
      const amountB = b.amount || b.totalAmount || 0;
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      switch (sortBy) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "highest":
          return amountB - amountA;
        case "lowest":
          return amountA - amountB;
        default:
          return 0;
      }
    });

    setFilteredBills(filtered);
    calculateStats(filtered);
    setCurrentPage(1);
  }, [bills, searchTerm, statusFilter, paymentFilter, sortBy]);

  /* LOAD ONCE */
  useEffect(() => {
    fetchBills();
  }, []);

  /* ================= PAYMENT ================= */
  const handlePay = async (id, method) => {
    try {
      setPayingId(id);
      await apiPatch(`/billing/pay/${id}`, { method });
      await fetchBills();
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setPayingId(null);
    }
  };

  /* ================= PRINT BILL ================= */
  const handlePrint = async (billId) => {
    try {
      setIsPrinting(true);
      setPrintingId(billId);
      
      const res = await apiGet(`/billing/print/${billId}`);
      const billData = res.data.data;
      
      if (!billData) {
        throw new Error("No bill data received");
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Please allow pop-ups to print bills");
        setIsPrinting(false);
        setPrintingId(null);
        return;
      }

      const printContent = generatePrintContent(billData);
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = function() {
          setTimeout(() => {
            printWindow.close();
          }, 500);
        };
      };

      await apiPatch(`/billing/printed/${billId}`);
      await fetchBills();
      
    } catch (err) {
      console.error("Print failed:", err);
      alert("Printing failed: " + (err.message || "Unknown error"));
    } finally {
      setIsPrinting(false);
      setPrintingId(null);
    }
  };

  /* ================= GENERATE PRINT CONTENT ================= */
  const generatePrintContent = (bill) => {
    const items = bill.items || [];
    const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0);
    const total = bill.totalAmount || bill.amount || subtotal;
    const date = new Date(bill.createdAt || new Date());
    const franchise = bill.franchise || {};
    
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
          .staff-info {
            font-size: 10px;
            color: #666;
            margin-top: 5px;
            text-align: center;
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
          <div class="header">
            <h1> ${franchise.name || bill.franchiseName || 'Restaurant'}</h1>
            <div class="franchise-code">Branch: ${franchise.franchiseCode || bill.franchiseCode || 'MAIN'}</div>
            <p>${franchise.address || '123 Food Street'}</p>
            <p>${franchise.city || 'City'}, ${franchise.state || 'State'}</p>
            <p>Tel: ${franchise.phone || '+91 98765 43210'}</p>
          </div>

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
          </div>

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

          <div class="summary">
            <div>
              <span>Subtotal:</span>
              <span>₹${subtotal.toFixed(2)}</span>
            </div>
            ${bill.taxAmount ? `
              <div>
                <span>Tax:</span>
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

          <div class="bill-details" style="margin-top: 10px;">
            <div>
              <span>Payment:</span>
              <span class="font-bold">${(bill.paymentMethod || 'N/A').toUpperCase()}</span>
            </div>
            <div>
              <span>Status:</span>
              <span class="font-bold ${bill.paymentStatus === 'paid' || bill.paymentStatus === 'completed' ? 'text-green' : ''}">
                ${(bill.paymentStatus || bill.status || 'N/A').toUpperCase()}
              </span>
            </div>
          </div>

          <div class="staff-info">
            Processed by: ${bill.staffName || 'Staff'} • ID: ${bill.generatedBy?.slice(-6) || 'N/A'}
          </div>

          <div class="footer">
            <p class="font-bold">Thank You! Visit Again</p>
            <p style="font-size: 10px;">*** This is a computer generated bill ***</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  /* ================= PREVIEW BILL ================= */
  const handlePreview = (bill) => {
    setPreviewBill(bill);
    setPreviewTab(bill.tabId);
  };

  /* ================= GET PAYMENT DETAILS ================= */
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

  /* ================= GET STATUS DETAILS ================= */
  const getStatusDetails = (status, paymentStatus) => {
    const effectiveStatus = paymentStatus === 'paid' || paymentStatus === 'completed' || status === 'paid' ? 'paid' : 
                           (paymentStatus === 'pending' ? 'pending' : status);
    
    switch(effectiveStatus) {
      case 'paid':
        return { 
          color: 'text-emerald-700', 
          bg: 'bg-emerald-50', 
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
          label: 'Paid'
        };
      case 'pending':
        return { 
          color: 'text-amber-700', 
          bg: 'bg-amber-50', 
          dot: 'bg-amber-500',
          icon: Clock,
          label: 'Pending'
        };
      case 'generated':
        return { 
          color: 'text-blue-700', 
          bg: 'bg-blue-50', 
          dot: 'bg-blue-500',
          icon: FileText,
          label: 'Generated'
        };
      default:
        return { 
          color: 'text-slate-700', 
          bg: 'bg-slate-50', 
          dot: 'bg-slate-500',
          icon: AlertCircle,
          label: paymentStatus || status || 'Unknown'
        };
    }
  };

  /* ================= GET PRINT STATUS DETAILS ================= */
  const getPrintStatusDetails = (printStatus) => {
    switch(printStatus?.toLowerCase()) {
      case 'printed':
        return {
          icon: PrinterCheck,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          dot: 'bg-emerald-500',
          label: 'Printed'
        };
      case 'pending':
      default:
        return {
          icon: Printer,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          dot: 'bg-amber-500',
          label: 'Pending'
        };
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-indigo-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                    Billing Dashboard
                  </h1>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                    OWNER
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Manage and process customer payments
                </p>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchBills}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-indigo-600" />
              <p className="text-xs text-slate-500">Total Bills</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.totalBills}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <p className="text-xs text-slate-500">Total Revenue</p>
            </div>
            <p className="text-2xl font-bold text-indigo-600">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <p className="text-xs text-slate-500">Paid</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{stats.paidCount}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <p className="text-xs text-slate-500">Pending</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.pendingCount}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <PrinterCheck className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-slate-500">Printed</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.printedCount}</p>
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
                placeholder="Search by bill number, table, guest, staff..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Filter size={16} />
              Filters
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Export */}
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
              <Download size={16} />
              Export
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200">
              
              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Bill Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="generated">Generated</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Payment Status</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>

              {/* Items Per Page */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Show</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="mt-4 text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{filteredBills.length}</span> bills
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBills.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-16 text-center shadow-xl">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No bills found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || paymentFilter !== "all" 
                ? "Try adjusting your filters to see more results" 
                : "No bills have been generated yet"}
            </p>
            {(searchTerm || statusFilter !== "all" || paymentFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPaymentFilter("all");
                  setSortBy("newest");
                }}
                className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!loading && filteredBills.length > 0 && (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="px-4 py-4 text-left">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bill Details</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Table/Guest</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Print</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</span>
                      </th>
                      <th className="px-4 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBills.map((bill) => {
                      const isExpanded = expandedBill === bill._id;
                      const PaymentIcon = getPaymentDetails(bill.paymentMethod).icon;
                      const statusDetails = getStatusDetails(bill.status, bill.paymentStatus);
                      const printStatusDetails = getPrintStatusDetails(bill.printStatus);
                      const PrintStatusIcon = printStatusDetails.icon;
                      const StatusIcon = statusDetails.icon;
                      const totalQty = bill.items?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0;
                      
                      return (
                        <React.Fragment key={bill._id}>
                          {/* Main Bill Row */}
                          <tr 
                            className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer ${
                              isExpanded ? 'bg-indigo-50/30' : ''
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
                              <div className="flex flex-col items-center">
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
                                  <span className="text-sm font-medium text-slate-700">
                                    {bill.tableName || bill.tableNumber || 'Walk-in'}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500 mt-1">{bill.guestName || 'Guest'}</span>
                              </div>
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <div className="flex flex-col items-center">
                                <span className="font-medium text-slate-900">{bill.items?.length || 0}</span>
                                <span className="text-xs text-slate-400">({totalQty} qty)</span>
                              </div>
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <span className="font-bold text-indigo-600">
                                ₹{(bill.amount || bill.totalAmount || 0).toLocaleString()}
                              </span>
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <PaymentIcon className={`w-3.5 h-3.5 ${getPaymentDetails(bill.paymentMethod).color}`} />
                                <span className="text-sm capitalize text-slate-600">
                                  {bill.paymentMethod || 'N/A'}
                                </span>
                              </div>
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
                              <div className="flex items-center justify-center gap-1">
                                {/* Preview Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreview(bill);
                                  }}
                                  className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600"
                                  title="Preview Bill"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {/* Print Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrint(bill._id);
                                  }}
                                  disabled={isPrinting || printingId === bill._id}
                                  className={`p-2 rounded-lg transition-colors ${
                                    printingId === bill._id
                                      ? 'text-slate-400 cursor-wait'
                                      : bill.printStatus === 'printed'
                                        ? 'hover:bg-purple-100 text-purple-600'
                                        : 'hover:bg-green-100 text-green-600'
                                  }`}
                                  title={bill.printStatus === 'printed' ? "Reprint Bill" : "Print Bill"}
                                >
                                  {printingId === bill._id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Printer className="w-4 h-4" />
                                  )}
                                </button>

                                {/* Payment Buttons - Only for pending bills */}
                                {bill.status !== "paid" && bill.paymentStatus !== "paid" && bill.paymentStatus !== "completed" && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePay(bill._id, "cash");
                                      }}
                                      disabled={payingId === bill._id}
                                      className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                      Cash
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePay(bill._id, "card");
                                      }}
                                      disabled={payingId === bill._id}
                                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                                    >
                                      Card
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePay(bill._id, "upi");
                                      }}
                                      disabled={payingId === bill._id}
                                      className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 disabled:opacity-50"
                                    >
                                      UPI
                                    </button>
                                  </>
                                )}

                                {/* Expand/Collapse Button */}
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
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Row - Items and Details */}
                          {isExpanded && (
                            <tr className="bg-slate-50">
                              <td colSpan="9" className="px-4 py-4">
                                <div className="space-y-4">
                                  {/* Items Section */}
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-indigo-600" />
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
                                              <td className="px-4 py-2 text-right font-medium text-indigo-600">
                                                ₹{((item.price || 0) * (item.qty || 0)).toFixed(2)}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-center py-8 bg-white rounded-xl border border-slate-200">
                                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
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
                                            ₹{(bill.subTotal || 0).toFixed(2)}
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
                                          <span className="text-lg text-indigo-600">₹{(bill.totalAmount || bill.amount || 0).toFixed(2)}</span>
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
                                          {bill.staffName || bill.generatedBy?.slice(-6) || 'N/A'}
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
                                ? 'bg-indigo-600 text-white'
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

            {/* Summary Footer */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Paid: {stats.paidCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Pending: {stats.pendingCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Printed: {stats.printedCount}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">
                    Total Revenue: <span className="font-bold text-indigo-600">₹{stats.totalRevenue.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Preview Modal */}
      <BillingPreviewModal
        open={!!previewTab}
        tabId={previewTab}
        billData={previewBill}
        onClose={() => {
          setPreviewTab(null);
          setPreviewBill(null);
        }}
      />
    </div>
  );
}