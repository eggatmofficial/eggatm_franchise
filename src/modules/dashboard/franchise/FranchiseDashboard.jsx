

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFranchiseDashboard } from "../dashboardSlice";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Package, 
  Star,
  Clock,
  BarChart3,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const FranchiseDashboard = () => {
  const dispatch = useDispatch();
  const { franchiseStats, loading } = useSelector((state) => state.dashboard);
  
  const [filter, setFilter] = useState("today");
  const [isCustom, setIsCustom] = useState(false);
  const [customDate, setCustomDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

useEffect(() => {
  if (!isCustom) {
    dispatch(fetchFranchiseDashboard({ type: filter }));
  }
}, [dispatch, filter, isCustom]);

const applyCustomFilter = () => {
  if (!customDate.startDate || !customDate.endDate) {
    alert("Please select both dates");
    return;
  }

  setIsCustom(true);

  dispatch(
    fetchFranchiseDashboard({
      startDate: customDate.startDate,
      endDate: customDate.endDate,
    })
  );

  setShowCustomDate(false);
  setShowMobileFilter(false);
};

  const summary = franchiseStats.summary || {};
  const today = franchiseStats.today || {};
  const products = franchiseStats.products || {};

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const getFilterLabel = () => {
    const labels = {
      today: "Today",
      yesterday: "Yesterday",
      monthly: "This Month",
      yearly: "This Year"
    };
    return labels[filter] || "Custom Range";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg flex-shrink-0">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">
                  Franchise Dashboard
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Filter Section - Completely Redesigned for Mobile */}
        <div className="mb-4 sm:mb-8">
          {/* Mobile Filter Button - Always visible */}
          <div className="sm:hidden mb-3">
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <span className="text-sm text-gray-500 block">Filter by</span>
                  <span className="font-semibold text-gray-800">{getFilterLabel()}</span>
                </div>
              </div>
              {showMobileFilter ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Filter Content - Mobile Dropdown */}
          <div 
            className={`
              sm:block
              ${showMobileFilter ? 'block' : 'hidden'}
              transition-all duration-300 ease-in-out
            `}
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
              {/* Filter Type Selection */}
              <div className="mb-4 sm:mb-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 sm:hidden">
                  Select Period
                </p>
                <div className="grid grid-cols-2 sm:flex gap-2">
                  {["today", "yesterday", "monthly", "yearly"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setIsCustom(false);
                        setShowCustomDate(false);
                        setShowMobileFilter(false);
                      }}
                      className={`
                        px-3 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all
                        ${filter === option && !showCustomDate
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }
                      `}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                  
                  {/* Custom Range Button - Full width on mobile */}
                  <button
                     onClick={() => {
    setShowCustomDate(!showCustomDate);
    setIsCustom(true);
    setFilter("");
  }}
                    className={`
                      col-span-2 sm:col-auto px-3 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all
                      ${showCustomDate
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }
                    `}
                  >
                    Custom Range
                  </button>
                </div>
              </div>

              {/* Custom Date Range - Always visible when selected */}
              {showCustomDate && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                    Select Date Range
                  </p>
                  <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1 sm:hidden">From</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                           value={customDate.startDate}
  max={customDate.endDate || ""}
                          className="w-full pl-9 pr-3 py-3 sm:py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Start date"
                          onChange={(e) =>
                            setCustomDate({ ...customDate, startDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-center sm:block">
                      <span className="text-gray-400 text-sm">to</span>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1 sm:hidden">To</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                       <input
                          type="date"
                          value={customDate.endDate}
                          min={customDate.startDate || ""}
                          className="w-full pl-9 pr-3 py-3 sm:py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onChange={(e) =>
                            setCustomDate({ ...customDate, endDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={applyCustomFilter}
                      className="w-full sm:w-auto mt-2 sm:mt-0 px-6 py-3 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-8">
          <Card
            title="Total Sales"
            value={summary.totalSales}
            icon={TrendingUp}
            color="blue"
            formatCurrency={formatCurrency}
          />
          <Card
            title="Total Profit"
            value={summary.totalProfit}
            icon={DollarSign}
            color="green"
            formatCurrency={formatCurrency}
          />
          <Card
            title="Today's Sales"
            value={today.todaySales}
            icon={Clock}
            color="purple"
            formatCurrency={formatCurrency}
          />
          <Card
            title="Today's Profit"
            value={today.todayProfit}
            icon={Star}
            color="orange"
            formatCurrency={formatCurrency}
          />
        </div>

        {/* Products Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Table 
            title="Top Selling Products" 
            data={products.topSelling}
            icon={TrendingUp}
            type="top"
          />
          <Table 
            title="Low Selling Products" 
            data={products.lowSelling}
            icon={TrendingDown}
            type="low"
          />
        </div>

        {/* Clean Loader - No Black Background */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                {/* Outer ring */}
                <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
                {/* Spinning inner ring */}
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Loading dashboard data...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

/* ================= CARD ================= */
const Card = ({ title, value, icon: Icon, color, trend, formatCurrency }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  };

  const bgLightClasses = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50"
  };

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 rounded-xl sm:rounded-2xl transition-opacity"></div>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-2 sm:mb-4">
          <div className={`p-2 sm:p-3 bg-gradient-to-r ${colorClasses[color]} rounded-lg sm:rounded-xl shadow-lg`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          {trend && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-600 rounded-lg text-xs font-medium">
              {trend}
            </span>
          )}
        </div>
        
        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 truncate">
          {title}
        </p>
        
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 truncate">
          {formatCurrency(value)}
        </h3>
      </div>
    </div>
  );
};

/* ================= TABLE ================= */
const Table = ({ title, data, icon: Icon, type }) => {
  const [expanded, setExpanded] = useState(false);
  const displayData = expanded ? data : data?.slice(0, 3);

  const getHeaderColor = () => {
    return type === 'top' 
      ? 'from-green-50 to-green-100 border-green-200'
      : 'from-orange-50 to-orange-100 border-orange-200';
  };

  const getBadgeColor = () => {
    return type === 'top'
      ? 'bg-green-100 text-green-700'
      : 'bg-orange-100 text-orange-700';
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Table Header */}
      <div className={`bg-gradient-to-r ${getHeaderColor()} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {Icon && (
              <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${getBadgeColor()}`}>
                <Icon className={`w-3 h-3 sm:w-4 sm:h-4`} />
              </div>
            )}
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate">
              {title}
            </h3>
            <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getBadgeColor()}`}>
              {data?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Table Body - Mobile Card View */}
      <div className="block sm:hidden">
        {displayData?.map((item, index) => (
          <div key={item._id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-medium flex-shrink-0">
                {item.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    Quantity: <span className="font-semibold text-gray-900">{item.qty}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    type === 'top' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {type === 'top' ? 'High Demand' : 'Low Demand'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Body - Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 lg:px-6 py-2 lg:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="text-left px-4 lg:px-6 py-2 lg:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="text-left px-4 lg:px-6 py-2 lg:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayData?.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 lg:px-6 py-3 lg:py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-medium text-xs lg:text-sm flex-shrink-0">
                      {item.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-gray-900 truncate max-w-[150px] lg:max-w-[200px]">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-3 lg:py-4">
                  <span className="text-xs lg:text-sm text-gray-900 font-semibold">
                    {item.qty}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-3 lg:py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    type === 'top' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {type === 'top' ? 'High Demand' : 'Low Demand'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {(!data || data.length === 0) && (
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
          <p className="text-xs sm:text-sm text-gray-500">No data available</p>
        </div>
      )}

      {/* Table Footer with Show More/Less */}
      {data && data.length > 3 && (
        <div className="bg-gray-50 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-t border-gray-200">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {expanded ? 'Show less' : `View all ${data.length} items →`}
          </button>
        </div>
      )}
    </div>
  );
};

export default FranchiseDashboard;