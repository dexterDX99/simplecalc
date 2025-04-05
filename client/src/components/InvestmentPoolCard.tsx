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
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{pool.name} Pool</h3>
            <p className="text-xs text-gray-500">
              {pool.startDate} - {pool.endDate} ({pool.duration})
            </p>
            <p className="text-xs text-red-500 mt-1">
              Last Date to Invest: {pool.closeDate}
            </p>
          </div>
          <span className={`px-2 py-1 ${badgeClasses} text-xs font-medium rounded-full`}>
            {fundingPercentage.toFixed(0)}% Funded
          </span>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Investors: {pool.investors}</span>
            <span>Remaining Slots: {pool.slots}</span>
          </div>
          
          <Progress value={fundingPercentage} className="h-3" />
          
          <div className="flex justify-between mt-2">
            <span className="text-xs font-medium">
              Needed: <span className="text-red-600">PKR {remainingAmount.toLocaleString()}</span>
            </span>
            <span className="text-xs font-medium">
              Target: PKR {Number(pool.target).toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between mt-3 items-center">
            <div>
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                {(Number(pool.minProfitRate) * 100).toFixed(0)}-{(Number(pool.maxProfitRate) * 100).toFixed(0)}% Returns
              </span>
            </div>
            <button 
              className="text-xs font-medium text-primary-600 flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
            >
              {expanded ? 'Hide Details' : 'Show Details'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ml-1 transform ${expanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium">Investment Amount</h4>
              <Link href="/calculator" className="text-xs text-primary-600">
                Calculate Potential Returns →
              </Link>
            </div>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">PKR</span>
              <Input 
                type="number" 
                placeholder="Amount" 
                className="pl-10 w-full"
                value={investment}
                onChange={(e) => onInvestmentChange(e.target.value)}
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
                    <span className="font-medium">PKR {Number(investment).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment Duration:</span>
                    <span className="font-medium">{pool.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Sharing Ratio:</span>
                    <span className="font-medium">Investors {INVESTOR_SHARE * 100}% - Manager {(1 - INVESTOR_SHARE) * 100}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Business Profit Range:</span>
                    <span className="font-medium text-green-600">
                      {MIN_PROFIT_RATE * 100}%-{MAX_PROFIT_RATE * 100}% for 3 months (potential loss possible)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Type:</span>
                    <span className="font-medium">
                      LED Bulb Manufacturing
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Total Profit ({INVESTOR_SHARE * 100}% Share):</span>
                    <span className="font-medium text-green-600">
                      PKR {(Number(investment) * MIN_PROFIT_RATE * INVESTOR_SHARE).toLocaleString(undefined, { maximumFractionDigits: 0 })} - {(Number(investment) * MAX_PROFIT_RATE * INVESTOR_SHARE).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Payout (Capital + Profit):</span>
                    <span className="font-medium text-primary-600">
                      PKR {(Number(investment) + Number(investment) * MIN_PROFIT_RATE * INVESTOR_SHARE).toLocaleString(undefined, { maximumFractionDigits: 0 })} - {(Number(investment) + Number(investment) * MAX_PROFIT_RATE * INVESTOR_SHARE).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-gray-500 text-[10px]">
                  LED Bulb Manufacturing Business: This investment funds a factory producing energy-efficient
                  LED bulbs. Following the Mudarabah model, investors provide capital while experienced managers
                  handle operations. The business targets a {MIN_PROFIT_RATE * 100}%-{MAX_PROFIT_RATE * 100}% profit over 3 months, with {INVESTOR_SHARE * 100}% going to 
                  investors proportional to their contributions. As with all Mudarabah investments, there is a 
                  possibility of capital loss if the business underperforms.
                </p>
              </div>
            )}
            
            {warningMessage && (
              <p className="text-xs text-red-500 mt-2">{warningMessage}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Button 
              className="w-full" 
              onClick={(e) => {
                e.stopPropagation();
                onInvest();
              }}
              disabled={isFull || !investment}
            >
              Invest Now
            </Button>
            
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewBusinessDetails) onViewBusinessDetails();
              }}
              variant="outline"
            >
              Business Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
