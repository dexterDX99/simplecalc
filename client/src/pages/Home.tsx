import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
// @ts-ignore - Import types directly from shared schema
import type { Pool, Investment } from '../../shared/schema';

export default function Home() {
  const { data: pools = [] } = useQuery<Pool[]>({
    queryKey: ['/api/pools'],
  });

  const { data: userInvestments = [] } = useQuery<Investment[]>({
    queryKey: ['/api/users/1/investments'],
  });

  // Calculate total profit
  const totalInvested = userInvestments && userInvestments.reduce(
    (acc, investment) => acc + Number(investment.amount), 
    0
  );

  const totalProfit = totalInvested * 0.3 * 0.6; // 30% total profit with 60% investor share

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-green-600 font-medium bg-green-50 rounded-full px-3 py-1">
          Shariah Compliant
        </div>
      </div>

      {/* Welcome section */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-md p-5 text-white mb-6">
        <h2 className="text-xl font-semibold mb-2">Welcome to Halal-Tajir</h2>
        <p className="text-sm opacity-90 mb-4">
          Your platform for ethical Shariah-compliant investments following the Mudarabah profit-sharing model.
        </p>
        <Link href="/investments" className="inline-block bg-white text-emerald-600 font-medium px-4 py-2 rounded-md text-sm hover:bg-green-50 transition-colors">
          Browse Investment Plans
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-green-100">
          <p className="text-xs text-gray-500 mb-1">Available Investment Plans</p>
          <p className="text-2xl font-bold text-gray-800">{pools ? pools.length : 0}</p>
          <p className="text-xs text-green-600 mt-1">LED Bulb Manufacturing</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-green-100">
          <p className="text-xs text-gray-500 mb-1">Available Investment Slots</p>
          <p className="text-2xl font-bold text-gray-800">
            {pools ? pools.reduce((acc, pool) => acc + pool.slots, 0) : 0}
          </p>
          <p className="text-xs text-amber-600 mt-1">Limited Availability</p>
        </div>
      </div>

      {/* Your Investment Summary */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Investment Summary</h2>

        {userInvestments && userInvestments.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Total Invested</p>
                <p className="text-lg font-semibold">Rs. {totalInvested.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Investments</p>
                <p className="text-lg font-semibold">{userInvestments.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expected Profit (60% Share)</p>
                <p className="text-lg font-semibold text-green-600">Rs. {totalProfit.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Monthly Returns</p>
                <p className="text-lg font-semibold text-amber-600">Rs. {(totalProfit / 3).toLocaleString()}</p>
              </div>
            </div>

            <Link href="/investments" className="block w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-center py-2 rounded-md text-sm font-medium mt-3 transition-colors">
              View All Investments
            </Link>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-gray-500 mb-4">You haven't made any investments yet</p>
            <Link href="/investments" className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium px-4 py-2 rounded-md text-sm hover:from-emerald-600 hover:to-green-700 transition-colors shadow-sm">
              Start Investing Now
            </Link>
          </div>
        )}
      </div>

      {/* Mudarabah Explanation */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">About Mudarabah Investment</h2>
        <p className="text-sm text-gray-600 mb-3">
          Mudarabah is an Islamic financial partnership where one partner provides capital while the other offers expertise and management. Profits are shared according to a pre-agreed ratio (60% investor, 40% manager).
        </p>
        <div className="bg-gray-50 p-3 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Key Features</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>100% Shariah-compliant profit sharing model</span>
            </li>

            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>60/40 profit split between investors and business managers</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Full transparency in business operations and profit calculations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}