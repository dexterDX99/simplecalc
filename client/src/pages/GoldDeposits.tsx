
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { GoldCalculator } from "@/components/GoldCalculator";
import type { Investment } from '../../shared/schema';

export default function MyInvestments() {
  const { data: userInvestments = [] } = useQuery<Investment[]>({
    queryKey: ['/api/users/1/investments'],
  });

  const totalInvested = userInvestments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const minProfitRate = 0.3;
  const maxProfitRate = 0.4;
  const investorShare = 0.6;

  const minTotalExpectedProfit = totalInvested * minProfitRate * investorShare;
  const maxTotalExpectedProfit = totalInvested * maxProfitRate * investorShare;
  const minMonthlyProfit = minTotalExpectedProfit / 3;
  const maxMonthlyProfit = maxTotalExpectedProfit / 3;

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
              {userInvestments.map((investment) => (
                <div key={investment.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Amount Invested</p>
                      <p className="text-sm font-medium">Rs. {Number(investment.amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Investment Date</p>
                      <p className="text-sm font-medium">{new Date(investment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Total Invested</p>
                    <p className="text-base font-semibold">Rs. {totalInvested.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expected Monthly Returns</p>
                    <p className="text-base font-semibold text-green-600">
                      Rs. {minMonthlyProfit.toLocaleString()} - {maxMonthlyProfit.toLocaleString()}
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
