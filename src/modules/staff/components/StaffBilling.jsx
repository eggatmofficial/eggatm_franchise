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
  PrinterCheck,
  Filter,
  X
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
  
  // Mobile filter drawer state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
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
      
      const res = await apiGet(`/billing/print/${billId}`);
      const billData = res.data.data;
      
      if (!billData) {
        throw new Error("No bill data received");
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Please allow pop-ups to print bills");
        setIsPrinting(false);
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
    
    const franchise = bill.franchise || {};
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill - ${bill.billNumber || 'N/A'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 10px;
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
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #333;
          }
          .header h1 {
            font-size: 16px;
            margin: 0;
            font-weight: bold;
          }
          .header .franchise-code {
            font-size: 9px;
            color: #666;
            margin: 2px 0;
          }
          .header p {
            margin: 3px 0;
            font-size: 10px;
          }
          .bill-details {
            margin-bottom: 12px;
            padding: 5px 0;
            border-bottom: 1px dashed #333;
          }
          .bill-details div {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
            font-size: 11px;
          }
          .items-table {
            width: 100%;
            margin-bottom: 12px;
            font-size: 11px;
          }
          .items-table th {
            text-align: left;
            border-bottom: 1px solid #333;
            padding: 4px 0;
          }
          .items-table td {
            padding: 3px 0;
          }
          .items-table .item-name {
            max-width: 100px;
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
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px dashed #333;
          }
          .summary div {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
            font-size: 11px;
          }
          .grand-total {
            font-weight: bold;
            font-size: 13px;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 2px solid #333;
          }
          .print-status {
            text-align: center;
            margin: 8px 0;
            padding: 4px;
            background: #f3f4f6;
            border-radius: 4px;
            font-size: 9px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 8px;
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
            font-size: 8px;
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
            body { margin: 0; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="bill-container">
          <div class="header">
            <h1> ${franchise.name || 'My Restaurant'}</h1>
            <div class="franchise-code">Branch: ${franchise.franchiseCode || 'MAIN'}</div>
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

          <div class="bill-details" style="margin-top: 8px;">
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

          <div class="footer">
            <p class="font-bold">Thank You! Visit Again</p>
            <p style="font-size: 9px; margin-top: 4px;">*** This is a computer generated bill ***</p>
            <p style="font-size: 7px; margin-top: 2px;">Printed on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

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

  const filteredBills = bills.filter(bill => {
    if (filter !== "all" && bill.status !== filter) return false;
    
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

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const totalAmount = filteredBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
  const totalItems = filteredBills.reduce((sum, bill) => sum + (bill.items?.length || 0), 0);
  const paidCount = filteredBills.filter(b => b.status === 'paid').length;
  const pendingCount = filteredBills.filter(b => {
    const status = (b.status || '').toLowerCase();
    const paymentStatus = (b.paymentStatus || '').toLowerCase();
    return status.includes('pend') || paymentStatus.includes('pend');
  }).length;
  const printedCount = filteredBills.filter(b => b.printStatus === 'printed').length;

  const clearFilters = () => {
    setFilter("all");
    setDateFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="relative">
          <div className="w-16 sm:w-20 h-16 sm:h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Receipt className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">

        {/* Header Section - Responsive */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Title and Branch Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                <Receipt className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                  Billing
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Manage and track bills
                </p>
              </div>
            </div>

            {/* Franchise Info - Mobile Optimized */}
            {franchiseInfo?.currentFranchise && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg sm:rounded-xl">
                    <Building2 className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500">Current Branch</p>
                    <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                      {franchiseInfo.currentFranchise.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {franchiseInfo.currentFranchise.address}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats - Responsive Grid */}
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-2 sm:px-4 py-2 bg-blue-50 rounded-lg sm:rounded-xl text-center">
              <p className="text-xs text-blue-600">Total</p>
              <p className="text-base sm:text-lg font-bold text-blue-700">{filteredBills.length}</p>
            </div>
            <div className="px-2 sm:px-4 py-2 bg-emerald-50 rounded-lg sm:rounded-xl text-center">
              <p className="text-xs text-emerald-600">Paid</p>
              <p className="text-base sm:text-lg font-bold text-emerald-700">{paidCount}</p>
            </div>
            <div className="px-2 sm:px-4 py-2 bg-purple-50 rounded-lg sm:rounded-xl text-center">
              <p className="text-xs text-purple-600">Printed</p>
              <p className="text-base sm:text-lg font-bold text-purple-700">{printedCount}</p>
            </div>
          </div>
        </div>

        {/* Filters Bar - Responsive */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-lg">
          
          {/* Mobile Filter Button and Search */}
          <div className="flex sm:hidden gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex flex-col lg:flex-row gap-4">
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

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 sm:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
            />
            
            {/* Drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Status</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="generated">Generated</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Date Range</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Items Per Page</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Section */}
        {filteredBills.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200 p-8 sm:p-16 text-center shadow-xl">
            <div className="w-16 sm:w-24 h-16 sm:h-24 bg-slate-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Receipt className="w-8 sm:w-12 h-8 sm:h-12 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No bills found</h3>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
              {searchTerm || filter !== "all" || dateFilter !== "all" 
                ? "Try adjusting your filters to see more results" 
                : "You haven't generated any bills yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View (Visible on small screens) */}
            <div className="block sm:hidden space-y-3">
              {currentBills.map((bill) => {
                const isExpanded = expandedBill === bill._id;
                const PaymentIcon = getPaymentDetails(bill.paymentMethod).icon;
                const statusDetails = getStatusDetails(bill.status);
                const printStatusDetails = getPrintStatusDetails(bill.printStatus);
                const PrintStatusIcon = printStatusDetails.icon;
                const totalQty = bill.items?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0;
                
                return (
                  <div key={bill._id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Bill Card Header */}
                    <div 
                      className="p-3 cursor-pointer"
                      onClick={() => setExpandedBill(isExpanded ? null : bill._id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${statusDetails.bg} rounded-lg flex items-center justify-center`}>
                            <statusDetails.icon className={`w-4 h-4 ${statusDetails.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
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
                        <button className="p-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Table2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-600">Table:</span>
                          <span className="font-medium text-slate-900">{bill.tableNumber || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-600">Items:</span>
                          <span className="font-medium text-slate-900">{bill.items?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CircleDollarSign className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-600">Total:</span>
                          <span className="font-bold text-blue-600">₹{(bill.totalAmount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-600 text-xs">
                            {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusDetails.bg} ${statusDetails.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDetails.dot}`}></span>
                            {statusDetails.label}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${printStatusDetails.bg} ${printStatusDetails.color}`}>
                            <PrintStatusIcon className="w-3 h-3" />
                            {printStatusDetails.label}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrint(bill._id);
                          }}
                          disabled={isPrinting || bill.status !== "paid"}
                          className={`p-2 rounded-lg transition-colors ${
                            bill.status === "paid" 
                              ? bill.printStatus === 'printed'
                                ? 'bg-purple-100 text-purple-600'
                                : 'bg-green-100 text-green-600'
                              : 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                          }`}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content for Mobile */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50 p-3">
                        {/* Items Section */}
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          Ordered Items
                        </h4>

                        {bill.items && bill.items.length > 0 ? (
                          <div className="space-y-2 mb-3">
                            {bill.items.map((item, idx) => (
                              <div key={idx} className="bg-white rounded-lg p-2 border border-slate-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-medium text-slate-900">{item.name || 'N/A'}</span>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                      <span>Qty: {item.qty || 0}</span>
                                      <span>Price: ₹{(item.price || 0).toFixed(2)}</span>
                                    </div>
                                  </div>
                                  <span className="font-medium text-blue-600">
                                    ₹{((item.price || 0) * (item.qty || 0)).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-4 text-slate-500">No items found</p>
                        )}

                        {/* Summary for Mobile */}
                        <div className="bg-white rounded-xl border border-slate-200 p-3">
                          <h5 className="font-medium text-slate-900 mb-2">Bill Summary</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Subtotal</span>
                              <span className="font-medium text-slate-700">
                                ₹{(bill.subTotal || (bill.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0) || 0)).toFixed(2)}
                              </span>
                            </div>
                            {bill.taxAmount > 0 && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Tax</span>
                                <span className="font-medium text-slate-700">₹{(bill.taxAmount || 0).toFixed(2)}</span>
                              </div>
                            )}
                            {bill.discountAmount > 0 && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Discount</span>
                                <span className="font-medium text-emerald-600">-₹{(bill.discountAmount || 0).toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-semibold pt-2 border-t border-slate-200">
                              <span className="text-slate-900">Grand Total</span>
                              <span className="text-lg text-blue-600">₹{(bill.totalAmount || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Hidden on small screens) */}
            <div className="hidden sm:block bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] lg:min-w-0">
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

                          {/* Expanded Row for Desktop */}
                          {isExpanded && (
                            <tr className="bg-slate-50">
                              <td colSpan="11" className="px-4 py-4">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                      <Package className="w-4 h-4 text-blue-600" />
                                      Ordered Items
                                    </h4>
                                    <span className="text-xs bg-white px-2 py-1 rounded-full border border-slate-200">
                                      {bill.items?.length || 0} items
                                    </span>
                                  </div>

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

            {/* Pagination - Responsive */}
            {filteredBills.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm text-slate-500">
                    Showing <span className="font-medium text-slate-900">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium text-slate-900">
                      {Math.min(indexOfLastItem, filteredBills.length)}
                    </span>{' '}
                    of <span className="font-medium text-slate-900">{filteredBills.length}</span> bills
                  </p>

                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-3 sm:w-4 h-3 sm:h-4" />
                      <span className="hidden xs:inline">Previous</span>
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
                              className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-colors
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
                            <span key={i} className="px-1 text-slate-400 text-xs sm:text-sm">
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
                      className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="hidden xs:inline">Next</span>
                      <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Footer - Responsive */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-lg">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm text-slate-600">Paid: {paidCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm text-slate-600">Printed: {printedCount}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-xs sm:text-sm text-slate-500">
                    Items: <span className="font-bold text-slate-900">{totalItems}</span>
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500">
                    Total: <span className="font-bold text-blue-600">₹{totalAmount.toFixed(2)}</span>
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