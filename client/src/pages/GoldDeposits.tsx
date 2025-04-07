
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { GoldCalculator } from "@/components/GoldCalculator";
import type { Investment, Pool } from '../../shared/schema';

export default function MyInvestments() {
  const { data: userInvestments = [] } = useQuery<Investment[]>({
    queryKey: ['/api/users/1/investments'],
  });

  const { data: pools = [] } = useQuery<Pool[]>({
    queryKey: ['/api/pools'],
  });

  const totalInvested = userInvestments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const minProfitRate = 0.3;
  const maxProfitRate = 0.4;
  const investorShare = 0.6;

  const minTotalExpectedProfit = totalInvested * minProfitRate * investorShare;
  const maxTotalExpectedProfit = totalInvested * maxProfitRate * investorShare;
  const minMonthlyProfit = minTotalExpectedProfit / 3;
  const maxMonthlyProfit = maxTotalExpectedProfit / 3;
  const minTotalReturn = totalInvested + minTotalExpectedProfit;
  const maxTotalReturn = totalInvested + maxTotalExpectedProfit;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Investments</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <GoldCalculator />
        </CardContent>
      </Card>

      {userInvestments && userInvestments.length > 0 && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Investment History</h2>
            <div className="space-y-4">
              {userInvestments.map((userInvestment) => {
                const investmentPool = pools && pools.find((p) => p.id === userInvestment.poolId);
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
