import React, { useState, useEffect } from 'react';
import { apiGet, apiPatch } from '../../../services/apiHelpers'; // Adjust the import path as needed

const CustomerRewards = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rewardsData, setRewardsData] = useState({
    topCustomers: []
  });

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const fetchRewardsData = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/customers/rewards'); // Adjust endpoint if needed
      
      if (response.data.success) {
        setRewardsData({
          topCustomers: response.data.data.topCustomers || []
        });
        setError(null);
      } else {
        setError('Failed to fetch rewards data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('Error fetching rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetCustomerReward = async (customerId) => {
    const confirmReset = window.confirm("Reset this customer's reward points?");
    if (!confirmReset) return;

    try {
      await apiPatch(`/customers/rewards/reset/${customerId}`);
      alert("Reward reset successfully");
      fetchRewardsData(); // reload table
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  // Filter customers who have 90 or more points
  const highPointsCustomers = rewardsData.topCustomers.filter(
    customer => customer.loyaltyPoints >= 90
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer rewards data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-red-700 mt-4">Error</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <button 
            onClick={fetchRewardsData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customer Rewards Dashboard</h1>
        <p className="text-gray-600 mt-2">Customers with 90+ loyalty points are eligible for rewards</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Customers</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{rewardsData.topCustomers.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">90+ Points Customers</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{highPointsCustomers.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Points</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {rewardsData.topCustomers.reduce((sum, customer) => sum + customer.loyaltyPoints, 0)}
          </p>
        </div>
      </div>

      {/* Customers with 90+ Points Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Customers Eligible for Reward (90+ Points)</h2>
          {highPointsCustomers.length > 0 && (
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
              {highPointsCustomers.length} Eligible
            </span>
          )}
        </div>
        
        {highPointsCustomers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No customers have reached 90 points yet</p>
            <p className="text-gray-400 mt-2">Customers will appear here when they earn 90+ loyalty points</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loyalty Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward Eligible</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rewards Redeemed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {highPointsCustomers.map((customer, index) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {customer.loyaltyPoints} pts
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        customer.rewardEligible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {customer.rewardEligible ? 'Eligible' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.rewardsRedeemed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => resetCustomerReward(customer._id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors shadow-sm"
                      >
                        Reset Reward
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Customers Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">All Customers</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loyalty Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress to 90</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rewardsData.topCustomers.map((customer, index) => {
                const pointsNeeded = Math.max(0, 90 - customer.loyaltyPoints);
                const progressPercentage = Math.min((customer.loyaltyPoints / 90) * 100, 100);
                
                return (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        customer.loyaltyPoints >= 90 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.loyaltyPoints}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.loyaltyPoints >= 90 ? (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Eligible for reward
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {pointsNeeded} points to goal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32">
                        <div className="bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              customer.loyaltyPoints >= 90 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerRewards;