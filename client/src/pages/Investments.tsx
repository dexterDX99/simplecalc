import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import InvestmentPoolCard from '../components/InvestmentPoolCard';
import StatsOverview from '../components/StatsOverview';
import InvestmentDetails from '../components/InvestmentDetails';
import { Button } from '@/components/ui/button';
// @ts-ignore - Import types directly from shared schema
import type { Pool, Investment } from '../../shared/schema';

export default function Investments() {
  const [expandedPoolId, setExpandedPoolId] = useState<number | null>(null);
  const [investment, setInvestment] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('investment') || '';
  });
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // For profit range calculations
  const minProfitRate = 0.3;
  const maxProfitRate = 0.4;
  const investorShare = 0.6;

  const { data: pools = [] } = useQuery<Pool[]>({
    queryKey: ['/api/pools'],
  });

  const { data: userInvestments = [] } = useQuery<Investment[]>({
    queryKey: ['/api/users/1/investments'],
  });

  const handleToggleExpand = (poolId: number) => {
    setExpandedPoolId(expandedPoolId === poolId ? null : poolId);
    setInvestment('');
    setWarningMessage('');
  };

  const handleInvestmentChange = (value: string) => {
    setInvestment(value);
    setWarningMessage('');
  };

  const handleInvest = async (pool: Pool) => {
    if (!investment || Number(investment) <= 0) {
      setWarningMessage('Please enter a valid investment amount');
      return;
    }

    const amount = Number(investment);
    if (amount < 5000) {
      setWarningMessage('Minimum investment amount is Rs. 5,000');
      return;
    }
    
    // Check if amount is in valid increments of 5000
    if (amount % 5000 !== 0 || amount > 500000) {
      setWarningMessage('Investment amount must be in increments of Rs. 5,000 (from 5,000 to 500,000)');
      return;
    }

    const calculatedSlots = Math.floor(amount / 5000);
    if (calculatedSlots > 100) {
      setWarningMessage('Maximum investment amount is Rs. 500,000 (100 slots)');
      return;
    }

    if (pool.slots < calculatedSlots) {
      setWarningMessage(`Not enough slots available. Required: ${calculatedSlots} slots`);
      return;
    }

    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          poolId: pool.id,
          amount: investment,
        }),
      });

      if (!res.ok) throw new Error('Failed to make investment');

      // Reset states and invalidate queries
      setInvestment('');
      setExpandedPoolId(null);

      // Force a refresh of the data
      window.location.reload();
    } catch (error) {
      console.error('Investment error:', error);
      setWarningMessage('Failed to make investment. Please try again.');
    }
  };

  // Get available slots from active pool
  const availableSlots = pools?.length > 0 ? pools[0].slots : 0;

  // Calculate investment totals
  const totalInvested = userInvestments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const minTotalExpectedProfit = totalInvested * minProfitRate * investorShare;
  const maxTotalExpectedProfit = totalInvested * maxProfitRate * investorShare;
  const minMonthlyProfit = minTotalExpectedProfit / 3; // Monthly profit (3-month term)
  const maxMonthlyProfit = maxTotalExpectedProfit / 3;
  const minTotalReturn = totalInvested + minTotalExpectedProfit;
  const maxTotalReturn = totalInvested + maxTotalExpectedProfit;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Investment Plans</h1>

      <StatsOverview poolCount={pools ? pools.length : 0} availableSlots={availableSlots} />

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Investment Pools</h2>
        <div className="space-y-4">
          {pools && pools.map((pool: Pool) => (
            <InvestmentPoolCard
              key={pool.id}
              pool={pool}
              expanded={expandedPoolId === pool.id}
              investment={investment}
              warningMessage={warningMessage}
              onToggleExpand={() => handleToggleExpand(pool.id)}
              onInvestmentChange={handleInvestmentChange}
              onInvest={() => handleInvest(pool)}
              onViewBusinessDetails={() => setShowDetails(!showDetails)}
            />
          ))}
          {showDetails && <div className="mt-4"><InvestmentDetails /></div>}
        </div>
      </div>

      {userInvestments && userInvestments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Investments</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="space-y-4">
              {userInvestments.map((userInvestment: Investment) => {
                const investmentPool = pools && pools.find((p: Pool) => p.id === userInvestment.poolId);
                // Calculate individual investment profits
                const investmentAmount = Number(userInvestment.amount);
                const minExpectedProfit = investmentAmount * minProfitRate * investorShare;
                const maxExpectedProfit = investmentAmount * maxProfitRate * investorShare;

                return investmentPool ? (
                  <div key={userInvestment.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <h3 className="font-medium text-gray-800">{investmentPool.name}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-500">Amount Invested</p>
                        <p className="text-sm font-medium">Rs. {investmentAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Investment Date</p>
                        <p className="text-sm font-medium">{new Date(userInvestment.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Expected Profit (3 Months)</p>
                        <p className="text-sm font-medium text-green-600">
                          Rs. {minExpectedProfit.toLocaleString()} - {maxExpectedProfit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Maturity Date</p>
                        <p className="text-sm font-medium text-amber-600">{investmentPool.endDate}</p>
                      </div>
                      <div className="col-span-2 mt-1 pt-1 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Total Return (Capital + Profit)</p>
                        <p className="text-sm font-medium text-primary-600">
                          Rs. {(investmentAmount + minExpectedProfit).toLocaleString()} - {(investmentAmount + maxExpectedProfit).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>

            {/* Investment Summary Section */}
            <div className="mt-6 pt-4 border-t-2 border-green-100">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Investment Summary</h3>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Total Invested Capital</p>
                    <p className="text-base font-semibold text-gray-800">Rs. {totalInvested.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Number of Investments</p>
                    <p className="text-base font-semibold text-gray-800">{userInvestments.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Expected Profit</p>
                    <p className="text-base font-semibold text-green-600">
                      Rs. {minTotalExpectedProfit.toLocaleString()} - {maxTotalExpectedProfit.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Monthly Profit (Estimated)</p>
                    <p className="text-base font-semibold text-amber-600">
                      Rs. {minMonthlyProfit.toLocaleString()} - {maxMonthlyProfit.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Total Return (Capital + Profit)</p>
                    <p className="text-lg font-bold text-primary-600">
                      Rs. {minTotalReturn.toLocaleString()} - {maxTotalReturn.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-white border border-gray-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Profit Calculation Method</h4>
                <p className="text-xs text-gray-600">
                  Investments follow the Mudarabah model with a 30-40% profit rate range over 3 months. 
                  As an investor, you receive 60% of the generated profits. The business operators receive 
                  the remaining 40% of profits for managing operations. Following Mudarabah principles, there is
                  also a possibility of capital loss if the business underperforms.
                </p>
                <div className="mt-2 text-xs">
                  <p className="text-gray-600">Example calculation:</p>
                  <ul className="list-disc pl-4 text-gray-600 space-y-1 mt-1">
                    <li>Investment amount: Rs. 100,000</li>
                    <li>Total business profit (30-40%): Rs. 30,000 - 40,000</li>
                    <li>Your share (60%): Rs. 18,000 - 24,000</li>
                    <li>Monthly profit: Rs. 6,000 - 8,000</li>
                    <li>Total return after 3 months: Rs. 118,000 - 124,000</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}