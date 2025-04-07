import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Pool } from "@shared/schema";
import { Link } from "wouter";
import { MIN_PROFIT_RATE, MAX_PROFIT_RATE, INVESTOR_SHARE } from "@/shared/constants";

interface InvestmentPoolCardProps {
  pool: Pool;
  expanded: boolean;
  investment: string;
  warningMessage: string;
  onToggleExpand: () => void;
  onInvestmentChange: (value: string) => void;
  onInvest: () => void;
  onViewBusinessDetails?: () => void;
}

export default function InvestmentPoolCard({ 
  pool, 
  expanded, 
  investment, 
  warningMessage,
  onToggleExpand,
  onInvestmentChange,
  onInvest,
  onViewBusinessDetails
}: InvestmentPoolCardProps) {
  // Calculate funding percentage
  const fundingPercentage = (Number(pool.total) / Number(pool.target)) * 100;
  const remainingAmount = Number(pool.target) - Number(pool.total);
  const calculatedSlots = investment ? Math.floor(Number(investment) / 5000) : 0; // 5000 Rs = 1 slot
  const isFull = Number(pool.total) >= Number(pool.target);

  // Determine badge and progress bar colors
  let badgeClasses = "bg-blue-100 text-blue-800";
  if (fundingPercentage >= 60) badgeClasses = "bg-amber-100 text-amber-800";
  if (fundingPercentage >= 80) badgeClasses = "bg-green-100 text-green-800";
  if (fundingPercentage >= 100) badgeClasses = "bg-red-100 text-red-800";

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden">
      <div className="p-4" onClick={onToggleExpand}>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{pool.name} Pool</h3>
              <p className="text-xs text-gray-500">
                {pool.startDate} - {pool.endDate} ({pool.duration === '3 months' ? '6 months' : pool.duration})
              </p>
              <p className="text-xs text-red-500 mt-1">
                Last Date to Invest: {pool.closeDate}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Start investing with as little as Rs.5,000 only
              </p>
            </div>
            <Link href="/company-profiles" className="text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-md hover:from-emerald-600 hover:to-green-700 transition-all">
              View Company Details →
            </Link>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex flex-col items-end">
              <span className={`px-2 py-1 ${badgeClasses} text-xs font-medium rounded-full mb-1`}>
                {fundingPercentage.toFixed(0)}% Funded (Rs. {Number(pool.total).toLocaleString()})
              </span>
              <span className="text-xs text-gray-600">
                {pool.slots} slots available
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Investors: {pool.investors}</span>
            <span>Remaining Slots: {pool.slots}</span>
          </div>

          <Progress value={fundingPercentage} className="h-3" />

          <div className="flex justify-between mt-2">
            <span className="text-xs font-medium">
              Needed: <span className="text-red-600">Rs. {remainingAmount.toLocaleString()}</span>
            </span>
            <span className="text-xs font-medium">
              Target: Rs. {Number(pool.target).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between mt-3 items-center">
            <div>
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                30 - 40% Estimated Returns
              </span>
            </div>
            <Button 
              className="text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              variant="outline"
              size="sm"
            >
              {expanded ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium">Investment Amount</h4>
              <Button
                variant="link"
                size="sm"
                className="text-xs text-primary-600 p-0"
                onClick={() => window.location.href = '/calculator'}
              >
                Calculate Investments →
              </Button>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 font-medium">Rs.</span>
              <Input 
                type="number" 
                placeholder="Enter investment amount" 
                className="pl-12 w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
                value={investment}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  onInvestmentChange(value);
                }}
                onClick={(e) => e.stopPropagation()}
                disabled={isFull}
              />
            </div>

            {investment && Number(investment) > 0 && (
              <div className="mt-3 text-xs border-t border-gray-200 pt-3">
                <h5 className="font-medium mb-2">Investment Summary (Mudarabah Contract)</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Your Investment:</span>
                    <span className="font-medium">Rs. {Number(investment).toLocaleString()} ({calculatedSlots} slots)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment Duration:</span>
                    <span className="font-medium">6 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Sharing Ratio:</span>
                    <span className="font-medium">Investors {INVESTOR_SHARE * 100}% - Manager {(1 - INVESTOR_SHARE) * 100}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Type:</span>
                    <span className="font-medium">LED Bulb Manufacturing</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Bulbs (Your Share):</span>
                    <span className="font-medium">
                      {Math.floor((Number(investment) / 1500000) * 12500)} bulbs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Profit Per Bulb:</span>
                    <span className="font-medium">Rs. 110</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Total Profit:</span>
                    <span className="font-medium text-green-600">
                      Rs. {Math.floor((Number(investment) / 1500000) * 825000).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Expected Profit:</span>
                    <span className="font-medium text-amber-600">
                      Rs. {Math.floor((Number(investment) / 1500000) * 825000 / 6).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Payout (Capital + Profit):</span>
                    <span className="font-medium text-primary-600">
                      Rs. {(Number(investment) + Math.floor((Number(investment) / 1500000) * 825000)).toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-gray-500 text-[10px]">
                  LED Bulb Manufacturing Business: Investment of Rs. 1.5M produces 12,500 bulbs at Rs. 120/bulb 
                  with Rs. 110 profit per bulb. Total expected profit is Rs. 1.375M, split 60% (Rs. 825,000) for investors 
                  and 40% (Rs. 550,000) for management. Profit is distributed proportionally to investment amount. 
                  As with all Mudarabah investments, there is a possibility of capital loss if the business underperforms.
                </p>
              </div>
            )}

            {warningMessage && (
              <p className="text-xs text-red-500 mt-2">{warningMessage}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5" 
              onClick={(e) => {
                e.stopPropagation();
                onInvest();
              }}
              disabled={isFull || !investment}
            >
              Invest Now
            </Button>


          </div>
        </div>
      )}
    </div>
  );
}