

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminDashboard } from "../dashboardSlice";
import {
  Building2,
  TrendingUp,
  Calendar,
  Store,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Clock,
  CalendarDays,
  BarChart3,
  Filter,
  X,
  TrendingUp as TrendingUpIcon,
  Package,
  Award
} from "lucide-react";

export default function SuperAdminDashboard() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [viewType, setViewType] = useState('monthly'); // 'monthly' or 'daily'
  const [showFilters, setShowFilters] = useState(false);
  const [topItemsPeriod, setTopItemsPeriod] = useState('weekly'); // 'today', 'yesterday', 'weekly', 'lastMonth'
  const itemsPerPage = 5;

  // Filter states
  const [filters, setFilters] = useState({
    year: '',
    month: '',
    startDate: '',
    endDate: '',
    franchiseId: ''
  });

  const { superAdminStats, loading } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchSuperAdminDashboard(filters));
  }, [dispatch, filters]);

  /* ================= SAFE DATA ================= */
  const totalFranchises = superAdminStats?.totalFranchises || 0;
  const totalSales = superAdminStats?.totalSales || { daily: 0, weekly: 0, monthly: 0 };
  const franchises = superAdminStats?.franchises || [];

  /* ===== MONTHS ARRAY ===== */
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  /* ===== YEARS ARRAY (last 5 years) ===== */
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  /* ===== CALCULATE MONTHLY TOTALS ===== */
  const monthlyTotals = months.reduce((acc, month) => {
    acc[month] = franchises.reduce((sum, f) => {
      const monthData = f.monthlyChart?.find(m => m.month === month);
      return sum + (monthData?.revenue || 0);
    }, 0);
    return acc;
  }, {});

  const grandTotal = Object.values(monthlyTotals).reduce((a, b) => a + b, 0);

  /* ===== FILTERED & SORTED FRANCHISES ===== */
  const filteredFranchises = franchises
    .filter(f => 
      f.franchiseName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc' 
          ? a.franchiseName?.localeCompare(b.franchiseName)
          : b.franchiseName?.localeCompare(a.franchiseName);
      }
      
      if (sortConfig.key === 'daily') {
        const aDaily = a.sales?.daily || 0;
        const bDaily = b.sales?.daily || 0;
        return sortConfig.direction === 'asc' ? aDaily - bDaily : bDaily - aDaily;
      }
      
      if (sortConfig.key === 'weekly') {
        const aWeekly = a.sales?.weekly || 0;
        const bWeekly = b.sales?.weekly || 0;
        return sortConfig.direction === 'asc' ? aWeekly - bWeekly : bWeekly - aWeekly;
      }
      
      if (sortConfig.key === 'monthly') {
        const aMonthly = a.sales?.monthly || 0;
        const bMonthly = b.sales?.monthly || 0;
        return sortConfig.direction === 'asc' ? aMonthly - bMonthly : bMonthly - aMonthly;
      }
      
      if (sortConfig.key === 'total') {
        const aTotal = a.monthlyChart?.reduce((sum, m) => sum + (m.revenue || 0), 0) || 0;
        const bTotal = b.monthlyChart?.reduce((sum, m) => sum + (m.revenue || 0), 0) || 0;
        return sortConfig.direction === 'asc' ? aTotal - bTotal : bTotal - aTotal;
      }
      
      // Sort by specific month
      const aValue = a.monthlyChart?.find(m => m.month === sortConfig.key)?.revenue || 0;
      const bValue = b.monthlyChart?.find(m => m.month === sortConfig.key)?.revenue || 0;
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

  // Pagination
  const totalPages = Math.ceil(filteredFranchises.length / itemsPerPage);
  const paginatedFranchises = filteredFranchises.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get month revenue for a franchise
  const getMonthRevenue = (franchise, month) => {
    return franchise.monthlyChart?.find(m => m.month === month)?.revenue || 0;
  };

  // Get top selling item for a franchise based on selected period
  const getTopItem = (franchise) => {
    const topItems = franchise.topItems;
    if (!topItems) return null;
    
    switch(topItemsPeriod) {
      case 'today':
        return topItems.today;
      case 'yesterday':
        return topItems.yesterday;
      case 'weekly':
        return topItems.weekly;
      case 'lastMonth':
        return topItems.lastMonth;
      default:
        return null;
    }
  };

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get Sort Icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  // Handle filter changes
const handleFilterChange = (key, value) => {
  setFilters(prev => {
    let newFilters = { ...prev, [key]: value };

    // If selecting year/month → remove date range
    if (key === "year" || key === "month") {
      newFilters.startDate = "";
      newFilters.endDate = "";
    }

    // If selecting custom date → remove year/month
    if (key === "startDate" || key === "endDate") {
      newFilters.year = "";
      newFilters.month = "";
    }

    return newFilters;
  });

  setCurrentPage(1);
};

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      year: '',
      month: '',
      startDate: '',
      endDate: '',
      franchiseId: ''
    });
  };

  // Check if any filter is active
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header with Filter Button - Responsive */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Real-time revenue overview across all franchises</p>
          </div>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors w-full sm:w-auto justify-center ${
              showFilters || hasActiveFilters()
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters() && (
              <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filter Panel - Responsive */}
        {showFilters && (
          <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Filter Dashboard</h3>
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Year Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  value={filters.year}
                  disabled={filters.startDate || filters.endDate}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  value={filters.month}
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                  disabled={!filters.year || filters.startDate || filters.endDate}
                  className={`w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    !filters.year ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">All Months</option>
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>

              {/* Date Range - Start */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  max={filters.endDate || ""}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Date Range - End */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  min={filters.startDate || ""}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Franchise Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Franchise
                </label>
                <select
                  value={filters.franchiseId}
                  onChange={(e) => handleFilterChange('franchiseId', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">All Franchises</option>
                  {franchises.map(f => (
                    <option key={f.franchiseId} value={f.franchiseId}>
                      {f.franchiseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display - Responsive */}
            {hasActiveFilters() && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filters.year && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      Year: {filters.year}
                    </span>
                  )}
                  {filters.month && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      Month: {months[parseInt(filters.month) - 1]}
                    </span>
                  )}
                  {filters.startDate && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      From: {new Date(filters.startDate).toLocaleDateString()}
                    </span>
                  )}
                  {filters.endDate && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      To: {new Date(filters.endDate).toLocaleDateString()}
                    </span>
                  )}
                  {filters.franchiseId && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      Franchise: {franchises.find(f => f.franchiseId === filters.franchiseId)?.franchiseName}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Total Franchises</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalFranchises}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Daily</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  ₹{totalSales.daily?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Weekly</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  ₹{totalSales.weekly?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-indigo-50 rounded-lg">
                <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Monthly</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  ₹{totalSales.monthly?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Items Section - Always Visible on Mobile */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-4 sm:p-6">
          {/* Mobile Header without Toggle */}
          <div className="sm:hidden flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Top Selling Items</h3>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Top Selling Items Across Franchises</h3>
            </div>
            
            {/* Period Toggle for Top Items - Desktop */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-orange-200 p-1">
              <button
                onClick={() => setTopItemsPeriod('today')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  topItemsPeriod === 'today'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTopItemsPeriod('yesterday')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  topItemsPeriod === 'yesterday'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                Yesterday
              </button>
              <button
                onClick={() => setTopItemsPeriod('weekly')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  topItemsPeriod === 'weekly'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTopItemsPeriod('lastMonth')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  topItemsPeriod === 'lastMonth'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                Last Month
              </button>
            </div>
          </div>

          {/* Period Toggle for Top Items - Mobile */}
          <div className="sm:hidden mb-4">
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => setTopItemsPeriod('today')}
                className={`px-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  topItemsPeriod === 'today'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-orange-200 text-gray-600'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTopItemsPeriod('yesterday')}
                className={`px-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  topItemsPeriod === 'yesterday'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-orange-200 text-gray-600'
                }`}
              >
                Yest
              </button>
              <button
                onClick={() => setTopItemsPeriod('weekly')}
                className={`px-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  topItemsPeriod === 'weekly'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-orange-200 text-gray-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTopItemsPeriod('lastMonth')}
                className={`px-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  topItemsPeriod === 'lastMonth'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-orange-200 text-gray-600'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Top Items Grid - Always Visible */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {franchises.map((franchise) => {
                const topItem = getTopItem(franchise);
                return (
                  <div key={franchise.franchiseId} className="bg-white rounded-lg border border-orange-100 p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 truncate pr-2">
                        {franchise.franchiseName}
                      </span>
                      <Package className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                    </div>
                    {topItem ? (
                      <div>
                        <div className="text-base sm:text-lg font-bold text-gray-900 truncate">{topItem.name}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUpIcon className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-500">Qty: {topItem.qty}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm text-gray-400 italic">No data</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* View Toggle - Responsive */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewType('daily')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              viewType === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Daily View</span>
              <span className="sm:hidden">Daily</span>
            </div>
          </button>
          <button
            onClick={() => setViewType('weekly')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              viewType === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Weekly View</span>
              <span className="sm:hidden">Weekly</span>
            </div>
          </button>
          <button
            onClick={() => setViewType('monthly')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              viewType === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Monthly View</span>
              <span className="sm:hidden">Monthly</span>
            </div>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header with Search - Responsive */}
          <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                {viewType === 'daily' ? 'Daily Revenue' : 
                 viewType === 'weekly' ? 'Weekly Revenue' : 
                 'Monthly Analysis'}
                {hasActiveFilters() && viewType === 'monthly' && (
                  <span className="ml-2 text-xs font-normal text-blue-600">
                    (Filtered)
                  </span>
                )}
              </h2>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Daily/Weekly View Table - Responsive */}
          {(viewType === 'daily' || viewType === 'weekly') && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4">
                      <button
                        onClick={() => requestSort('name')}
                        className="flex items-center gap-1 sm:gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                      >
                        Branch
                        {getSortIcon('name')}
                      </button>
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4">
                      <button
                        onClick={() => requestSort(viewType)}
                        className="flex items-center justify-end gap-1 sm:gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 w-full"
                      >
                        {viewType === 'daily' ? 'Daily' : 'Weekly'}
                        {getSortIcon(viewType)}
                      </button>
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4">
                      <button
                        onClick={() => requestSort('monthly')}
                        className="flex items-center justify-end gap-1 sm:gap-2 text-xs font-medium text-blue-600 uppercase tracking-wider hover:text-blue-700 w-full"
                      >
                        Monthly
                        {getSortIcon('monthly')}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFranchises.map((franchise, idx) => {
                    const dailyRevenue = franchise.sales?.daily || 0;
                    const weeklyRevenue = franchise.sales?.weekly || 0;
                    const monthlyTotal = franchise.monthlyChart?.reduce((sum, m) => sum + (m.revenue || 0), 0) || 0;
                    
                    return (
                      <tr 
                        key={idx} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                              {franchise.franchiseName?.charAt(0) || 'B'}
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                              {franchise.franchiseName}
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-2 sm:py-3 px-2 sm:px-4">
                          <span className="text-xs sm:text-sm font-semibold text-green-600">
                            ₹{(viewType === 'daily' ? dailyRevenue : weeklyRevenue).toLocaleString()}
                          </span>
                        </td>
                        <td className="text-right py-2 sm:py-3 px-2 sm:px-4">
                          <span className="text-xs sm:text-sm font-bold text-blue-600">
                            ₹{monthlyTotal.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Total</td>
                    <td className="text-right py-2 sm:py-3 px-2 sm:px-4">
                      <span className="text-xs sm:text-sm font-semibold text-green-600">
                        ₹{paginatedFranchises.reduce((sum, f) => 
                          sum + (viewType === 'daily' ? (f.sales?.daily || 0) : (f.sales?.weekly || 0)), 0
                        ).toLocaleString()}
                      </span>
                    </td>
                    <td className="text-right py-2 sm:py-3 px-2 sm:px-4">
                      <span className="text-xs sm:text-sm font-bold text-blue-600">
                        ₹{paginatedFranchises.reduce((sum, f) => 
                          sum + (f.monthlyChart?.reduce((s, m) => s + (m.revenue || 0), 0) || 0), 0
                        ).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Monthly View Table - Responsive */}
          {viewType === 'monthly' && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4">
                      <button
                        onClick={() => requestSort('name')}
                        className="flex items-center gap-1 sm:gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                      >
                        Branch
                        {getSortIcon('name')}
                      </button>
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-3">
                      <button
                        onClick={() => requestSort('daily')}
                        className="flex items-center justify-end gap-1 sm:gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 w-full"
                      >
                        Daily
                        {getSortIcon('daily')}
                      </button>
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-3">
                      <button
                        onClick={() => requestSort('weekly')}
                        className="flex items-center justify-end gap-1 sm:gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 w-full"
                      >
                        Weekly
                        {getSortIcon('weekly')}
                      </button>
                    </th>
                    {months.map(month => (
                      <th key={month} className="text-right py-2 sm:py-3 px-2 sm:px-3">
                        <button
                          onClick={() => requestSort(month)}
                          className="flex items-center justify-end gap-1 sm:gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 w-full"
                        >
                          {month}
                          {getSortIcon(month)}
                        </button>
                      </th>
                    ))}
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4">
                      <button
                        onClick={() => requestSort('monthly')}
                        className="flex items-center justify-end gap-1 sm:gap-2 text-xs font-medium text-blue-600 uppercase tracking-wider hover:text-blue-700 w-full"
                      >
                        Total
                        {getSortIcon('monthly')}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFranchises.map((franchise, idx) => {
                    const total = franchise.monthlyChart?.reduce((sum, m) => sum + (m.revenue || 0), 0) || 0;
                    const maxRevenue = Math.max(...(franchise.monthlyChart?.map(m => m.revenue) || [0]));
                    const dailyRevenue = franchise.sales?.daily || 0;
                    const weeklyRevenue = franchise.sales?.weekly || 0;
                    
                    return (
                      <tr 
                        key={idx} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                              {franchise.franchiseName?.charAt(0) || 'B'}
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-none">
                              {franchise.franchiseName}
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-2 sm:py-3 px-2 sm:px-3">
                          <span className="text-xs sm:text-sm font-medium text-green-600">
                            ₹{dailyRevenue.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-right py-2 sm:py-3 px-2 sm:px-3">
                          <span className="text-xs sm:text-sm font-medium text-purple-600">
                            ₹{weeklyRevenue.toLocaleString()}
                          </span>
                        </td>
                        {months.map(month => {
                          const revenue = getMonthRevenue(franchise, month);
                          const isMax = revenue === maxRevenue && revenue > 0;
                          
                          return (
                            <td key={month} className="text-right py-2 sm:py-3 px-2 sm:px-3">
                              <span className={`text-xs sm:text-sm font-medium ${
                                isMax ? 'text-blue-600 font-semibold' : revenue > 0 ? 'text-gray-900' : 'text-gray-300'
                              }`}>
                                ₹{revenue.toLocaleString()}
                              </span>
                            </td>
                          );
                        })}
                        <td className="text-right py-2 sm:py-3 px-2 sm:px-4">
                          <span className="text-xs sm:text-sm font-bold text-blue-600">
                            ₹{total.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Total</td>
                    <td className="text-right py-2 sm:py-3 px-2 sm:px-3">
                      <span className="text-xs sm:text-sm font-semibold text-green-600">
                        ₹{paginatedFranchises.reduce((sum, f) => sum + (f.sales?.daily || 0), 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="text-right py-2 sm:py-3 px-2 sm:px-3">
                      <span className="text-xs sm:text-sm font-semibold text-purple-600">
                        ₹{paginatedFranchises.reduce((sum, f) => sum + (f.sales?.weekly || 0), 0).toLocaleString()}
                      </span>
                    </td>
                    {months.map(month => (
                      <td key={month} className="text-right py-2 sm:py-3 px-2 sm:px-3">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          ₹{monthlyTotals[month].toLocaleString()}
                        </span>
                      </td>
                    ))}
                    <td className="text-right py-2 sm:py-3 px-2 sm:px-4">
                      <span className="text-xs sm:text-sm font-bold text-blue-600">
                        ₹{grandTotal.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Empty State */}
          {paginatedFranchises.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Store className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
              <p className="text-sm sm:text-base text-gray-500">No branches found</p>
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear filters to see all branches
                </button>
              )}
            </div>
          )}

          {/* Pagination - Responsive */}
          {filteredFranchises.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                Showing <span className="font-medium text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredFranchises.length)}</span>{' '}
                of <span className="font-medium text-gray-900">{filteredFranchises.length}</span>
              </p>
              
              <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </button>
                
                <span className="text-xs sm:text-sm text-gray-600 sm:hidden">
                  Page {currentPage} of {totalPages}
                </span>
                
                <div className="hidden sm:flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-colors
                        ${currentPage === i + 1 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}